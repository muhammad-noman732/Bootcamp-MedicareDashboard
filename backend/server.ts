import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from 'compression';
import rateLimit from "express-rate-limit";
import { buffer } from "node:stream/consumers";
import hpp from 'hpp';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./utils/notFound";
import { errorHandler } from "./middlewares/errorMiddleware";
import authRouter from "./routes/authRoutes";
import patientRouter from "./routes/patientRoutes";

const app = express();
app.use(express.json({
  limit: "10kb"
}));

// global middlewares
// for parsing the json into object in request body
// based on endpoint the data they have
app.use('/api/uploads', express.json({ limit: '50mb' }));
app.use('/api/', express.json({
  limit: '10kb',
}));


// for parsing the url encoded data in the request body
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// cookie parser
app.use(cookieParser());

// cors policy
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credientals: true, // allow cookies
}
app.use(cors(corsOptions))

// helmet(protect agains vulnerabilities)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  }
}));

// compression => gzip the data
app.use(compression())

// 5. RATE LIMITING
// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 requests per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful requests
  message: 'Too many login attempts, please try again later.'
});


// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['sort', 'filter', 'page'] // Allow these params to appear multiple times
}));


// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Continue to next middleware
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/patients', apiLimiter, patientRouter);


// ROUTES
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// not found handler
app.use(notFoundHandler);

app.use(errorHandler)


// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

