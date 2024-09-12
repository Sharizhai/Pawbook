import { APIResponse } from "../utils/response";
import crypto from "crypto";
import { Request, Response} from 'express';
import { Types } from "mongoose";
import Model from "../models/index";

export const getAllAccesses = async (request : Request, response : Response) => {
    try {
        const access = await Model.access.get();
        APIResponse(response, access, "All access", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const getAccessById = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        const access = await Model.access.where(new Types.ObjectId(id));
        if(access){
            APIResponse(response, access, "Access", 200);
        }
        else{
            APIResponse(response, null, "Access not found", 404);
        }
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const createAccess = async (request : Request, response: Response) => {
    try {
        const newAccess = request.body;
        await Model.access.create(newAccess);
        APIResponse(response, newAccess, "Access created", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const deleteAccess = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        await Model.access.delete(new Types.ObjectId(id));
        APIResponse(response, null, "Access deleted", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const updateAccess = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        const newAccess = request.body;
        await Model.access.update(new Types.ObjectId(id), newAccess);
        APIResponse(response, newAccess, "Access updated", 200);
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const getAccessByLocationIdAndCountryId = async (request : Request, response : Response) => {
    try {
        const idLocation = request.params.idLocation;
        const idCountry = request.params.idCountry;
        const access = await Model.access.whereCountryLocation(new Types.ObjectId(idLocation), new Types.ObjectId(idCountry));
        if(access.length > 0) {
            APIResponse(response, access, "Access found", 200);
        }
        else{
            APIResponse(response, null, "Access not found", 404);
        }
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const getAccessByLocationId = async (request : Request, response :  Response) => {
    try {
        const idLocation = request.params.id;
        const access = await Model.access.whereLocation(new Types.ObjectId(idLocation));
        if(access.length > 0) {
            APIResponse(response, access, "Access found", 200);
        }
        else{
            APIResponse(response, null, "Access not found", 404);
        }
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}

export const getAccessByCountryId = async (request : Request, response : Response) => {
    try {
        const idCountry = request.params.id;
        const access = await Model.access.whereCountry(new Types.ObjectId(idCountry));
        if(access.length > 0) {
            APIResponse(response, access, "Access found", 200);
        }
        else{
            APIResponse(response, null, "Access not found", 404);
        }
    } catch (error : unknown) {
        APIResponse(response, error, "error", 500);
    }
}