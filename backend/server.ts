import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression"
import rateLimit from "express-rate-limit";
import { buffer } from "node:stream/consumers";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from 'hpp'
const app = express();


// global middlewares
// for parsing the json into object in request body
// based on endpoin the data they have
app.use('/api/uploads', express.json({ limit: '50mb' }));
app.use('/api/', express.json({
         limit: '10kb',
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
         }
        }));

// for parsing the url encoded data in the request body
app.use(express.urlencoded({extended:true , limit:"10kb"}))
// cors policy
const corsOptions ={
    origin:process.env.CORS_ORIGIN,
    methods:["GET","POST","PUT","DELETE"],
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


// Prevent NoSQL injection attacks
app.use(ExpressMongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['sort', 'filter', 'page'] // Allow these params to appear multiple times
}));


app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);


// ROUTES
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});