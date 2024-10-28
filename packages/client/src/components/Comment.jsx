import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from "./MaterialIconButton";
import "../css/Comment.css";

const Comment = ({post}) => {
    return(
        <>
            <div className="comment-container">

                <div className="comment-profil-picture-container">
                <img src={Profil_image} alt="Image de profil de"  className="comment-profil-picture" />
                </div>

                <div className="comment-name-and-comment">
                <div className="comment-name-firstname">
                    Jade Besserve-Moullahem
                </div>

                <div className="comment-display">
                    bla bla test
                </div>
                </div>
            </div>
        </>
    )
}

export default Comment;