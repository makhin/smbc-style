import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { smbcLogoUrl } from '@smbc/devextreme-theme/assets';

export default function GlobalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let animationFrame: number | undefined;

    const updateHeader = () => {
      animationFrame = undefined;

      const currentScrollY = Math.max(window.scrollY, 0);
      const scrollDelta = currentScrollY - lastScrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 0;

      if (menuOpen || currentScrollY <= headerHeight) {
        setHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (Math.abs(scrollDelta) < 8) {
        return;
      }

      setHidden(scrollDelta > 0);
      lastScrollY = currentScrollY;
    };

    const handleScroll = () => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [menuOpen]);

  return (
    <header
      className="global-header sticky top-0 z-100 min-h-(--global-header-height) border-b-[length:var(--global-header-border-width)] border-header-border bg-header [--focus-ring-color:var(--focus-ring-color-on-dark)]"
      data-hidden={hidden}
      ref={headerRef}
      onFocus={() => setHidden(false)}
    >
      <div className="relative mx-auto flex min-h-[calc(var(--global-header-height)-var(--global-header-border-width))] w-full items-center justify-between px-4 py-4 md:py-5">
        <NavLink className="inline-flex items-center gap-4 text-fg-inverse no-underline hover:no-underline" to="/" aria-label="SMBC home">
          <img className="block h-auto w-28 md:h-[42px] md:w-[146px]" src={smbcLogoUrl} alt="SMBC" width="146" height="42" />
          <span className="hidden border-l-[length:var(--border-width-default)] border-border-inverse pl-4 text-lg font-light tracking-[0.02em] text-nav-secondary md:block">Application UI</span>
        </NavLink>

        <button
          className="global-header__menu-button block h-6 w-8 cursor-pointer border-0 bg-transparent p-0 md:hidden"
          type="button"
          aria-controls="global-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          data-open={menuOpen}
          onClick={() => {
            setHidden(false);
            setMenuOpen((open) => !open);
          }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          className={`global-header__nav absolute inset-x-0 top-full flex-col items-stretch gap-0 border-b-[length:var(--border-width-emphasis)] border-header-border bg-header px-4 pt-2 pb-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-b-0 md:bg-transparent md:p-0 ${menuOpen ? 'flex' : 'hidden'}`}
          id="global-navigation"
          aria-label="Global navigation"
          data-open={menuOpen}
        >
          <NavLink className="relative py-3 text-lg font-light tracking-[0.02em] text-fg-inverse no-underline hover:no-underline md:py-2" to="/design-system" onClick={() => setMenuOpen(false)}>
            Design system
          </NavLink>
          <span className="border-t-[length:var(--border-width-default)] border-border-inverse-subtle py-3 text-lg font-light tracking-[0.02em] text-fg-inverse md:border-t-0 md:border-l-[length:var(--border-width-default)] md:py-0 md:pl-6">EMEA</span>
        </nav>
      </div>
    </header>
  );
}
