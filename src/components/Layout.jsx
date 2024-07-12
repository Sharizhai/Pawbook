import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <>
      <Outlet />
      <NavBar />
    </>
  );
};

export default Layout;