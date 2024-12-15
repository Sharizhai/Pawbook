import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import useAnimalStore from "../stores/animalStore";
import Swal from 'sweetalert2';
import 'animate.css';

import { handleImageClick, handleCloseEnlargedImage } from "../utils/imageUtils";
import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import animalsData from "../data/animalsData.json";
import ClosePanelButton from "./ClosePanelButton";
import InputSelect from "./InputSelect";
import Button from './Button';
import Input from "./Input";

import '../css/AnimalPanel.css';

const AnimalPanel = ({ onClose, onAnimalCreated, onAnimalUpdated, animal = null }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const [raceOptions, setRaceOptions] = useState([]);

    const [enlargedImage, setEnlargedImage] = useState(null);

    const { addAnimal, updateAnimal } = useAnimalStore((state) => state);
    const isEditMode = Boolean(animal);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        picture: "",
        picturePreview: null,
        type: "",
        race: "",
        age: "",
        description: ""
    });

    const [characterCount, setCharacterCount] = useState(0);
    const MAX_CHARS = 150;

    const getImageUrl = (picturePath) => {
        if (!picturePath) return Profil_image;
        if (picturePath.startsWith('http')) return picturePath;
        if (picturePath === Profil_image) return Profil_image;
        return `${API_URL}/uploads/${picturePath}`;
    };

    useEffect(() => {
        if (animal) {
            setFormData({
                name: animal.name,
                picture: animal.picture || "",
                picturePreview: null,
                type: animal.type,
                race: animal.race,
                age: animal.age.toString(),
                description: animal.description || ""
            });
            setCharacterCount(animal.description?.length || 0);
        }
    }, [animal]);

    useEffect(() => {
        if (formData.type && animalsData[formData.type]) {
            setRaceOptions(animalsData[formData.type].map(race => ({
                value: race,
                label: race
            })));
        } else {
            setRaceOptions([]);
        }
    }, [formData.type]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "age") {
            if (!/^\d*$/.test(value)) return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "type" && value === "") {
            setRaceOptions([]);
            setFormData(prev => ({ ...prev, race: "" }));
        }
    };

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        picturePreview: reader.result,
                        picture: file
                    }));
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error("Erreur lors du traitement du fichier:", error);
            }
        }
    };

    const handlePictureDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Confirmez-vous la suppression de la photo de profil ?',
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
                    popup: `animate__animated animate__fadeInDown animate__faster`
                },
                hideClass: {
                    popup: `animate__animated animate__fadeOutUp animate__faster`
                }
            });

            if (result.isConfirmed) {
                const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!verifyLoginResponse.ok) {
                    throw new Error("Utilisateur non connecté");
                }

                // Extraire l'ID de la photo depuis l'URL
                const urlParts = formData.picture.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const photoId = fileName.split('.')[0];

                const deleteResponse = await authenticatedFetch(`${API_URL}/photos/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        photoId,
                        animalId: animal?._id
                    }),
                    credentials: "include"
                });

                if (!deleteResponse.ok) {
                    throw new Error("Erreur lors de la suppression de la photo");
                }

                setFormData(prev => ({
                    ...prev,
                    picture: "",
                    picturePreview: null
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Photo supprimée',
                    text: 'La photo de profil a été supprimée avec succès',
                    background: "#DEB5A5",
                    position: "top",
                    showConfirmButton: false,
                    color: "#001F31",
                    timer: 5000,
                    toast: true
                });
            }
        } catch (error) {
            console.error("Erreur de suppression de photo:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message,
                background: "#DEB5A5",
                position: "top",
                showConfirmButton: false,
                color: "#001F31",
                timer: 5000,
                toast: true
            });
        }
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setFormData(prev => ({
                ...prev,
                description: text
            }));
            setCharacterCount(text.length);
        }
    };

    const handleSelectAll = (e) => {
        e.target.select();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                credentials: "include",
            });

            if (!verifyLoginResponse.ok) {
                throw new Error("Utilisateur non connecté");
            }

            const { data: userId } = await verifyLoginResponse.json();

            // Upload de la photo d'abord si elle existe
            let photoUrl = formData.picture;

            if (formData.picture instanceof File) {
                const uploadData = new FormData();
                uploadData.append('file', formData.picture);

                const photoResponse = await fetch(`${API_URL}/photos/upload`, {
                    method: 'POST',
                    body: uploadData,
                });

                if (!photoResponse.ok) {
                    throw new Error("Erreur lors de l'upload de la photo", err.message, err.stack);
                }

                const { data: photoData } = await photoResponse.json();
                photoUrl = photoData.photoUrl;
            }

            const animalData = {
                name: formData.name,
                picture: photoUrl,
                type: formData.type,
                race: formData.race,
                age: parseInt(formData.age) || 0,
                description: formData.description,
                ownerId: animal?.ownerId || userId
            };

            const animalResponse = await authenticatedFetch(
                isEditMode ? `${API_URL}/animals/${animal._id}` : `${API_URL}/animals/register`,
                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(animalData),
                    credentials: "include"
                }
            );

            const responseData = await animalResponse.json();

            if (!animalResponse.ok) {
                const errorMessages = responseData.data && Array.isArray(responseData.data)
                    ? responseData.data.map(error => error.message).join("\n")
                    : responseData.message || "Erreur lors de l'opération";

                Swal.fire({
                    icon: 'error',
                    title: isEditMode ? 'Mise à jour impossible' : 'Création impossible',
                    html: errorMessages.split("\n").map(msg => `<p>${msg}</p>`).join(''),
                    background: "#DEB5A5",
                    position: "top",
                    showConfirmButton: false,
                    color: "#001F31",
                    timer: 5000,
                    toast: true,
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

                return;
            }

            const savedAnimal = responseData.data;

            if (isEditMode) {
                await updateAnimal(savedAnimal, savedAnimal.ownerId);
                if (onAnimalUpdated) onAnimalUpdated(savedAnimal);
                Swal.fire({
                    icon: 'success',
                    title: 'Profil mis à jour',
                    text: 'Le profil de votre animal a été modifié avec succès',
                    background: "#DEB5A5",
                    position: "top",
                    showConfirmButton: false,
                    color: "#001F31",
                    timer: 5000,
                    toast: true,
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
                await useAnimalStore.getState().addAnimal(savedAnimal);
                if (onAnimalCreated) onAnimalCreated(savedAnimal);
                Swal.fire({
                    icon: 'success',
                    title: 'Animal ajouté',
                    text: 'Votre animal a été ajouté avec succès',
                    background: "#DEB5A5",
                    position: "top",
                    showConfirmButton: false,
                    color: "#001F31",
                    timer: 5000,
                    toast: true,
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
            }

            onClose();

        } catch (error) {
            console.error("Erreur:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message || "Une erreur inattendue s'est produite",
                background: "#DEB5A5",
                position: "top",
                showConfirmButton: false,
                color: "#001F31",
                timer: 5000,
                toast: true,
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
        } finally {
            setIsSubmitting(false);
        }
    }

    const handlePictureClick = (imageSrc) => {
        setEnlargedImage(imageSrc);
    };

    //   const EnlargedImage = ({ src, onClose }) => (
    //     <div className="enlarged-image-overlay" onClick={onClose}>
    //         <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
    //             Fermer
    //             <span className="material-symbols-outlined">close</span>
    //         </button>
    //         <img src={src} alt="Image agrandie" onClick={(e) => e.stopPropagation()} />
    //     </div>
    // );

    return (
        <div className="animal-panel-container">
            <ClosePanelButton onClick={onClose}/>

            <div className="animal-panel-form-container">
                <h1 className="animal-panel-title">
                    {isEditMode
                        ? "Modifier le profil de mon animal"
                        : "Ajouter un animal"
                    }
                </h1>

                <form onSubmit={handleSubmit} className="animal-panel-form">

                    <div className="animal-panel-form-photo">
                        <label htmlFor="picture">Photo de votre animal</label>
                        <div className="animal-panel-form-picture-input-container">
                            <div className="animal-panel-picture-wrapper">
                                <div className="animal-panel-picture-container"
                                    onClick={handlePictureClick}>
                                    <img
                                        src={formData.picturePreview || getImageUrl(formData.picture)}
                                        alt={`Image de profil de ${formData.name || 'l\'animal'}`}
                                        className="animal-panel-picture" />
                                    <button className="animal-panel-delete-button" onClick={handlePictureDelete
                                    }>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="picture"
                                name="photo"
                                accept="image/*"
                                onChange={handlePictureChange}
                                className="animal-panel-picture-input"
                            />
                        </div>
                    </div>

                    <Input
                        label="Nom"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
                        required
                    />

                    <InputSelect
                        label="Type"
                        type="text"
                        name="type"
                        options={[
                            { value: "", label: "Sélectionner un type" },
                            ...Object.keys(animalsData).map(type => ({
                                value: type,
                                label: type
                            }))
                        ]}
                        value={formData.type}
                        onChange={handleSelectChange}
                        required
                    />

                    <InputSelect
                        label="Race"
                        type="text"
                        name="race"
                        options={[
                            { value: "", label: "Sélectionner une race" },
                            ...raceOptions
                        ]}
                        value={formData.race}
                        onChange={handleSelectChange}
                        required
                    />

                    <Input
                        label="Âge"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
                    />

                    <div className="animal-panel-description">
                        <label htmlFor="profileDescription">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={handleDescriptionChange}
                            onFocus={handleSelectAll}
                            value={formData.description}
                            className="animal-panel-input-field"
                            placeholder="Décrivez votre animal en quelques mots"
                            rows="4"
                            maxLength={MAX_CHARS}
                        ></textarea>
                        <div className={`character-count ${characterCount >= MAX_CHARS ? 'at-limit' :
                            characterCount >= MAX_CHARS * 0.9 ? 'near-limit' : ''
                            }`}>
                            {characterCount}/{MAX_CHARS} caractères
                        </div>
                    </div>

                    <div className="validation-button-container">
                        <Button
                            type="submit"
                            label={isEditMode ? "Modifier" : "Ajouter"}
                            disabled={isSubmitting}
                            className="validation-button"
                        />
                    </div>
                </form>
            </div>
            {/* {enlargedImage && (
              <EnlargedImage src={enlargedImage} onClose={() => handleCloseEnlargedImage(setEnlargedImage)} />
          )} */}
        </div>
    );
};

export default AnimalPanel;