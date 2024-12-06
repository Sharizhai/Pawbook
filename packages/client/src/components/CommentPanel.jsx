import React from 'react';

import ClosePanelButton from "./ClosePanelButton";
import PostCard from "./PostCard";
import "../css/CommentPanel.css";

const CommentPanel = ({ post, onClose, isProfilePage, editingComment = null, isAdminMode = false}) => {
    return (
        <div className="comment-panel-main-container">
            <ClosePanelButton onClick={onClose}/>
            
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