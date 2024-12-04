// Step 1 in the CDS generator
// Downloads an bib file from the cloud based a user 

import { storage } from "../firebaseAdmin.js";

export async function getFileContent(filepath) {

  // const filePath = `users/${userId}/uploads/ref.bib`;
  console.log(filepath)
  const file = storage.bucket().file(filepath);

  const [exists] = await file.exists();
  if (!exists) throw new Error("File not found");

  const [fileContent] = await file.download();
  return fileContent.toString("utf-8");

}
