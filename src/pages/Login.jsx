import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

await signInWithEmailAndPassword(auth, email, password);
