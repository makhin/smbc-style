import '@smbc/ui/styles.css';
import './styles/index.css';
import '@smbc/devextreme-theme/styles.css';
import './styles/smbc-shell.css';
import { smbcFaviconUrl } from '@smbc/devextreme-theme/assets';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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
