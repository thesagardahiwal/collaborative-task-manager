import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from './context/AuthContext.tsx';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
    <ToastContainer position='bottom-right' />
  </StrictMode>
)
