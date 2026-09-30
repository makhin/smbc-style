import { Outlet } from 'react-router-dom';

import GlobalHeader from './GlobalHeader';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-page">
      <a className="fixed top-2 left-2 z-200 -translate-y-[calc(100%+var(--space-3))] bg-surface px-3 py-2 text-link focus-visible:translate-y-0" href="#main-content">
        Skip to main content
      </a>
      <GlobalHeader />
      <div id="main-content">
        <Outlet />
      </div>
    </div>
  );
}
