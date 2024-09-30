import { Router } from 'express';
import usersRoutes from "./usersRoutes";
import photoRoutes from "./photoRoutes";
import postsRoutes from "./postsRoutes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/photos", photoRoutes);
router.use("/posts", postsRoutes);

export default router;