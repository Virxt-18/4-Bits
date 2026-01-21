import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// DO NOT CHANGE

export const sendSOSAlert = async (alertData) => {
  const sosRef = collection(db, "location");

  try {
    const docRef = await addDoc(sosRef, alertData);

    return { success: true, docRef };

  } catch (error) {
    console.error('Error sending SOS alert:', error);

    if (error instanceof TypeError) {
      console.error('Network or CORS error:', error.message);
    } else {
      console.error('HTTP error:', error.message);
    }

    return { success: false, error: error.message };
  }
};
