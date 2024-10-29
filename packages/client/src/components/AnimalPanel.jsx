import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import useAnimalStore from "../stores/animalStore";
import Swal from 'sweetalert2';
import 'animate.css';

import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from './MaterialIconButton';
import AuthService from '../services/auth.service';
import Button from './Button';
import Input from "./Input";

import '../css/AnimalPanel.css';

const AnimalPanel = ({ onClose, onAnimalCreated, onAnimalUpdated, animal = null }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const { addAnimal, updateAnimal } = useAnimalStore((state) => state);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        picture: "",
        type: "",
        race: "",
        age: "",
        description: ""
    });

    const [characterCount, setCharacterCount] = useState(0);
    const MAX_CHARS = 150;

    useEffect(() => {
        if (animal) {
          setFormData({
            name: animal.name,
            picture: animal.picture || Profil_image,
            type: animal.type,
            race: animal.race,
            age: animal.age.toString(),
            description: animal.description || ""
          });
          setCharacterCount(animal.description?.length || 0);
        }
      }, [animal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => ({
              ...prev,
              picture: reader.result
            }));
          };
          reader.readAsDataURL(file);
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
        setError("");
    
        try {
          const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${AuthService.getToken()}`
            },
            credentials: "include",
          });
    
          if (!verifyLoginResponse.ok) {
            throw new Error("Utilisateur non connecté");
          }
    
          const { data: userId } = await verifyLoginResponse.json();
    
          const animalData = {
            ...formData,
            ownerId: animal?.ownerId || userId,
            age: parseInt(formData.age) || 0
          };
    
          const method = animal ? "PUT" : "POST";
          const url = animal ? `${API_URL}/animals/${animal._id}` : `${API_URL}/animals/register`;
    
          const response = await authenticatedFetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify(animalData),
            credentials: "include",
          });
    
          if (!response.ok) {
            throw new Error("Erreur lors de la création/modification de l'animal");
          }
    
          const savedAnimal = await response.json();
          if (animal) {
            updateAnimal(savedAnimal.data);
            onAnimalUpdated(savedAnimal.data);
          } else {
            addAnimal(savedAnimal.data);
            onAnimalCreated(savedAnimal.data);
          }
          onClose();
    
        } catch (error) {
          console.error("Erreur:", error);
          setError(error.message);
        } finally {
          setIsSubmitting(false);
        }
      };

    return (
        <div className="animal-panel-container">
            <div className="animal-panel-close-button-container">
                <span className="animal-panel-close-button-label">Fermer</span>
                <MaterialIconButton
                    className="animal-panel-close-button"
                    iconName="close"
                    onClick={onClose}
                />
            </div>

            <div className="animal-panel-form-container">
                <h1 className="animal-panel-title">Ajouter un animal</h1>

                <form onSubmit={handleSubmit} className="animal-panel-form">

                    <div className="animal-panel-form-photo">
                        <label htmlFor="picture">Photo de votre animal</label>
                        <div className="animal-panel-form-picture-input-container">

                            <div className="animal-panel-picture-container">
                                <img src={formData.picture || Profil_image} alt={`Image de profil de l'animal de`} className="animal-panel-picture" />
                            </div>
                            <input
                                type="file"
                                id="picture"
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

                    <Input
                        label="Type"
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
                        required
                    />

                    <Input
                        label="Race"
                        type="text"
                        name="race"
                        value={formData.race}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
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

                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="validation-button-container">
                        <Button
                            type="submit"
                            label="Ajouter"
                            disabled={isSubmitting}
                            className="validation-button"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnimalPanel;