import { db, admin } from "../../../utils/firebaseConfig.js";

export const registerGuest = async ({ uid, firstName, middleName, lastName }) => {
  if (!uid) throw new Error("UID is required");

  const guestData = {
    uid,
    firstName,
    middleName,
    lastName,
    isGuest: true,
    createdAt: Date.now(),
  };

  await db.ref(`/users/${uid}`).set(guestData);
  return { message: "Guest registered successfully" };
};

export const checkGuestStatus = async (uid) => {
  if (!uid) throw new Error("UID is required");

  const snapshot = await db.ref(`/users/${uid}`).once("value");
  const data = snapshot.val();
  if (!data) throw new Error("User not found");

  return { isGuest: data.isGuest ?? false };
};

export const saveGuest = async ({ uid, email, password }) => {
  if (!uid || !email || !password) throw new Error("UID, email, and password are required");

  const snapshot = await db.ref(`/users/${uid}`).once("value");
  const userData = snapshot.val();
  if (!userData?.isGuest) throw new Error("User is not a guest or does not exist");

  await admin.auth().updateUser(uid, { email, password });

  await db.ref(`/users/${uid}`).update({
    email,
    isGuest: false,
  });

  return { message: "Guest account upgraded successfully" };
};

export const deleteGuest = async (uid) => {
  if (!uid) throw new Error("UID is required");

  await admin.auth().deleteUser(uid);
  return { message: "Guest session deleted successfully" };
};
