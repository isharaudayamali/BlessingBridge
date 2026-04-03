import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsMenuRef = useRef(null);
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isDashboard = location.pathname === '/dashboard';
  const isLogin = location.pathname === '/login';
  const isCelebrations = location.pathname === '/celebrations';
  const isMembers = location.pathname === '/members';

  useEffect(() => {
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    ];

    fontLinks.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setIsSettingsMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSettingsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsSettingsMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 z-50 w-full max-w-full bg-[#f9f9f7]/80 font-['Noto_Serif'] tracking-tight text-[#1a1c1b] shadow-[0_12px_40px_rgba(115,92,0,0.04)] backdrop-blur-md antialiased dark:bg-[#1a1c1b]/80 dark:text-[#f9f9f7]">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-4 lg:gap-8">
        <button
          type="button"
          className="flex min-w-0 items-center gap-2 sm:gap-3 text-xl font-bold italic text-[#735c00] dark:text-[#d4af37] sm:text-2xl"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="BlessingBridge Logo" className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9" />
          <span className="truncate">BlessingBridge</span>
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          <button
            type="button"
            className={`pb-1 font-semibold transition-all duration-300 ${isHome ? 'border-b-2 border-[#d4af37] text-[#735c00] dark:text-[#d4af37]' : 'text-[#1a1c1b]/60 hover:text-[#735c00] dark:text-[#f9f9f7]/60'}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            type="button"
            className={`pb-1 font-semibold transition-all duration-300 ${isDashboard ? 'border-b-2 border-[#d4af37] text-[#735c00] dark:text-[#d4af37]' : 'text-[#1a1c1b]/60 hover:text-[#735c00] dark:text-[#f9f9f7]/60'}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`pb-1 font-semibold transition-all duration-300 ${isCelebrations ? 'border-b-2 border-[#d4af37] text-[#735c00] dark:text-[#d4af37]' : 'text-[#1a1c1b]/60 hover:text-[#735c00] dark:text-[#f9f9f7]/60'}`}
            onClick={() => navigate('/celebrations')}
          >
            Celebrations
          </button>
          <button
            type="button"
            className={`pb-1 font-semibold transition-all duration-300 ${isMembers ? 'border-b-2 border-[#d4af37] text-[#735c00] dark:text-[#d4af37]' : 'text-[#1a1c1b]/60 hover:text-[#735c00] dark:text-[#f9f9f7]/60'}`}
            onClick={() => navigate('/members')}
          >
            Members
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
        <div ref={settingsMenuRef} className="relative hidden lg:block">
          <button
            type="button"
            className="flex items-center gap-2 text-[#1a1c1b]/60 transition-all duration-300 hover:text-[#735c00]"
            onClick={() => setIsSettingsMenuOpen((prev) => !prev)}
            aria-expanded={isSettingsMenuOpen}
            aria-haspopup="menu"
          >
            <span
              className="material-symbols-outlined align-middle"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
            >
              settings
            </span>
            <span className="text-sm font-medium">Settings</span>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>

          {isSettingsMenuOpen && (
            <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-[#d0c5af]/40 bg-[#f9f9f7] p-2 shadow-[0_12px_36px_rgba(115,92,0,0.16)]">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#1a1c1b]/80 transition-colors hover:bg-[#f1ece0] hover:text-[#735c00]"
                onClick={() => navigate('/dashboard')}
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                View Profile
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#1a1c1b]/80 transition-colors hover:bg-[#f1ece0] hover:text-[#735c00]"
                onClick={() => navigate('/members')}
              >
                <span className="material-symbols-outlined text-base">groups</span>
                Members
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#1a1c1b]/80 transition-colors hover:bg-[#f1ece0] hover:text-[#735c00]"
                onClick={() => navigate('/login')}
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Go to Login
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="hidden rounded-lg px-6 py-2.5 font-medium text-white shadow-sm duration-150 active:scale-95 sm:inline-flex"
          style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
          onClick={() => navigate('/add-member')}
        >
          Add Member
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#735c00] transition-colors hover:bg-[#f1ece0] lg:hidden"
          onClick={() => navigate('/add-member')}
          aria-label="Add Member"
        >
          <span className="material-symbols-outlined">person_add</span>
        </button>

        <div className="hidden h-10 w-10 overflow-hidden rounded-full border border-[#d0c5af]/20 sm:block">
          <button
            type="button"
            className="h-full w-full rounded-full transition-transform duration-300 hover:scale-110"
            onClick={() => navigate('/login')}
          >
            <img
              alt="User Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtqXyRMYjGAA39QXs98IDsfaayZRmfiRdQg9msATLBgo7haYW_4yF551NTZVhbRcABBTilTXiNhzniDmrjPwtQECU8H3u0jGs0KlCENU1Qk53srLvkm7WdSLKEcTRtr0T4o4_WVG2qDyde2ChoCVhWOSfmHJCMSnVvio0zOGiPd6cSGzqD6A70JkfD1d39HJTcDZrdfjCzAR36jd7ww9TeM1k8ZbR4bPNTBMVRs22XJoltSzSJ7SPwWkCPL13Fi3Q_bnv-TmV8ZOJw"
            />
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#735c00] transition-colors hover:bg-[#f1ece0] lg:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-[#d0c5af]/30 bg-[#f9f9f7]/95 px-4 py-4 sm:px-6 lg:hidden">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-left font-semibold transition-colors ${isHome ? 'bg-[#f1ece0] text-[#735c00]' : 'text-[#1a1c1b]/70 hover:bg-[#f1ece0] hover:text-[#735c00]'}`}
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-left font-semibold transition-colors ${isDashboard ? 'bg-[#f1ece0] text-[#735c00]' : 'text-[#1a1c1b]/70 hover:bg-[#f1ece0] hover:text-[#735c00]'}`}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-left font-semibold transition-colors ${isCelebrations ? 'bg-[#f1ece0] text-[#735c00]' : 'text-[#1a1c1b]/70 hover:bg-[#f1ece0] hover:text-[#735c00]'}`}
              onClick={() => navigate('/celebrations')}
            >
              Celebrations
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-left font-semibold transition-colors ${isMembers ? 'bg-[#f1ece0] text-[#735c00]' : 'text-[#1a1c1b]/70 hover:bg-[#f1ece0] hover:text-[#735c00]'}`}
              onClick={() => navigate('/members')}
            >
              Members
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-left font-semibold transition-colors ${isLogin ? 'bg-[#f1ece0] text-[#735c00]' : 'text-[#1a1c1b]/70 hover:bg-[#f1ece0] hover:text-[#735c00]'}`}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;