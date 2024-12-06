import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '../components/Button';
import MaterialIconButton from '../components/MaterialIconButton';
import ModerationListPanel from "../components/ModerationListPanel";
import FloatingMenu from '../components/FloatingMenu';
import AuthService from '../services/auth.service';
import floatingMenusData from "../data/floatingMenusData.json";
import AdminProfilUpdatePanel from '../components/AdminProfileUpdatePanel';

import "../css/DashboardAdminPage.css";

const DashboardAdminPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [postCounts, setPostCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});

    const [isUpdateProfilePanelOpen, setIsUpdateProfilePanelOpen] = useState(false);
    const [isModerationPanelOpen, setIsModerationPanelOpen] = useState(false);
    const [selectedUserForModeration, setSelectedUserForModeration] = useState(null);
    const [moderationSection, setModerationSection] = useState('posts');

    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    useEffect(() => {
        const fetchCommentsAndPostsCounts = async () => {
            const counts = {};
            const postCounts = {};
            for (const user of usersList) {
                try {
                    // Récupération des commentaires
                    const commentResponse = await fetch(`${API_URL}/comments/admin/${user._id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    // Récupération des posts
                    const postResponse = await fetch(`${API_URL}/posts/admin/user/${user._id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    if (!commentResponse.ok || !postResponse.ok) {
                        console.error(`Erreur lors de la récupération des données pour l'utilisateur ${user._id}`);
                        counts[user._id] = 0;
                        postCounts[user._id] = 0;
                        continue;
                    }

                    const commentData = await commentResponse.json();
                    const postData = await postResponse.json();
                    console.log("postData.data : ", postData.data)
                    console.log("postData.data.length : ", postData.data.posts.length)

                    counts[user._id] = commentData.data ? commentData.data.length : 0;
                    postCounts[user._id] = postData.data.posts ? postData.data.posts.length : 0;
                } catch (error) {
                    console.error(`Erreur lors de la récupération des données pour l'utilisateur ${user._id}:`, error);
                    counts[user._id] = 0;
                    postCounts[user._id] = 0;
                }
            }
            setCommentCounts(counts);
            setPostCounts(postCounts);
        };

        if (usersList.length > 0) {
            fetchCommentsAndPostsCounts();
        }
    }, [usersList]);

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
    };

    const handleProfilePanelOpen = () => {
        setIsUpdateProfilePanelOpen(true);
    };

    const handleProfilePanelClose = () => {
        setIsUpdateProfilePanelOpen(false);
    };

    const handleOpenModerationPanel = async (user, section) => {
        try {
            const postsResponse = await fetch(`${API_URL}/posts/admin/user/${user._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const commentsResponse = await fetch(`${API_URL}/comments/admin/${user._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!postsResponse.ok || !commentsResponse.ok) {
                console.error("Erreur lors de la récupération des données de modération");
                return;
            }

            const postsData = await postsResponse.json();
            const commentsData = await commentsResponse.json();

            setSelectedUserForModeration({
                ...user,
                posts: postsData.data.posts ? [...postsData.data.posts] : [],
                comments: commentsData.data || []
            });
            setModerationSection(section);
            setIsModerationPanelOpen(true);
        } catch (error) {
            console.error("Erreur lors de l'ouverture du panneau de modération:", error);
        }
    };

    const handleCloseModerationPanel = () => {
        setIsModerationPanelOpen(false);
        setSelectedUserForModeration(null);
    };

    const handleResetPassword = async (email) => {
        try {
            const response = await fetch(`${API_URL}/passwords/admin/forgotten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccess('Email de réinitialisation envoyé avec succès');
            } else {
                throw new Error("Erreur lors de l'envoi de l'email de réinitialisation");
            }
        } catch (error) {
            setError(error.message);
            console.error('Erreur:', error);
        }
    };

    const handleEdit = async (userId) => {
        const userToEdit = usersList.find(user => user._id === userId);
        if (!userToEdit) return;

        setEditingUser(userToEdit);
        handleProfilePanelOpen();
    };

    const handleUpdateUser = async (userData) => {
        try {
            await FetchUsers();

            setSuccess('Utilisateur mis à jour avec succès');

            handleProfilePanelClose();
            setEditingUser(null);
        } catch (error) {
            setError(error.message);
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/admin/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression de l'utilisateur");
            }

            setUsersList(usersList.filter(user => user._id !== userId));
            setSuccess('Utilisateur supprimé avec succès');
        } catch (error) {
            setError(error.message);
            console.error('Erreur:', error);
        }
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
                                <th className="admin-user-table-column-title">Nombre de commentaires</th>
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
                                    <td className="admin-user-table-row clickable"
                                        onClick={() => handleOpenModerationPanel(user, 'posts')}>
                                        {postCounts[user._id] || 0}</td>
                                    <td className="admin-user-table-row clickable"
                                        onClick={() => handleOpenModerationPanel(user, 'comments')}>
                                        {commentCounts[user._id] || 0}</td>
                                    <td className="admin-user-table-row">{user.animals ? user.animals.length : 0}</td>
                                    <td className="admin-user-table-row">{user.follows ? user.follows.length : 0}</td>
                                    <td className="admin-user-table-row">{user.followers ? user.followers.length : 0}</td>
                                    <td className="admin-user-table-row admin-table-buttons">
                                        <MaterialIconButton
                                            iconName="lock_reset"
                                            className="admin-reset-pwd-button"
                                            onClick={() => handleResetPassword(user.email)}
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

            {isUpdateProfilePanelOpen && editingUser && (
                <AdminProfilUpdatePanel
                    user={editingUser}
                    onClose={() => {
                        handleProfilePanelClose();
                        setEditingUser(null);
                    }}
                    onUpdateSuccess={handleUpdateUser}
                />
            )}

            {isModerationPanelOpen && selectedUserForModeration && (
                <ModerationListPanel
                    user={selectedUserForModeration}
                    posts={selectedUserForModeration.posts || []}
                    comments={selectedUserForModeration.comments || []}
                    onClose={() => setIsModerationPanelOpen(false)}
                    initialSection={moderationSection}
                    onPostDelete={(postId) => {
                        setSelectedUserForModeration(prev => ({
                            ...prev,
                            posts: prev.posts.filter(post => post._id !== postId)
                        }));
            
                        setPostCounts(prev => ({
                            ...prev,
                            [selectedUserForModeration._id]: prev[selectedUserForModeration._id] - 1
                        }));
                    }}    
                />
            )}

        </>
    )

};

export default DashboardAdminPage;