-- Enable Realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE prices;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE promotions;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE carts;

-- Create a function to notify clients of stock changes
CREATE OR REPLACE FUNCTION notify_stock_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify when stock goes low or out of stock
    IF NEW.stock <= NEW.low_stock_threshold AND OLD.stock > NEW.low_stock_threshold THEN
        PERFORM pg_notify(
            'stock_alert',
            json_build_object(
                'product_id', NEW.product_id,
                'stock', NEW.stock,
                'threshold', NEW.low_stock_threshold,
                'type', 'low_stock'
            )::text
        );
    END IF;
    
    IF NEW.stock = 0 AND OLD.stock > 0 THEN
        PERFORM pg_notify(
            'stock_alert',
            json_build_object(
                'product_id', NEW.product_id,
                'stock', NEW.stock,
                'type', 'out_of_stock'
            )::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_stock_alert 
    AFTER UPDATE ON inventory 
    FOR EACH ROW 
    WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
    EXECUTE FUNCTION notify_stock_change();

-- Function to handle order status changes
CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into order status history
    INSERT INTO order_status_history (order_id, status, notes, created_by)
    VALUES (NEW.id, NEW.status, 'Status updated', auth.uid());
    
    -- Notify about status change
    PERFORM pg_notify(
        'order_status_change',
        json_build_object(
            'order_id', NEW.id,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'user_id', NEW.user_id
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_status_change 
    AFTER UPDATE ON orders 
    FOR EACH ROW 
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_order_status_change();

-- Function to update review aggregates
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Calculate new averages
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, review_count
    FROM reviews 
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);
    
    -- Notify about rating change
    PERFORM pg_notify(
        'product_rating_update',
        json_build_object(
            'product_id', COALESCE(NEW.product_id, OLD.product_id),
            'avg_rating', avg_rating,
            'review_count', review_count
        )::text
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating 
    AFTER INSERT OR UPDATE OR DELETE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_product_rating();

-- Create materialized view for analytics (refreshed periodically)
CREATE MATERIALIZED VIEW analytics_daily AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as order_count,
    SUM(total_cents) as revenue_cents,
    AVG(total_cents) as avg_order_value_cents,
    COUNT(DISTINCT user_id) as unique_customers
FROM orders 
WHERE status NOT IN ('cancelled', 'refunded')
    AND created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE UNIQUE INDEX idx_analytics_daily_date ON analytics_daily(date);

-- Function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily;
END;
$$ LANGUAGE plpgsql;

-- Schedule analytics refresh (requires pg_cron extension in production)
-- SELECT cron.schedule('refresh-analytics', '0 1 * * *', 'SELECT refresh_analytics();');