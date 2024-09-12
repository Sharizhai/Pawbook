import { Types } from "mongoose";
import accesses from '../schemas/accesses';
import { IAccess } from '../types/IAccess';
import countries from "../schemas/countries";


// CRUD to get all accesses
export const getAllAccesses = async () => {
    try {
        return await accesses.find().exec();
    } catch (error : Error) {
        return error.message;
    }
};

// CRUD to get an access from its id
export const findAccessById = async (id : Types.ObjectId) => {
    try {
        return await accesses.findById(id).exec();
    } catch (error : Error) {
        return error.message;
    }
};

export const findAccessesByCountryId = async (id : Types.ObjectId) => {
    try {
        return await accesses.find({ idCountry: id }).exec();
    } catch (error : Error) {
        return error.message;
    }
};

export const findAccessesByLocationId = async (id : Types.ObjectId) => {
    try {
        return await accesses.find({ idLocation: id }).exec();
    } catch (error : Error) {
        return error.message;
    }
};

export const findAccessesByLocationAndCountryId = async (idLocation : Types.ObjectId, idCountry : Types.ObjectId) => {
    try {
        return await accesses.find({ idLocation: idLocation, idCountry: idCountry }).exec();
    } catch (error : Error) {
        return error.message;
    }
};

export const createAccess = async (access :  IAccess) => {
    try {
        return await accesses.create(access);
    } catch (error : Error) {
        return error.message;
    }
};

// CRUD to delete an access by its id
export const deleteAccess = async (id : Types.ObjectId) => {
    try {
        return await accesses.deleteOne({ _id: id });
    } catch (error : Error) {
        return error.message;
    }
};

// CRUD to update an access by its id
export const updateAccess = async (id : Types.ObjectId, updatedAccess : IAccess) => {
    try {
        return await accesses.findByIdAndUpdate(id, updatedAccess, { new: true }).exec();
    } catch (error : Error) {
        return error.message;
    }
};