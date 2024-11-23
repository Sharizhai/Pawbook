import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '../components/Button';
import MaterialIconButton from '../components/MaterialIconButton';
import FloatingMenu from '../components/FloatingMenu';
import AuthService from '../services/auth.service';
import floatingMenusData from "../data/floatingMenusData.json"

import "../css/DashboardAdminPage.css";

const DashboardAdminPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);

    const [isUpadateProfilePanelOpen, setIsUpadateProfilePanelOpen] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!verifyLoginResponse.ok) return;

                const { data: userId } = await verifyLoginResponse.json();
                setUser(userId);

            } catch (error) {
                console.error("Erreur lors de la vérification:", error);
            }
        };

        const verifyAdmin = async () => {
            try {
                const verifyAdminResponse = await fetch(`${API_URL}/users/verifyAdmin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (verifyAdminResponse.ok) {
                    const { data } = await verifyAdminResponse.json();
                    if (!data.isAdmin) {
                        navigate('/newsfeed');
                    }
                } else {
                    navigate('/newsfeed');
                }
            } catch (error) {
                console.error("Erreur lors de la vérification admin:", error);
                navigate('/newsfeed');
            }
        };

        verifyUser();
        verifyAdmin();
    }, []);

    useEffect(() => {
        FetchUsers();
    }, []);

    const FetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Erreur lors de la récupération des utilisateurs:", response.status);
                return;
            }

            const list = await response.json();
            console.log(list);
            setUsersList(list.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleProfilePanelOpen = () => {
        setIsUpadateProfilePanelOpen(true);
    };

    const handleProfilePanelClose = () => {
        setIsUpadateProfilePanelOpen(false);
    };

    const handleEdit = (userId) => {
        console.log("Éditer l'utilisateur avec ID:", userId);
    };

    const handleDelete = (userId) => {
        console.log("Supprimer l'utilisateur avec ID:", userId);
    };

    return (
        <>

            <div className="admin-main-container">

                <header>
                    <h1 className="admin-title">Administration</h1>
                </header>

                <main>
                    <table className="admin-user-table">
                        <thead>
                            <tr>
                                <th className="admin-user-table-column-title">Nom et Prénom</th>
                                <th className="admin-user-table-column-title">Role</th>
                                <th className="admin-user-table-column-title">Email</th>
                                <th className="admin-user-table-column-title">Nombre de posts</th>
                                <th className="admin-user-table-column-title">Nombre d'animaux</th>
                                <th className="admin-user-table-column-title">Nombre de follows</th>
                                <th className="admin-user-table-column-title">Nombre de followers</th>
                                <th className="admin-user-table-column-title">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map(user => (
                                <tr key={user._id}>
                                    <td className="admin-user-table-row">{user.name} {user.firstName}</td>
                                    <td className="admin-user-table-row">{user.role}</td>
                                    <td className="admin-user-table-row">{user.email}</td>
                                    <td className="admin-user-table-row">{user.posts ? user.posts.length : 0}</td>
                                    <td className="admin-user-table-row">{user.animals ? user.animals.length : 0}</td>
                                    <td className="admin-user-table-row">{user.follows ? user.follows.length : 0}</td>
                                    <td className="admin-user-table-row">{user.followers ? user.followers.length : 0}</td>
                                    <td className="admin-user-table-row admin-table-buttons">
                                    <MaterialIconButton 
                                        iconName="lock_reset" 
                                        className="admin-reset-pwd-button" 
                                        onClick={() => handleEdit(user._id)}
                                    />
                                    <MaterialIconButton 
                                        iconName="edit" 
                                        className="admin-edit-button" 
                                        onClick={() => handleEdit(user._id)}
                                    />
                                    <MaterialIconButton 
                                        iconName="delete" 
                                        className="admin-delete-button" 
                                        onClick={() => handleDelete(user._id)}
                                    />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </>
    )

};

export default DashboardAdminPage;