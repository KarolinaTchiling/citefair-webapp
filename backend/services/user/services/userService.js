import { db, bucket } from "../../../utils/firebaseConfig.js";

// Fetch user name info
export const fetchUserName = async (uid) => {
  const snapshot = await db.ref(`/users/${uid}`).once("value");
  const userData = snapshot.val();
  if (!userData) return null;

  const { firstName, middleName, lastName } = userData;
  return { firstName, middleName, lastName };
};

// Fetch all user files + download links
export const fetchUserFiles = async (uid) => {
  const snapshot = await db.ref(`/users/${uid}`).once("value");
  const userData = snapshot.val();
  if (!userData) throw new Error("User not found");

  const fileNames = userData.data ? Object.keys(userData.data) : [];
  const filesWithLinks = [];

  for (const fileName of fileNames) {
    const fileData = userData.data[fileName];
    const rawDate = fileData.metadata.uploadedAt;
    const uploadDate = new Date(rawDate).toLocaleString();
    const name = fileData.metadata.originalFileName;

    const filePath = `users/${uid}/uploads/${fileName}`;
    const file = bucket.file(filePath);
    const [exists] = await file.exists();

    let downloadUrl = null;
    if (exists) {
      [downloadUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
    }

    filesWithLinks.push({
      fileName,
      ogName: name,
      downloadUrl,
      uploadDate,
    });
  }

  return filesWithLinks;
};
