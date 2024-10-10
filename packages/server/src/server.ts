import express from "express";
import Middlewares from "./middlewares";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database";
import { env } from "./config/env";

const {PORT} = env;
const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://little-pawbook.netlify.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
}));

app.use(cookieParser());
app.use((req, res, next) => {
    res.cookie('cookieName', 'cookieValue', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true
    });
    next();
  });

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(Middlewares.logger);

app.use(routes);

app.use(Middlewares.error);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

export default app;