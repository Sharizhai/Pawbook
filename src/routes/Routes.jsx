import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from "../components/Layout";

import HomePage from './HomePage';
import GCUPage from './GCUPage';
import SignUpPage from './SignUpPage';
import DashboardAdmin from './DashboardAdminPage';
import FollowListPage from './FollowListPage';
import LoginPage from './LoginPage';
import NewsfeedPage from './NewsfeedPage';
import PetFormPage from './PetFormPage';
import ProfilPage from './ProfilPage';
import ForgottenPasswordPage from './ForgottenPasswordPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes without Navbar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/gcu" element={<GCUPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Routes with Navbar */}
      <Route element={<Layout />}>
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/followers" element={<FollowListPage />} />
        <Route path="/follows" element={<FollowListPage />} />
        <Route path="/newsfeed" element={<NewsfeedPage />} />
        <Route path="/pet/creation" element={<PetFormPage />} />
        <Route path="/pet/:id" element={<PetFormPage />} />
        <Route path="/profile/creation" element={<ProfilPage />} />
        <Route path="/profile/:id" element={<ProfilPage />} />
        <Route path="/forgotten-password" element={<ForgottenPasswordPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;