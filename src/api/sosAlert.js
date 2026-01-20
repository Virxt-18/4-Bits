import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";



export const sendSOSAlert = async (alertData) => {
  const sosRef = collection(db, "location");

  try {
    const docRef = await addDoc(sosRef, alertData);

    return { success: true, docRef };

  } catch (error) {
    // Network errors (CORS, server down, wrong URL) show up here
    console.error('Error sending SOS alert:', error);

    // Optional: distinguish network vs HTTP errors
    if (error instanceof TypeError) {
      console.error('Network or CORS error:', error.message);
    } else {
      console.error('HTTP error:', error.message);
    }

    return { success: false, error: error.message };
  }
};
