import { Router } from 'express';
import countryRoutes from "./countryRoutes";
import locationsRoutes from "./locationsRoutes";
import usersRoutes from "./usersRoutes";
import accessesRoutes from "./accessRoutes";
import photoRoutes from "./photoRoutes";

const router = Router();

router.use("/country", countryRoutes);
router.use("/locations", locationsRoutes);
router.use("/users", usersRoutes);
router.use("/accesses", accessesRoutes);
router.use("/locations", photoRoutes);

export default router;