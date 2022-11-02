import {
	Firestore,
	Query,
	getDoc,
	query,
	collection,
	getDocs,
	doc as fbDoc,
	where as fbWhere,
	FieldPath,
	WhereFilterOp,
	OrderByDirection,
	orderBy,
	limit as fbLimit,
	updateDoc,
	setDoc,
	SetOptions,
	deleteDoc,
	addDoc,
	getCountFromServer,
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

export interface FiremanQuery {
	doc?: string;
	where?: FiremanWhere[];
	order?: FiremanOrderBy[];
	limit?: number;
}

/**
 * Get data from Firestore, it could be a single document or a collection of documents. You can also filter by adding queries in the `where` and `orderBy` attribute.
 * @param db {@link Firestore} instance
 * @param firemanQuery  is an object of the {@link FiremanQuery} interface
 * @returns {Promise<any>}
 */
export const get = async <T>(
	db: Firestore,
	path: string,
	firemanQuery: FiremanQuery = {},
	fieldId: string = "id"
): Promise<any> => {
	let q: Query;
	let { doc, where, order, limit } = firemanQuery;

  let collectionId = "";

	if (isCollection(path)) {
		collectionId = path;
	} else {
		const collArray = path.split("/");
		doc = collArray.pop();
		collectionId = collArray.join("/");
	}

	// set default values
	if (!where) where = <FiremanWhere[]>[];
	if (!order) order = <FiremanOrderBy[]>[];

	// get single doc
	if (doc) {
		const docRef = fbDoc(db, collectionId!, doc!);
		const docSnap = await getDoc(docRef);
		return { [fieldId]: docSnap.id, ...docSnap.data() };
	}

	// query collection
	const data: any[] = [];
	const whereConstraints = where.map((whereConstraint: FiremanWhere) =>
		fbWhere(whereConstraint.field, whereConstraint.op, whereConstraint.val)
	);
	const orderByConstraints = order.map(
		(orderByConstraint: FiremanOrderBy) =>
			orderBy(orderByConstraint.field, orderByConstraint.dir)
	);
	if (!limit || limit === 0) {
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
			fbLimit(limit)
		);
	}
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		data.push({ [fieldId]: doc.id, ...doc.data(), });
	});
	return data;
};

/**
 * Count the number of documents in a collection.
 * You can also filter by adding queries in the `where` attribute
 * @param db {@link Firestore} instance
 * @param path to collection
 * @param firemanQuery  is an object of the {@link FiremanQuery} interface
 * @returns {Promise<any>}
 */

export const countDocuments = async (
	db: Firestore,
	path: string,
	firemanQuery: FiremanQuery = {}
) => {
	let { where, limit } = firemanQuery;
	if (!where) where = <FiremanWhere[]>[];
	let q: Query;



	const whereConstraints = where.map((whereConstraint: FiremanWhere) =>
		fbWhere(whereConstraint.field, whereConstraint.op, whereConstraint.val)
	);


	if (!limit || limit === 0) {
		q = query(collection(db, path),...whereConstraints);
	} else {
		q = query(collection(db, path),...whereConstraints, fbLimit(limit));
	}

	const snapshot = await getCountFromServer(q);
	return snapshot.data().count;
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
	const docRef = fbDoc(db, collectionId!, docId!);
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
		const docRef = fbDoc(db, collectionId!, docId!);
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
	const docRef = fbDoc(db, collectionId!, docId);
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
	const docRef = fbDoc(db, collectionId, docId);
	return await deleteDoc(docRef);
};


export const isCollection = (col: string) => {
	return col.split("/").length % 2 === 0 ? false : true;
};