import express from "express";
import Middlewares from "./middlewares";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database";
import { env } from "./config/env";

const {PORT, NODE_ENV} = env;
const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://little-pawbook.netlify.app'];

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(Middlewares.logger);

app.use(routes);

app.use(Middlewares.error);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;