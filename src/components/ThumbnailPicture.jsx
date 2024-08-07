import React from 'react';
import '../css/ThumbnailPicture.css';
import Post_image from "../assets/dog-3724261_640.jpg"
import Post_image_2 from "../assets/dog-4072161_640.jpg"

const ThumbnailPicture = () => {
    return (
        <>
            <div className="thumbnail-picture-container">
                <img src={Post_image_2} alt="Photo de " className="thumbnail-picture" />
            </div>
        </>
    );
};

export default ThumbnailPicture;