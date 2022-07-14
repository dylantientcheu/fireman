# Getting started

<div style="display: flex; justify-content: center">
  <img style="width: 300px" src="/logo.svg" alt="Fireman logo" >
</div>

Fireman is a simple, yet powerful, wrapper around the firestore SDK providing firestore helper functions. (soon the firestore admin sdk too).
It provides a simple interface to get, update and delete data from your firestore instance.

## Installation

### If you are using Firebase on the browser

```bash
npm install @fireman/web
```

### If you are using Firebase on the server (nodejs)

```bash
npm install @fireman/admin
```

## Initializing Firestore

  Fireman needs to access your firestore instance. You can do this by passing the firestore instance as a parameter to the fireman function.

  ```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    // ...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service, you should export it in case you need to access it elsewhere.
export const db = getFirestore(app);
  ```

  You may [follow instructions on the Firebase docs](https://firebase.google.com/docs/firestore/quickstart#initialize) to initialize Firestore
