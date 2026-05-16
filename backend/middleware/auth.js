import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Get token from Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication required. Token missing or invalid.' });
  }
};
