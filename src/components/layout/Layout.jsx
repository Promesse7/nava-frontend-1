import React from 'react';
import CurvedNav from './CurvedNavbar';

const Layout = ({ children, isAdmin = false }) => {
  return (
    <div className="min-h-screen lg:pb-16 lg:p-10 md:p-5 sm:p-2">
      <main className="lg:p-2 md:p-1 sm:p-0">{children}</main>
      <CurvedNav isAdmin={isAdmin} />
    </div>
  );
};

export default Layout;