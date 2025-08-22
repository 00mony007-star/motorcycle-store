import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/stores/authStore';
import { Loader2 } from 'lucide-react';

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
