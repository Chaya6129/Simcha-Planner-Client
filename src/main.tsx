import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import { BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.tsx'

const queryClient=new QueryClient()
createRoot(document.getElementById('root')!).render(
<QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
</QueryClientProvider>
)
