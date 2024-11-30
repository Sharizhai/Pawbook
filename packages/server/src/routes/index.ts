import { Router } from 'express';
import usersRoutes from "./usersRoutes";
import photoRoutes from "./photoRoutes";
import postsRoutes from "./postsRoutes";
import commentsRoutes from "./commentsRoutes";
import likesRoutes from "./likesRoutes";
import followsRoutes from "./followsRoutes";
import followersRoutes from "./followersRoutes";
import animalsRoutes from "./animalsRoutes";
import passwordsRoutes from "./passwordsRoutes";
import refreshRoutes from "./refreshRoutes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/photos", photoRoutes);
router.use("/posts", postsRoutes);
router.use("/comments", commentsRoutes);
router.use("/likes", likesRoutes);
router.use("/follows", followsRoutes);
router.use("/followers", followersRoutes);
router.use("/animals", animalsRoutes);
router.use("/passwords", passwordsRoutes);
router.use("/auth", refreshRoutes)

export default router;