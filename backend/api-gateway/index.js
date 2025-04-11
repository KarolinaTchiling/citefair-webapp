import express from 'express';
import admin from 'firebase-admin';
import processBibRoutes from '../services/processBib/index.js'; 
import userRoutes from '../services/user/index.js';
import fileRoutes from "../services/files/index.js";

const router = express.Router();

// Auth middleware
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
}


// Apply the auth middleware to protected routes
// router.use('/references', verifyFirebaseToken, require('../routes/ReferencesRoutes'));
// router.use('/related', verifyFirebaseToken, require('../routes/RelatedWorksRoutes'));
// router.use('/statement', verifyFirebaseToken, require('../routes/StatementRoutes'));

// Use your new service:
router.use('/process', verifyFirebaseToken, processBibRoutes);
router.use('/user', verifyFirebaseToken, userRoutes);
router.use('/file', verifyFirebaseToken, fileRoutes);

// // Public routes
// router.use('/guest', require('../routes/GuestRoutes'));
// router.use('/upload', require('../routes/uploadRoutes'));
// router.use('/users', require('../routes/UserRoutes')); // You might want to protect this too

export default router;
