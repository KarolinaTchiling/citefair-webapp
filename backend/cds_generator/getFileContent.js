// Step 1 in the CDS generator
// Downloads an bib file from the cloud based a user 

import { storage } from "../firebaseAdmin.js";

export async function getFileContent(userId) {
  const filePath = `users/${userId}/uploads/ref.bib`;
  // const filePath = `users/${userId}/uploads/1733196704225ref.bib`;
  const file = storage.bucket().file(filePath);

  const [exists] = await file.exists();
  if (!exists) throw new Error("File not found");

  const [fileContent] = await file.download();
  return fileContent.toString("utf-8");

}
