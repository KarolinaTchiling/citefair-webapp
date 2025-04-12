import express from 'express';
import admin from 'firebase-admin';
import processBibRoutes from '../services/processBib/index.js'; 
import userRoutes from '../services/user/index.js';
import fileRoutes from "../services/files/index.js";
import relatedWorksRoutes from "../services/relatedWorks/index.js";
import cdsRoutes from "../services/cds/index.js";
import guestRoutes from "../services/guests/index.js";
import referenceRoutes from "../services/references/index.js";

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

router.use('/process', verifyFirebaseToken, processBibRoutes);
router.use('/user', verifyFirebaseToken, userRoutes);
router.use('/file', verifyFirebaseToken, fileRoutes);
router.use('/related', verifyFirebaseToken, relatedWorksRoutes);
router.use('/cds', verifyFirebaseToken, cdsRoutes);
router.use('/guest', verifyFirebaseToken, guestRoutes);
router.use('/ref', verifyFirebaseToken, referenceRoutes);

export default router;
