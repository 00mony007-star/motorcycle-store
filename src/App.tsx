import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { MainLayout } from './components/Layout/MainLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useThemeStore } from './lib/stores/themeStore'
import { useAuthStore } from './lib/stores/authStore'
import { initDB, clearAllData } from './lib/db'
import { seedDatabase } from './lib/db/seed'
import { Toaster } from './components/ui/Toaster'
import { Loader2 } from 'lucide-react'
import { AdminRoute } from './components/admin/AdminRoute'
import { useTranslation } from 'react-i18next'

// Lazy-loaded page imports
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })))
const CategoryPage = React.lazy(() => import('./pages/CategoryPage').then(module => ({ default: module.CategoryPage })))
const CartPage = React.lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })))
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })))
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage').then(module => ({ default: module.OrderConfirmationPage })))
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })))
const AccountPage = React.lazy(() => import('./pages/AccountPage').then(module => ({ default: module.AccountPage })))
const OrderHistoryPage = React.lazy(() => import('./pages/OrderHistoryPage').then(module => ({ default: module.OrderHistoryPage })))

// Lazy-loaded Admin section
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })))
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })))
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage').then(module => ({ default: module.AdminProductsPage })))
const AdminProductEditPage = React.lazy(() => import('./pages/admin/AdminProductEditPage').then(module => ({ default: module.AdminProductEditPage })))
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage').then(module => ({ default: module.AdminCategoriesPage })))
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage').then(module => ({ default: module.AdminOrdersPage })))
const AdminDataPage = React.lazy(() => import('./pages/admin/AdminDataPage').then(module => ({ default: module.AdminDataPage })))
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage').then(module => ({ default: module.AdminSettingsPage })))

const FullPageLoader = () => (
  <div className="fixed inset-0 bg-background flex flex-col justify-center items-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
  </div>
)

const PageLoader = () => (
    <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
)

function App() {
  const { applyTheme } = useThemeStore()
  const { checkAuth } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(true)
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    async function initializeApp() {
      applyTheme()
      await checkAuth()
      await initDB()
      
      const shouldForceSeed = new URLSearchParams(window.location.search).get('seed') === 'true'
      if (shouldForceSeed) {
        await clearAllData()
      }
      
      await seedDatabase()
      setIsInitializing(false)
    }
    initializeApp()
  }, [applyTheme, checkAuth])

  if (isInitializing) {
    return <FullPageLoader />
  }

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order/:id" element={<OrderConfirmationPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductEditPage />} />
            <Route path="products/edit/:id" element={<AdminProductEditPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="data" element={<AdminDataPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}

export default App
