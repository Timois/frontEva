import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Incluye todos los componentes JS de Bootstrap

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UnitProvider } from './context/UnitProvider.jsx'
import { UserProvider } from './context/UserProvider.jsx'
import { CareerProvider } from './context/CareerProvider.jsx'
import { GestionProvider } from './context/GestionProvider.jsx'
import { PeriodProvider } from './context/PeriodProvider.jsx'
import { ExtensionGestionProvider } from './context/ExtensionGestionProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <UserProvider>
        <UnitProvider>
          <CareerProvider>
            <GestionProvider>
              <PeriodProvider>
                <ExtensionGestionProvider>
                  <App />
                </ExtensionGestionProvider>
              </PeriodProvider>
            </GestionProvider>
          </CareerProvider>
        </UnitProvider>
      </UserProvider>
    </StrictMode>
  </BrowserRouter>

)
