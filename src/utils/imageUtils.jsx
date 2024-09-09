//Functions to enlarge images.

export const handleImageClick = (setEnlargedImage, image) => {
    setEnlargedImage(image);
};

export const handleCloseEnlargedImage = (setEnlargedImage) => {
    setEnlargedImage(null);
};

export const handlePreviousImage = (images, currentIndex, setCurrentIndex) => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
};
  
  export const handleNextImage = (images, currentIndex, setCurrentIndex) => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
};