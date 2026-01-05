import type { Request, Response, NextFunction } from "express";
/*
WHAT IS asyncHandler?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Think of it as a PROTECTIVE WRAPPER around your controller functions.

WITHOUT asyncHandler:
─────────────────────
You write:
  const getUser = async (req, res, next) => {
    try {
      const user = await db.findUser();
      res.json(user);
    } catch (error) {
      next(error); // Must remember this!
    }
  };

WITH asyncHandler:
─────────────────────
You write:
  const getUser = asyncHandler(async (req, res) => {
    const user = await db.findUser();
    res.json(user);
  });

asyncHandler automatically adds the try-catch for you!
*/


type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>



export const asyncHandler = (fn: AsyncFunction) => {
  // Return a NEW function that Express will call
  return (req: Request, res: Response, next: NextFunction) => {
    // Execute your function
    // Wrap it in Promise.resolve (in case it's not async)
    // If error happens, .catch() sends it to next()
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


//
// HOW IT WORKS INTERNALLY:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. You pass your async function to asyncHandler
//    asyncHandler(myFunction)

// 2. asyncHandler returns a WRAPPER function
//    (req, res, next) => { ... }

// 3. Express calls this WRAPPER function when route is hit

// 4. WRAPPER executes YOUR function
//    Promise.resolve(myFunction(req, res, next))

// 5. If YOUR function throws error or promise rejects:
//    .catch(next) catches it

// 6. .catch(next) is same as .catch(error => next(error))
//    This sends error to Express error handling

// 7. Express jumps to error handler middleware
// 