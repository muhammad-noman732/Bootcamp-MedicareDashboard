import jwt from "jsonwebtoken"



   function generateAccessToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN })
    }

    function generateRefreshToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
    }
