import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import ClosePanelButton from "./ClosePanelButton";
import MaterialIconButton from "./MaterialIconButton";
import CommentPanel from "./CommentPanel";
import Button from "./Button";

import styles from "../styles/components/ModerationListPanel.module.scss";
// import '../css/ModerationListPanel.css';

const ModerationListPanel = ({ onClose, user, selectedUserPosts = [], posts = [], allPosts = [], comments = [], initialSection = "posts", onPostDelete }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const [userPosts, setUserPosts] = useState(selectedUserPosts);
    const [userComments, setUserComments] = useState(comments);
    const [selectedSection, setSelectedSection] = useState(initialSection);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);

    const handleDeletePost = async (postId) => {
        Swal.fire({
                icon: 'warning',
                title: 'Confirmez-vous la suppression de cette publication ?',
                background: "#DEB5A5",
                position: "center",
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
                    const response = await authenticatedFetch(`${API_URL}/posts/admin/${postId}/${user._id}`, {
                        method: "DELETE",
                        credentials: "include",
                    });

                    if (response.ok) {
                        setUserPosts(userPosts.filter(post => post._id !== postId));

                        if (onPostDelete) {
                            onPostDelete(postId);
                        }
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Publication supprimée avec succès',
                            background: "#DEB5A5",
                            toast: true,
                            position: 'top',
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
                        });
                    } else {
                        throw new Error("Échec de la suppression");
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur lors de la suppression',
                        background: "#DEB5A5",
                    });
                }
            }
        });
    };

    const handleDeleteComment = async (commentId, postId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Confirmez-vous la suppression de ce commentaire ?',
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
                    const response = await authenticatedFetch(`${API_URL}/comments/admin/${postId}/${commentId}/${user._id}`, {
                        method: "DELETE",
                        credentials: "include",
                    });

                    if (response.ok) {
                        setUserComments(userComments.filter(comment => comment._id !== commentId));
                        Swal.fire({
                            icon: 'success',
                            title: 'Commentaire supprimé avec succès',
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
                        title: 'Erreur lors de la suppression',
                        background: "#DEB5A5",
                    });
                }
            }
        });
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
        setIsCommentPanelOpen(true);
    };

    const handleViewPost = (comment) => {

        const associatedPost = allPosts.find(post => {
            return post._id === comment.postId;
        });

        if (associatedPost) {
            setSelectedPost(associatedPost);
            setSelectedComment(comment);
            setIsCommentPanelOpen(true);
        }
    };

    const handleCloseCommentPanel = () => {
        setIsCommentPanelOpen(false);
        setSelectedPost(null);
        setSelectedComment(null);
    };

    return (
        <>
            <div className={styles.mainContainer}>
            <ClosePanelButton onClick={onClose}/>
                <div className={styles.container}>


                    <header>
                        <h1 className={styles.title}>Modération</h1>
                    </header>

                    <div className={styles.sectionToggle}>
                        <Button 
                            className={`${styles.sectionButton} ${selectedSection === 'posts' ? 'active' : ''}`}
                            onClick={() => setSelectedSection('posts')}
                            label="Publications"
                        />
                        <Button 
                            className={`${styles.sectionButton} ${selectedSection === 'comments' ? 'active' : ''}`}
                            onClick={() => setSelectedSection('comments')}
                            label="Commentaires"
                        />
                    </div>

                    <main>
                        {selectedSection === 'posts' ? (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.tableColumnTitle}>ID</th>
                                        <th className={styles.tableColumnTitle}>Date de création</th>
                                        <th className={styles.tableColumnTitle}>Contenu textuel</th>
                                        <th className={styles.tableColumnTitle}>Images</th>
                                        <th className={styles.tableColumnTitle}>Commentaires</th>
                                        <th className={styles.tableColumnTitle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(posts) ? posts.map(post => (
                                        <tr key={post._id}>
                                            <td className={styles.tableRow}>{post._id}</td>
                                            <td className={styles.tableRow}>{new Date(post.createdAt).toLocaleString()}</td>
                                            <td className={styles.tableRow}>{post.textContent || 'Aucun'}</td>
                                            <td className={styles.tableRow}>{post.photoContent?.length || 0}</td>
                                            <td className={styles.tableRow}>{post.comments?.length || 0}</td>
                                            <td className={`${styles.tableRow} ${styles.tableButtons}`}>
                                                <MaterialIconButton
                                                    iconName="edit"
                                                    className={styles.editButton}
                                                    onClick={() => handleEditPost(post)}
                                                />
                                                <MaterialIconButton
                                                    iconName="delete"
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeletePost(post._id)}
                                                />
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className={styles.tableRow}>Aucun post trouvé</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.tableColumnTitle}>ID</th>
                                        <th className={styles.tableColumnTitle}>Date de création</th>
                                        <th className={styles.tableColumnTitle}>Contenu</th>
                                        <th className={styles.tableColumnTitle}>Post associé</th>
                                        <th className={styles.tableColumnTitle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map(comment => (
                                        <tr key={comment._id}>
                                            <td className={styles.tableRow}>{comment._id}</td>
                                            <td className={styles.tableRow}>{new Date(comment.createdAt).toLocaleString()}</td>
                                            <td className={styles.tableRow}>{comment.textContent}</td>
                                            <td className={styles.tableRow}>{comment.postId}</td>
                                            <td className={`${styles.tableRow} ${styles.tableButtons}`}>
                                                <MaterialIconButton
                                                    iconName="visibility"
                                                    className={styles.editButton}
                                                    onClick={() => handleViewPost(comment)}
                                                />
                                                <MaterialIconButton
                                                    iconName="delete"
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteComment(comment._id, comment.postId)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </main>
                </div>
            </div>

            {isCommentPanelOpen && selectedPost && (
                <CommentPanel
                    post={selectedPost}
                    editingComment={selectedComment}
                    onClose={handleCloseCommentPanel}
                    isAdminMode={true}
                />
            )}
        </>
    );
};

export default ModerationListPanel;