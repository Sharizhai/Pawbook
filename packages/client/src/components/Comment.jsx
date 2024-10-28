import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from "./MaterialIconButton";
import "../css/Comment.css";

const Comment = ({ author, textContent }) => {
    return (
        <>
            <div className="comment-container">

                <div className="comment-profil-picture-container">
                    <img src={author?.profileImage || Profil_image} alt={`Image de profil de ${author?.firstName} ${author?.name}`} className="comment-profil-picture" />
                </div>

                <div className="comment-name-and-comment">
                    <div className="comment-name-firstname">
                        {author?.firstName} {author?.name}
                    </div>

                    <div className="comment-display">
                        {textContent}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Comment;