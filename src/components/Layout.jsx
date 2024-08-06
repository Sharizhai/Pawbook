import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import '../css/Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;