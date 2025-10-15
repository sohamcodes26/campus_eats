// client/src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    // FIX: Removed padding and background color from this element
    <main className="min-h-screen w-full flex items-center justify-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;