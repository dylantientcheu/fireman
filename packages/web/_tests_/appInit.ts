import { initializeApp } from "firebase/app";
import 'firebase/firestore'
import { getFirestore } from "firebase/firestore";

import { firebaseConfigJson } from "../../_tests_/config";

initializeApp(firebaseConfigJson);

export const db = getFirestore();
