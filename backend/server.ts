import "dotenv/config";
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
import appointmentRouter from "./routes/appointmentRoutes";
import taskRouter from "./routes/taskRoutes";
import dashboardRouter from "./routes/dashboardRoutes";
import analyticsRouter from "./routes/analyticsRoutes";
import notificationRouter from "./routes/notificationRoutes";

const app = express();
app.use(express.json({
  limit: "10kb"
}));


app.use('/api/uploads', express.json({ limit: '50mb' }));
app.use('/api/', express.json({
  limit: '10kb',
}));


app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}
app.use(cors(corsOptions))

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
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(compression())

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});



app.use(hpp({
  whitelist: ['sort', 'filter', 'page']
}));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/patients', apiLimiter, patientRouter);
app.use('/api/appointments', apiLimiter, appointmentRouter);
app.use('/api/tasks', apiLimiter, taskRouter);
app.use('/api/dashboard', apiLimiter, dashboardRouter);
app.use('/api/analytics', apiLimiter, analyticsRouter);
app.use('/api/notifications', apiLimiter, notificationRouter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundHandler);
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});

