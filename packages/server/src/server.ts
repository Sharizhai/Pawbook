import express from "express";
import Middlewares from "./middlewares";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database";
import { env } from "./config/env";

const {PORT, ORIGIN} = env;
const app = express();

app.use(cors({
    origin: ORIGIN,
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "PATH" ],
}));

app.use(cookieParser());
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(Middlewares.logger);

app.use(routes);

app.use(Middlewares.error);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})