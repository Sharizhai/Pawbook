import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CGUPage from './pages/CGU';
import AccountCreation from './pages/AccountCreation';
import DashboardAdmin from './pages/DashboardAdmin';
import FollowListPage from './pages/FollowListPage';
import LoginPage from './pages/LoginPage';
import NewsFeedPage from './pages/NewsFeedPage';
import PetFormPage from './pages/PetFormPage';
import ProfilPage from './pages/ProfilPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cgu" element={<CGUPage />} />
      <Route path="/signup" element={<AccountCreation />} />
      <Route path="/admin" element={<DashboardAdmin />} />
      <Route path="/follows" element={<FollowListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/feed" element={<NewsFeedPage />} />
      <Route path="/pet/new" element={<PetFormPage />} />
      <Route path="/profile/:id" element={<ProfilPage />} />
    </Routes>
  );
};

export default AppRoutes;