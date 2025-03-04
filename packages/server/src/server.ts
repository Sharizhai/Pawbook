import express from "express";
import Middlewares from "./middlewares";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database";
import { env } from "./config/env";
import multer from "multer";
import cloudinaryModule from 'cloudinary';
import helmet from 'helmet';
import { CloudinaryStorage } from "multer-storage-cloudinary";

const {PORT, NODE_ENV} = env;
const isProduction = NODE_ENV === 'production';

const app = express();

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
}));

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        `https://${process.env.FRONTEND_DOMAIN}`
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://fonts.googleapis.com", 
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:",
        "cloudinary.com",
        `https://${process.env.FRONTEND_DOMAIN}`
      ],
      connectSrc: [
        "'self'",
        `https://${process.env.FRONTEND_DOMAIN}`,
        `${process.env.BACKEND_URL}`
      ],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    }
  },

  frameguard: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hidePoweredBy: true,

  //xFrameOptions: false,
  noSniff: true
}));

// Configuration de Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration de multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pawbook/uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req: Express.Request, file: Express.Multer.File) => 'picture-' + Date.now(),
  } as any,
});

const upload = multer({ storage });

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Permissions-Policy', 'camera=self, microphone=self, geolocation=self, payment=()');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use('/users/admin', Middlewares.adminRateLimit);
app.use('/posts/admin', Middlewares.adminRateLimit);
app.use('/passwords/admin', Middlewares.adminRateLimit);
app.use('/comments/admin', Middlewares.adminRateLimit);
app.use('/animals/admin', Middlewares.adminRateLimit);
app.use('/follows/admin', Middlewares.adminRateLimit);

app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log("Requête reçue:", {
//       method: req.method,
//       path: req.path,
//       headers: req.headers,
//       cookies: req.cookies
//   });
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(Middlewares.logger);

//app.use(Middlewares.refreshToken);
app.use(routes);

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});

app.use(Middlewares.error);

app.use('/uploads', express.static(__dirname + '/uploads'));

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;