import { Router } from 'express';
import usersRoutes from "./usersRoutes";
import photoRoutes from "./photoRoutes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/locations", photoRoutes);

export default router;