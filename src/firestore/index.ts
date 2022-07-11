import {
	Firestore,
	Query,
	getDoc,
	query,
	collection,
	getDocs,
	doc,
	where,
	FieldPath,
	WhereFilterOp,
	OrderByDirection,
	orderBy,
	limit,
	updateDoc,
	setDoc,
	SetOptions,
	deleteDoc,
	addDoc,
} from "firebase/firestore";

type FiremanWhere = {
	field: string | FieldPath;
	op: WhereFilterOp;
	val: unknown;
};

type FiremanOrderBy = {
	field: string | FieldPath;
	dir: OrderByDirection;
};

interface FiremanQuery {
	collectionId: string;
	docId?: string;
	whereArray?: FiremanWhere[];
	orderByArray?: FiremanOrderBy[];
	limitDocs?: number;
}
/**
 * Get data from Firestore, it could be a single document or a collection of documents. You can also filter by adding queries in the `whereArray` and `orderBy` attribute.
 * @param db {@link Firestore} instance
 * @param firemanQuery  is an object of the {@link FiremanQuery} interface
 * @returns {Promise<any>}
 * @returns
 */
export const get = async (db: Firestore, firemanQuery: FiremanQuery) => {
	let q: Query;
	let { collectionId, docId, whereArray, orderByArray, limitDocs } =
		firemanQuery;

	// set default values
	if (!whereArray) whereArray = <FiremanWhere[]>[];
	if (!orderByArray) orderByArray = <FiremanOrderBy[]>[];

	// get single doc
	if (docId) {
		const docRef = doc(db, collectionId!, docId!);
		const docSnap = await getDoc(docRef);
		return { id: docSnap.id, ...docSnap.data() };
	}

	// query collection
	const data: any[] = [];
	const whereConstraints = whereArray.map((whereConstraint: FiremanWhere) =>
		where(whereConstraint.field, whereConstraint.op, whereConstraint.val)
	);
	const orderByConstraints = orderByArray.map(
		(orderByConstraint: FiremanOrderBy) =>
			orderBy(orderByConstraint.field, orderByConstraint.dir)
	);
	if (!limitDocs || limitDocs === 0) {
		q = query(
			collection(db, collectionId),
			...whereConstraints,
			...orderByConstraints
		);
	} else {
		q = query(
			collection(db, collectionId),
			...whereConstraints,
			...orderByConstraints,
			limit(limitDocs)
		);
	}
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		data.push({ id: doc.id, ...doc.data() });
	});
	return data;
};

/**
 * Check if a document exists in Firestore.
 * @param db {@link Firestore} instance
 * @param collectionId document collection id
 * @param docId document id
 * @returns {Promise<boolean>}
 */
export const doesDocumentExists = async (
	db: Firestore,
	collectionId: string,
	docId: string
) => {
	const docRef = doc(db, collectionId!, docId!);
	const docSnap = await getDoc(docRef);
	return docSnap.exists();
};

/**
 * Add a document in Firestore, document id will be generated automatically if not specified.
 * @param db {@link Firestore} instance
 * @param collectionId
 * @param data your data
 * @param docId your document id (if you need to set it manually)
 * @param options
 */

export const addDocument = async (
	db: Firestore,
	collectionId: string,
	data: any,
	docId: string | undefined = undefined,
	options?: SetOptions
) => {
	if (docId) {
		const docRef = doc(db, collectionId!, docId!);
		if (options) return await setDoc(docRef, data, options);
		else return await setDoc(docRef, data);
	} else {
		const colRef = collection(db, collectionId!);
		return await addDoc(colRef, data);
	}
};

/**
 * Update a document in Firestore.
 * @param db Firestore database instance
 * @param collectionId collection id
 * @param docId document id
 * @param data your data to update
 */
export const updateDocument = async (
	db: Firestore,
	collectionId: string,
	docId: string,
	data: any
) => {
	const docRef = doc(db, collectionId!, docId);
	return await updateDoc(docRef, data);
};

/**
 * Delete a document from Firestore.
 * @param db {@link Firestore} instance
 * @param collectionId
 * @param docId
 */
export const deleteDocument = async (
	db: Firestore,
	collectionId: string,
	docId: string
) => {
	const docRef = doc(db, collectionId, docId);
	await deleteDoc(docRef);
};
