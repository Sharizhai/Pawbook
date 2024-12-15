import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'animate.css';

import MaterialIconButton from '../components/MaterialIconButton';
import ModerationListPanel from "../components/ModerationListPanel";
import AdminProfilUpdatePanel from '../components/AdminProfileUpdatePanel';


import styles from "../styles/pages/DashboardAdminPage.module.scss";
// import "../css/DashboardAdminPage.css";

const DashboardAdminPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
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
        const fetchAllPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/admin/all`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    console.error("Erreur lors de la récupération de tous les posts");
                    return;
                }

                const postList = await response.json();

                setAllPosts(postList.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de tous les posts:", error);
            }
        };

        fetchAllPosts();
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
        Swal.fire({
            icon: 'warning',
            title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
            background: "#DEB5A5",
            showConfirmButton: true,
            confirmButtonColor: "#A60815",
            confirmButtonText: 'Supprimer',
            showCancelButton: true,
            cancelButtonColor: "#45525A",
            cancelButtonText: 'Annuler',
            color: "#001F31",
            toast: true,
            customClass: {
                background: 'swal-background'
            },
            showClass: {
                popup: `animate__animated
                        animate__fadeInDown
                        animate__faster`
            },
            hideClass: {
                popup: `animate__animated
                        animate__fadeOutUp
                        animate__faster`
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_URL}/users/admin/${userId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        setUsersList(usersList.filter(user => user._id !== userId));
                        Swal.fire({
                            icon: 'success',
                            title: 'Utilisateur supprimé avec succès',
                            background: "#DEB5A5",
                            toast: true,
                            position: 'top'
                        });
                    } else {
                        throw new Error("Échec de la suppression");
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur lors de la suppression de l\'utilisateur',
                        background: "#DEB5A5",
                    });
                }
            }
        });
    };

    return (
        <>

            <div className={styles.mainContainer}>

                <header>
                    <h1 className={styles.title}>Administration</h1>
                </header>

                <main>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.tableColumnTitle}>Nom et Prénom</th>
                                <th className={styles.tableColumnTitle}>Role</th>
                                <th className={styles.tableColumnTitle}>Email</th>
                                <th className={styles.tableColumnTitle}>Nombre de posts</th>
                                <th className={styles.tableColumnTitle}>Nombre de commentaires</th>
                                <th className={styles.tableColumnTitle}>Nombre d'animaux</th>
                                <th className={styles.tableColumnTitle}>Nombre de follows</th>
                                <th className={styles.tableColumnTitle}>Nombre de followers</th>
                                <th className={styles.tableColumnTitle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map(user => (
                                <tr key={user._id}>
                                    <td className={styles.tableRow}>{user.name} {user.firstName}</td>
                                    <td className={styles.tableRow}>{user.role}</td>
                                    <td className={styles.tableRow}>{user.email}</td>
                                    <td className={`${styles.tableRow} ${styles.clickable}`}
                                        onClick={() => handleOpenModerationPanel(user, 'posts')}>
                                        {postCounts[user._id] || 0}</td>
                                    <td className={`${styles.tableRow} ${styles.clickable}`}
                                        onClick={() => handleOpenModerationPanel(user, 'comments')}>
                                        {commentCounts[user._id] || 0}</td>
                                    <td className={styles.tableRow}>{user.animals ? user.animals.length : 0}</td>
                                    <td className={styles.tableRow}>{user.follows ? user.follows.length : 0}</td>
                                    <td className={styles.tableRow}>{user.followers ? user.followers.length : 0}</td>
                                    <td className={`${styles.tableRow} ${styles.tableButtons}`}>
                                        <MaterialIconButton
                                            iconName="lock_reset"
                                            className={styles.resetPwdButton}
                                            onClick={() => handleResetPassword(user.email)}
                                        />
                                        <MaterialIconButton
                                            iconName="edit"
                                            className={styles.editButton}
                                            onClick={() => handleEdit(user._id)}
                                        />
                                        <MaterialIconButton
                                            iconName="delete"
                                            className={styles.deleteButton}
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
                    selectedUserPosts={selectedUserForModeration.posts || []}
                    allPosts={allPosts}
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