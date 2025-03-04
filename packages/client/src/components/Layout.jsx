import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import NavBar from './NavBar';
import authenticatedFetch from '../services/api.service';
import AuthService from '../services/auth.service';

import styles from "../styles/components/Layout.module.scss";
//import '../css/Layout.css';

const Layout = ({ openPostPanel }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const verifyAuth = async () => {
        try {
            if (!AuthService.isAuthenticated()) {
                navigate('/login', { replace: true });
                return;
            }

            const response = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Non autorisé");
                navigate('/login', { replace: true });
                return;
            }

        } catch (error) {
            console.error("Erreur d'authentification:", error);
            navigate('/login', { replace: true });
        } finally {
            setIsLoading(false); // Arrête le chargement
        }
    };

    verifyAuth();
}, [navigate]);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className={styles.appContainer}>
      <NavBar openPostPanel={openPostPanel} />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;