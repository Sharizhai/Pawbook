import path from 'path';
import multer from 'multer';
import Models from '../models/index';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

const generateRandomFileName = () => {
    const randomString : string = Math.random().toString(36).substring(2, 15);
    const timestamp : Date = new Date();
    return `${timestamp}-${randomString}`;
};

const storage = multer.diskStorage({
    destination: (req : Request, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req : Request, file, cb) => {
        const randomFileName : string = generateRandomFileName();
        const extension : string = path.extname(file.originalname);
        cb(null, randomFileName + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 15 }, // Limite de 15 Mo
    fileFilter: (req : Request, file, cb) => {
        const fileTypes : RegExp = /jpeg|jpg|png/;
        const extname : boolean = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype : boolean = fileTypes.test(file.mimetype);

        if (mimetype != null && extname != null) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .jpg and .png files are allowed!'));
        }
    }
});

export const updateLocationWithPhotoInfo = async (req : Request, res : Response, next : NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const locationId = new Types.ObjectId(req.params.id);

        const locationToUpdate : any = Models.locations.where(locationId);
        if (!locationToUpdate) {
            return res.status(404).json({ message: 'Location not found' });
        }

        locationToUpdate.photoName = req.file.filename;
        locationToUpdate.photoType = req.file.mimetype;

        Models.locations.update(locationId, locationToUpdate);

        next();

    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
};

export { upload };