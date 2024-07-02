import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import CGUPage from './GCUPage';
import AccountCreation from './AccountCreationPage';
import DashboardAdmin from './DashboardAdminPage';
import FollowListPage from './FollowListPage';
import LoginPage from './LoginPage';
import NewsfeedPage from './NewsfeedPage';
import PetFormPage from './PetFormPage';
import ProfilPage from './ProfilPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gcu" element={<CGUPage />} />
      <Route path="/signup" element={<AccountCreation />} />
      <Route path="/admin" element={<DashboardAdmin />} />
      <Route path="/follows" element={<FollowListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/newsfeed" element={<NewsfeedPage />} />
      <Route path="/pet/:id?" element={<PetFormPage />} />
      <Route path="/profile/:id?" element={<ProfilPage />} />
    </Routes>
  );
};

export default AppRoutes;