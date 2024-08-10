import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import '../css/Layout.css';

const Layout = ({openPostPanel}) => {
  return (
    <div className="app-container">
      <NavBar openPostPanel={openPostPanel} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;