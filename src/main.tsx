import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/caveat';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/host.css';
import { MotionProvider } from './motion/motion';
import { App } from './App';
import { boot } from './boot';

boot();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionProvider>
  </StrictMode>,
);
