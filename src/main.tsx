import './styles/app.css';
import { smbcFaviconUrl } from '@smbc/devextreme-theme/assets';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/x-icon';
favicon.href = smbcFaviconUrl;
document.head.append(favicon);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
