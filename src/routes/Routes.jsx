import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from "../components/Layout";
import PostPanel from '../components/PostPanel';

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
  const [isPostPanelOpen, setIsPostPanelOpen] = useState(false);
  console.log("Is post panel open:", isPostPanelOpen);

  const openPostPanel = () => setIsPostPanelOpen(true);
  const closePostPanel = () => setIsPostPanelOpen(false);

  return (
    <>
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gcu" element={<GCUPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/creation" element={<ProfilPage />} />
        <Route path="/forgotten-password" element={<ForgottenPasswordPage />} />

        {/* Routes with Navbar */}
        <Route element={<Layout openPostPanel={openPostPanel} />}>
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/followers" element={<FollowListPage />} />
          <Route path="/follows" element={<FollowListPage />} />
          <Route path="/newsfeed" element={<NewsfeedPage />} />
          <Route path="/pet/creation" element={<PetFormPage />} />
          <Route path="/pet/:id" element={<PetFormPage />} />
          <Route path="/profile/:id" element={<ProfilPage />} />
        </Route>
      </Routes>

      {isPostPanelOpen && <PostPanel onClose={closePostPanel} />}
    </>
  );
};

export default AppRoutes;