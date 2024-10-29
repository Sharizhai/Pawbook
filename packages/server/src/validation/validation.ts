import { z } from "zod";
import { Types } from "mongoose";

//En cas de besoin, on a une liste d'adresses e-mail blacklistées
//TODO: 
//Faire un vrai système de blacklistage (par e-mail, IP...)
const blacklistedEmails = ["shrek@swamp.de", "donkey@swamp.de"];

export const userValidation = z.object({
    name: z.string().min(2, { message: "Le nom est requis" }),
    firstName: z.string().min(2, { message: "Le prénom est requis" }),
    email: z.string().email({ message: "Adresse e-mail invalide" }).refine((email): boolean => {
        return !blacklistedEmails.includes(email)
    }, { message: "Cette adresse email n'est pas autorisée" }),
    password: z.string()
        .min(12, { message: "Le mot de passe doit faire au moins 12 caractères" })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
        .regex(/[!@$#^&(),.?^":|<>{}]/, { message: "Le mot de passe doit contenir au moins un symbole" }),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    profilePicture: z.string().optional(),
    profileDescription: z.string().max(150, { message: "La description ne doit pas dépasser 150 caractères" }).optional(),
    posts: z.array(z.instanceof(Types.ObjectId)).optional(),
    animals: z.array(z.instanceof(Types.ObjectId)).optional(),
    follows: z.array(z.instanceof(Types.ObjectId)).optional(),
    followers: z.array(z.instanceof(Types.ObjectId)).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export const userUpdateValidation = z.object({
    name: z.string().min(2, { message: "Le nom est requis" }),
    firstName: z.string().min(2, { message: "Le prénom est requis" }),
    email: z.string().email({ message: "Adresse e-mail invalide" }).refine((email): boolean => {
        return !blacklistedEmails.includes(email)
    }, { message: "Cette adresse email n'est pas autorisée" }),
    profilePicture: z.string().optional(),
    profileDescription: z.string().max(150, { message: "La description ne doit pas dépasser 150 caractères" }).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export const postValidation = z.object({
    authorId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "L'ID de l'auteur doit être une string valide pour un ObjectId",
    }),
    textContent: z.string().min(1, { message: "Le contenu du post ne peut pas être vide" }).optional(),
    photoContent: z.array(z.string().url({ message: "L'URL de la photo n'est pas valide" })).optional(),
    likes: z.array(z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "L'ID du like doit être une string valide pour un ObjectId",
    })).optional(),
    comments: z.array(z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "L'ID du commentaire doit être une string valide pour un ObjectId",
    })).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    updated: z.boolean().optional(),
}).partial();

export const likeValidation = z.object({
    authorId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "L'ID de l'auteur doit être une string valide pour un ObjectId",
    }),
    postId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "L'ID de l'auteur doit être une string valide pour un ObjectId",
    }).optional(),
    animalId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "L'ID de l'auteur doit être une string valide pour un ObjectId",
    }).optional(),
});

export const commentValidation = z.object({
    authorId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID de l'auteur doit être un ObjectId valide" }),
    postId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID du post doit être un ObjectId valide" }),
    textContent: z.string().min(1, { message: "Le contenu du commentaire ne peut pas être vide" }),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    updated: z.boolean().optional(),
});

export const animalValidation = z.object({
    ownerId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID du propriétaire doit être un ObjectId valide" }),
    name: z.string().min(3, { message: "Le nom de l'animal est requis" }),
    picture: z.string().url({ message: "L'URL de l'image n'est pas valide" }).optional(),
    type: z.string().min(3, { message: "Le type de l'animal est requis" }),
    race: z.string().min(3, { message: "La race de l'animal est requise" }),
    age: z.number().min(0, { message: "L'âge doit être un nombre positif" }).optional(),
    description: z.string().min(1, { message: "La description ne peut pas être vide" }).max(150, { message: "La description ne doit pas dépasser 150 caractères" }).optional(),
    likes: z.array(z.instanceof(Types.ObjectId, { message: "L'ID du like doit être un ObjectId valide" })).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    updated: z.boolean().optional(),
});

export const followValidation = z.object({
    followerUser: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID de l'utilisateur suiveur doit être un ObjectId valide" }),
    followedUser: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID de l'utilisateur suivi doit être un ObjectId valide" }),
});

export const followerValidation = z.object({
    userId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID de l'utilisateur suivi doit être un ObjectId valide" }),
    followerUser: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "L'ID de l'utilisateur suiveur doit être un ObjectId valide" }),
});