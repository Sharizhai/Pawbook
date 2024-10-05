import { Router } from 'express';
import usersRoutes from "./usersRoutes";
import photoRoutes from "./photoRoutes";
import postsRoutes from "./postsRoutes";
import commentsRoutes from "./commentsRoutes";
import likesRoutes from "./likesRoutes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/photos", photoRoutes);
router.use("/posts", postsRoutes);
router.use("/comments", commentsRoutes);
router.use("/likes", likesRoutes);

export default router;