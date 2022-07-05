"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.addDocument = exports.doesDocumentExists = exports.get = void 0;
const firestore_1 = require("firebase/firestore");
/**
 * Get data from Firestore, it could be a single document or a collection of documents. You can also filter the data by adding the `whereArray` and `orderBy` attribute.
 * @param db {@link Firestore} instance
 * @param firemanQuery  is an object of the {@link FiremanQuery} interface
 * @returns {Promise<any>}
 * @returns
 */
const get = (db, firemanQuery) => __awaiter(void 0, void 0, void 0, function* () {
    let q;
    let { collectionId, docId, whereArray, orderByArray, limitDocs } = firemanQuery;
    // set default values
    if (!whereArray)
        whereArray = [];
    if (!orderByArray)
        orderByArray = [];
    // get single doc
    if (docId) {
        const docRef = (0, firestore_1.doc)(db, collectionId, docId);
        const docSnap = yield (0, firestore_1.getDoc)(docRef);
        return Object.assign({ id: docSnap.id }, docSnap.data());
    }
    // query collection
    const data = [];
    const whereConstraints = whereArray.map((whereConstraint) => (0, firestore_1.where)(whereConstraint.field, whereConstraint.op, whereConstraint.val));
    const orderByConstraints = orderByArray.map((orderByConstraint) => (0, firestore_1.orderBy)(orderByConstraint.field, orderByConstraint.dir));
    if (!limitDocs || limitDocs === 0) {
        q = (0, firestore_1.query)((0, firestore_1.collection)(db, collectionId), ...whereConstraints, ...orderByConstraints);
    }
    else {
        q = (0, firestore_1.query)((0, firestore_1.collection)(db, collectionId), ...whereConstraints, ...orderByConstraints, (0, firestore_1.limit)(limitDocs));
    }
    const querySnapshot = yield (0, firestore_1.getDocs)(q);
    querySnapshot.forEach((doc) => {
        data.push(Object.assign({ id: doc.id }, doc.data()));
    });
    return data;
});
exports.get = get;
/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId document collection id
 * @param docId document id
 * @returns {Promise<boolean>}
 */
const doesDocumentExists = (db, collectionId, docId) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = (0, firestore_1.doc)(db, collectionId, docId);
    const docSnap = yield (0, firestore_1.getDoc)(docRef);
    return docSnap.exists();
});
exports.doesDocumentExists = doesDocumentExists;
/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId
 * @param data your data
 * @param docId your document id (if you need to set it manually)
 * @param options
 */
const addDocument = (db, collectionId, data, docId = null, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (docId) {
        const docRef = (0, firestore_1.doc)(db, collectionId, docId);
        if (options)
            yield (0, firestore_1.setDoc)(docRef, data, options);
        else
            yield (0, firestore_1.setDoc)(docRef, data);
    }
    else {
        const docRef = (0, firestore_1.doc)(db, collectionId);
        yield (0, firestore_1.setDoc)(docRef, data);
    }
});
exports.addDocument = addDocument;
/**
 *
 * @param db Firestore database instance
 * @param collectionId collection id
 * @param docId document id
 * @param data your data to update
 */
const updateDocument = (db, collectionId, docId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = (0, firestore_1.doc)(db, collectionId, docId);
    yield (0, firestore_1.updateDoc)(docRef, data);
});
exports.updateDocument = updateDocument;
/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId
 * @param docId
 */
const deleteDocument = (db, collectionId, docId) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = (0, firestore_1.doc)(db, collectionId, docId);
    yield (0, firestore_1.deleteDoc)(docRef);
});
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=fireman.js.map