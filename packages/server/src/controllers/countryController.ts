import Model from "../models/index";
import { APIResponse } from "../utils/response";
import crypto from "crypto";
import { Request, Response} from 'express';
import { Types } from "mongoose";

export const getAllCountries = async (request : Request, response : Response) => {
    try {
        const countrys = await Model.country.get();
        APIResponse(response, countrys, "All country", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const getCountryById = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        const country = await Model.country.where( new Types.ObjectId(id));
        if(country){
            APIResponse(response, country, "country", 200);
        }
        else{
            APIResponse(response, null, "not found", 404);
        }
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const createCountry = async (request : Request, response : Response) => {
    try {
        const newCountry = request.body;
        await Model.country.create(newCountry);
        APIResponse(response, newCountry, "country created", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const deleteCountry = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        await Model.country.delete(new Types.ObjectId(id));
        APIResponse(response, null, "country deleted", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const updateCountry = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        const newCountry = request.body;
        await Model.country.update(new Types.ObjectId(id), newCountry);
        APIResponse(response, newCountry, "country updated", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}