import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProfileProvider } from './Customer/context/ProfileContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AddressProvider } from './Customer/context/UserAddressContext.jsx'
import { KycProvider } from './Worker/context/KycContext.jsx'
import { WorkerPersonalInfoProvider } from './Worker/context/workerProfileInfoContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1021812662496-03vmmkqsdskasc4paubrhl3j56nt3u5s.apps.googleusercontent.com">
    <BrowserRouter>
    <AuthProvider>
      <KycProvider>
      <ProfileProvider>
        <AddressProvider>
          <WorkerPersonalInfoProvider>
            <App />
          </WorkerPersonalInfoProvider>
        </AddressProvider>
      </ProfileProvider>
      </KycProvider>
    </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
