import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res) => {
    try {
        const token = await req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated", success: false });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.userId;
        return next();

    } catch (error) {
        console.log('There is something wrong at user authentication time:', error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export default isAuthenticated;