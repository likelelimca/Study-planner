import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import './index.css'
import App from './App.jsx'
import { Toaster } from '@/components/ui/toaster'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
