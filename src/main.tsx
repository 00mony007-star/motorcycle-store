import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './i18n'; // Initialize i18next
import './index.css'
import { Loader2 } from 'lucide-react'

const queryClient = new QueryClient()

const FullPageLoader = () => (
    <div className="fixed inset-0 bg-background flex flex-col justify-center items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<FullPageLoader />}>
        <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
        </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
