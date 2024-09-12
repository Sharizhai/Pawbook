import Middlewares from "../middlewares/index";

import { Request, Response } from "express";

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        await Middlewares.storageLocation(req, res, () => {
            res.status(200).json({ message: 'Location updated with photo information' });
        });

    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
};