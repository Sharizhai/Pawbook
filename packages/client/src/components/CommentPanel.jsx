import React from 'react';
import MaterialIconButton from "./MaterialIconButton";
import PostCard from "./PostCard";
import "../css/CommentPanel.css";

const CommentPanel = ({ post, onClose, isProfilePage, editingComment = null, isAdminMode = false}) => {
    return (
        <div className="comment-panel-main-container">
            <div className="comment-panel-close-button-container">
                <span className="comment-panel-close-button-label">Fermer</span>
                <MaterialIconButton
                    className="comment-panel-close-button"
                    iconName="close"
                    onClick={onClose}
                />
            </div>
            <div className="comment-panel-postcard-container">
                <PostCard
                    key={post._id}
                    post={post}
                    isInCommentPanel={true}
                    isProfilePage={isProfilePage}
                    editingComment={editingComment}
                    isAdminMode={isAdminMode}
                />
            </div>
        </div>
    )
};

export default CommentPanel;