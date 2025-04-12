import { getVersionedFileName } from "../utils/versionFileNames.js";
import { db } from "../../../utils/firebaseConfig.js";
import fs from "fs";
import path from "path";
import os from "os";

export const getReferences = async (fileName, userId) => {
  const snapshot = await db.ref(`users/${userId}/data/${fileName}/references`).once("value");
  const data = snapshot.val();
  if (!data) throw new Error("No references found");
  return data;
};

export const addReference = async (userId, fileName, paperId) => {
  const relatedPath = `users/${userId}/data/${fileName}/related`;
  const relatedSnapshot = await db.ref(relatedPath).once("value");
  if (!relatedSnapshot.exists()) throw new Error("Related papers not found");

  const relatedPapers = Object.values(relatedSnapshot.val());
  const matchedPaper = relatedPapers.find(p => p.paperId === paperId);
  if (!matchedPaper) throw new Error("Paper with given paperId not found");

  const refsPath = `users/${userId}/data/${fileName}/references`;
  const refsSnapshot = await db.ref(refsPath).once("value");
  let currentRefs = refsSnapshot.exists() ? Object.values(refsSnapshot.val()) : [];

  if (currentRefs.some(ref => ref.paperId === paperId)) throw new Error("Paper already exists in reference list");

  currentRefs.unshift(matchedPaper);
  await db.ref(refsPath).set(currentRefs);
  return { message: "Paper added to reference list.", paper: matchedPaper };
};

export const deleteReference = async (userId, fileName, title) => {
  const refsPath = `users/${userId}/data/${fileName}/references`;
  const refsSnapshot = await db.ref(refsPath).once("value");
  if (!refsSnapshot.exists()) throw new Error("No reference list found");

  let currentRefs = Object.values(refsSnapshot.val());
  const updatedRefs = currentRefs.filter(ref => ref.title !== title);
  if (updatedRefs.length === currentRefs.length) throw new Error("No matching paper found to delete");

  await db.ref(refsPath).set(updatedRefs);
  return { message: `Paper with title "${title}" removed from reference list.` };
};

export const downloadReferences = async (userId, fileName, res) => {
  const refsPath = `users/${userId}/data/${fileName}/references`;
  const refsSnapshot = await db.ref(refsPath).once("value");
  if (!refsSnapshot.exists()) throw new Error("No reference list found");

  let currentRefs = Object.values(refsSnapshot.val());
  const bibtexEntries = currentRefs.map(ref => ref.bibtex).filter(Boolean).join("\n\n");
  const versionedFileName = getVersionedFileName(fileName);

  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, versionedFileName);
  fs.writeFileSync(tempFilePath, bibtexEntries);

  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  res.setHeader("Content-Disposition", `attachment; filename=\"${versionedFileName}\"`);
  res.setHeader("Content-Type", "application/x-bibtex");
  const fileStream = fs.createReadStream(tempFilePath);
  fileStream.pipe(res);

  fileStream.on("end", () => {
    fs.unlink(tempFilePath, err => {
      if (err) console.error("Failed to delete temp file:", err);
      else console.log("Temp file deleted");
    });
  });
};
