backend/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── email.service.js
│   │   └── index.js
│   │
│   ├── repositories/
│   │   ├── base.repository.js
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   └── index.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── requestLogger.middleware.js
│   │   └── index.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── product.validator.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── response.js
│   │   ├── asyncHandler.js
│   │   ├── jwt.js
│   │   ├── bcrypt.js
│   │   ├── cache.js
│   │   └── index.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── constants/
│   │   ├── errors.js
│   │   ├── messages.js
│   │   ├── statusCodes.js
│   │   └── index.js
│   │
│   ├── errors/
│   │   ├── AppError.js
│   │   ├── ValidationError.js
│   │   ├── NotFoundError.js
│   │   ├── UnauthorizedError.js
│   │   └── index.js
│   │
│   ├── app.js
│   └── server.js
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   │   └── (auto-generated)
│   └── seed.js
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.js
│   │   │   └── user.service.test.js
│   │   └── utils/
│   │       └── jwt.test.js
│   │
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── user.test.js
│   │   └── product.test.js
│   │
│   ├── fixtures/
│   │   ├── users.js
│   │   └── products.js
│   │
│   ├── helpers/
│   │   ├── setup.js
│   │   └── teardown.js
│   │
│   └── mocha.opts
│
├── logs/
│   ├── error.log
│   ├── combined.log
│   └── .gitkeep
│
├── docs/
│   ├── API.md
│   └── README.md
│
├── scripts/
│   ├── seed.js
│   └── migrate.js
│
├── .env
├── .env.example
├── .env.test
│
├── .gitignore
├── .eslintrc.js
├── .prettierrc
│
├── Dockerfile
├── docker-compose.yml
│
├── package.json
├── package-lock.json
│
└── README.md