import { bucket, db } from "../config/firebaseConfig.js";


const uploadFileToFirebase = async (file, userId) => {
    const fileName = `${file.originalname.replace(/[.#$/[\]]/g, "_")}`;
    const fileRef = bucket.file(`users/${userId}/uploads/${fileName}`);

    // Upload file to Firebase Storage
    await fileRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
    });

    // Get public download URL
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileRef.name)}?alt=media`;

    // Save metadata to Firebase Realtime Database
    await db.ref(`users/files/${fileName}`).set({
        url: downloadURL,
        originalFileName: file.originalname,
        uploadedAt: new Date().toISOString(),
    });

    return { fileName, downloadURL };
};

export { uploadFileToFirebase };
