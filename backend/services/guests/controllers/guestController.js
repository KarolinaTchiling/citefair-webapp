import {
    registerGuest,
    checkGuestStatus,
    saveGuest,
    deleteGuest
  } from "../services/guestService.js";
  
  export const registerGuestController = async (req, res) => {
    try {
        const uid = req.user.uid; 
        const { firstName, middleName, lastName } = req.body;
        const response = await registerGuest({ uid, firstName, middleName, lastName });
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export const isGuestController = async (req, res) => {
    try {
        const uid = req.user.uid; 
        const response = await checkGuestStatus(uid);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export const saveGuestController = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { email, password } = req.body;
        const response = await saveGuest({ uid, email, password });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export const deleteGuestController = async (req, res) => {
    try {
        const uid = req.user.uid; // from API Gateway
        const response = await deleteGuest(uid);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  