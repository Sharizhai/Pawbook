import Model from "../models/index";
import { APIResponse } from "../utils/response";
import crypto from 'crypto';
import fs from "fs";
import path from "path";
import { Request, Response} from 'express';
import { Types } from "mongoose";



const uploadDir = path.join(__dirname, '../uploads');

export const getLocationsAll = async (request : Request, response : Response) => {
    try {
        const locations = await Model.locations.get();
        APIResponse(response, locations, "All locations", 200);
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}

export const getLocationById = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        const location = await Model.locations.where(new Types.ObjectId(id));
        if (location) 
            APIResponse(response, location, "Location found", 200);
        else
            APIResponse(response, null, "Location not found", 404);
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}

export const findLocationByCountry = async (request : Request, response : Response) => {
    try {
        const countryId = request.params.countryId;
        const locations = await Model.locations.fromWhere(new Types.ObjectId(countryId));
        if (locations && locations.length > 0)
            APIResponse(response, locations, "Locations found for the given country ID", 200);
        
        else
            APIResponse(response, [], "No locations found for the given country ID", 404);
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}

export const createALocation = async (request : Request, response : Response) => {
    try {
        const newLocation = request.body;
        await Model.locations.create(newLocation);
        APIResponse(response, newLocation, "Location created", 201);
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}

export const deleteLocationById = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        await Model.locations.delete(new Types.ObjectId(id));
        APIResponse(response, null, "Location deleted", 204);
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}

export const updateLocation = async (request : Request, response :  Response) => {
    try {
        const id = request.params.id;
        const location = request.body;
        await Model.locations.update(new Types.ObjectId(id), location);
        APIResponse(response, location, "Location updated", 200);
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}

export const getPhoto = async (request : Request, response : Response) => {
    try {
        const id = request.params.id;
        const location = await Model.locations.where(new Types.ObjectId(id));
        
        if (location) {
            const photoName = location.photoName;
            const photoType = location.photoType;
            const file = fs.readFileSync(path.join(uploadDir, photoName));
            response.writeHead(200, {"Content-Type": photoType});
            response.end(file);
        }
        else{
            APIResponse(response, null, "Location not found", 404);
        }
    } catch (error : unknown) {
        console.error(error);
        APIResponse(response, error, "error", 500);
    }
}
