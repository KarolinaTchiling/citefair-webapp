import express from "express";
import { admin } from "../firebaseAdmin.js"; 
import { generate } from "../cds_generator/generate.js"; 

const router = express.Router();

const authenticateToken = async (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Authorization token is missing or invalid");
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; 
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};



router.post("/get-cds", async (req, res) => {
  try {
    // Authenticate the user using the token
    await authenticateToken(req);

    // Extract filepath from the request body
    const { filepath } = req.body;
    if (!filepath) {
      throw new Error("Filepath is required");
    }

    const response = await generate(filepath);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in /api/get-cds:", error);
    res.status(401).json({ error: error.message || "Unauthorized" });
  }
});

export default router;

