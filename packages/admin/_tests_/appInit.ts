import * as admin from "firebase-admin";
import { serviceAccountJson } from "../../_tests_/config";

const app = admin.initializeApp({credential: admin.credential.cert(serviceAccountJson)});

export const db = app.firestore();
