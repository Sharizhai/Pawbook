import { z } from "zod"
import { getCountryById } from "../controllers/countryController";

export const userValidation = z.object({
    name: z.string().min(1, { message: "Le nom est requis" }), 
    firstname : z.string().min(1, { message: "Le prénom est requis" }), 
    email: z.string().email({ message: "Adresse email invalide" }).refine((email): boolean => {
        return email !== "shrek@swamp.de"
    }),
    password: z.string()
                .min(8, { message: "Le mot de passe doit faire au moins 20 caractères" })
                .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
                .regex(/[!@$#^&(),.?^":|<>{}]/, { message: "Le mot de passe doit contenir au moins un symbole"} )
});

export const locationValidation = z.object({
    countryId : z.string().min(1, { message: "L'id du pays est requis" }),
    name : z.string().min(1, { message: "Le nom de la ville est requis" }),
    freeEntry : z.boolean(),
    price : z.number().min(0, { message: "Le prix doit être supérieur ou égal à 0" }),
    type : z.string().min(1, { message: "Le type de ville est requis" })
});

export const countriesValidation = z.object({
    name : z.string().min(1, { message: "Le nom du pays est requis" }),
    capital : z.string().min(1, { message: "La capitale du pays est requise" }),
    languagesSpoken : z.array(z.string()).min(1, { message: "Au moins une langue parlée est requise" }),
    continent : z.string().min(1, { message: "Le continent est requis" })
});

export const accessesValidation = z.object({
    idLocation : z.string().min(1, { message: "L'id de la ville est requis" }),
    idCountry : z.string().min(1, { message: "L'id du pays est requis" }),
    category : z.array(z.string()).min(1, { message: "Au moins une catégorie est requise" })
});