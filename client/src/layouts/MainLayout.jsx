import React, { useState } from 'react'; // <--- useState is now needed
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AiButton from '../components/common/AiButton';
import AiChatPanel from '../components/common/AiChatPanel';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- 1. ADDED STATE for the mobile menu ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentLinks = [
    { name: 'Browse Canteens', path: '/student/browse' },
    { name: 'My Orders', path: '/student/orders' },
    { name: 'Profile', path: '/student/profile' },
  ];

  const canteenLinks = [
    { name: 'Order Management', path: '/canteen/orders' },
    { name: 'Menu', path: '/canteen/menu' },
    { name: 'Analytics', path: '/canteen/analytics' },
    { name: 'Profile', path: '/canteen/profile' },
  ];

  const navLinks = user?.role === 'student' ? studentLinks : canteenLinks;

  return (
    <div className="min-h-screen bg-brand-light-gray">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* 1. LEFT: Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-brand-dark-blue">
                CampusEats
              </Link>
            </div>

            {/* 2. CENTER: Desktop Nav Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${isActive
                        ? 'bg-[green] text-white'
                        : 'text-brand-text-light hover:bg-gray-100'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* 3. RIGHT: Desktop User Info & Mobile Hamburger */}
            <div className="flex items-center">
              {/* Desktop: Welcome & Logout */}
              <div className="hidden md:flex items-center ml-4">
                <div className="mr-4 text-sm text-brand-text-dark">
                  Welcome, {user?.name.split(' ')[0]}
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-brand-text-light hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>

              {/* Mobile: Hamburger Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </nav>

        {/* --- MOBILE MENU DROPDOWN (This code is unchanged) --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                      ? 'bg-[green] text-white'
                      : 'text-brand-text-dark hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            {/* User/Logout section for mobile */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <UserIcon />
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Welcome, {user?.name.split(' ')[0]}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Conditionally render AI chat components for students only */}
      {user?.role === 'student' && (
        <>
          <AiButton onClick={() => setIsChatOpen(true)} />
          <AiChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}
    </div>
  );
};

export default MainLayout;