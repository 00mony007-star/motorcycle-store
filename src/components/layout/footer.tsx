import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">MotoGear</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium motorcycle equipment for riders who demand the best. 
              Safety, style, and performance in every product.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">All Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link></li>
              <li><Link href="/brands" className="text-muted-foreground hover:text-foreground">Brands</Link></li>
              <li><Link href="/sale" className="text-muted-foreground hover:text-foreground">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-foreground">Returns</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 MotoGear. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <div className="flex space-x-2">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                📘
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                📷
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                🐦
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}