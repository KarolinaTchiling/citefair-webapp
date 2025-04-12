import { db } from "../../../utils/firebaseConfig.js";

// Fetch user name info
export const fetchUserName = async (uid) => {
  const snapshot = await db.ref(`/users/${uid}`).once("value");
  const userData = snapshot.val();
  if (!userData) return null;

  const { firstName, middleName, lastName } = userData;
  return { firstName, middleName, lastName };
};
