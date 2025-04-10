import { fetchUserName, fetchUserFiles } from "../services/UserService.js";

// Returns user's name from the Firebase Realtime DB
export const getUserName = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Unauthorized: No UID found in token." });
    }

    const nameData = await fetchUserName(uid);

    if (!nameData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(nameData);
  } catch (error) {
    console.error("Error fetching user name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Returns all files with signed download links and metadata
export const getUserFiles = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Unauthorized: No UID found in token." });
    }

    const files = await fetchUserFiles(uid);

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
