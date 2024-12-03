import { Router } from 'express';
import Middlewares from '../middlewares';

const router = Router();

router.post('/refresh', Middlewares.refreshToken, (req, res) => {
    res.status(200).json({ message: "Token refreshed successfully." });
});

export default router;