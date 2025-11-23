import jwt from "jsonwebtoken";

// Coordinator authentication middleware
const authCoordinator = async (req, res, next) => {
  try {
    const { ctoken } = req.headers;

    if (!ctoken) {
      return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
    }

    const tokenDecode = jwt.verify(ctoken, process.env.JWT_SECRET);
    req.body.trailId = tokenDecode.id;

    next();
    
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authCoordinator;