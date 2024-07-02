import React from 'react';
import { useParams } from 'react-router-dom';

const PetFormPage = () => {
  const { id } = useParams();

  if (id) {
    // Mode modification
    return <h1>Modifier le profil de l'animal avec l'ID : {id}</h1>;
  } else {
    // Mode création
    return <h1>Créer un nouveau profil d'animal</h1>;
  }
};

export default PetFormPage;