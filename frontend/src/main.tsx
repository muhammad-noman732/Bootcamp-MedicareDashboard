import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './lib/store/store.ts'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </GoogleOAuthProvider>

)