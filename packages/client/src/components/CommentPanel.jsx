import React from 'react';

import ClosePanelButton from "./ClosePanelButton";
import PostCard from "./PostCard";

import styles from "../styles/components/CommentPanel.module.scss";
//import "../css/CommentPanel.css";

const CommentPanel = ({ post, onClose, isProfilePage, editingComment = null, isAdminMode = false}) => {
    return (
        <div className={styles.commentPanelMainContainer}>
            <ClosePanelButton onClick={onClose}/>
            
            <div className={styles.commentPanelPostcardContainer}>
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