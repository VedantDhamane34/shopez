import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch { return res.status(401).json({ message: 'Token failed' }); }
  }
  if (!token) return res.status(401).json({ message: 'No token' });
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.usertype === 'admin') next();
  else res.status(403).json({ message: 'Admins only' });
};

export { authMiddleware, adminMiddleware };