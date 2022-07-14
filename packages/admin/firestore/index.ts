import {
	Firestore,
	Query,
	FieldPath,
  Precondition,
	WhereFilterOp,
	OrderByDirection,
	SetOptions,
} from "firebase-admin/firestore";

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
		const docRef = db.collection(collectionId).doc(docId);
		const docSnap = await docRef.get();
		return { id: docSnap.id, ...docSnap.data() };
	}

	// query collection
	const data: any[] = [];

	q = db.collection(collectionId);

	whereArray.forEach((where) => {
		q = q.where(where.field, where.op, where.val);
	})

	orderByArray.forEach((orderBy) => {
		q = q.orderBy(orderBy.field, orderBy.dir);
	});

	if (!limitDocs || limitDocs === 0) {
		q = q.limit(limitDocs);
	}

	const querySnapshot = await q.get();
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
	const docRef = db.collection(collectionId).doc(docId);
	const docSnap = await docRef.get();
	return docSnap.exists;
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
		const docRef = db.doc(`${collectionId!}/${docId!}`);
		if (options) return await docRef.set(data, options);
		else return await docRef.set(data);
	} else {
		const colRef = db.collection("collection");
		return await colRef.add(data);
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
	data: any,
  precondition?: string | FieldPath | Precondition
) => {
	const docRef = db.doc(`${collectionId!}/${docId!}`);
  if (precondition) return await docRef.update(data, precondition);
  else return await docRef.update(data);
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
	docId: string,
	precondition?: Precondition
) => {
	const docRef = db.doc(`${collectionId!}/${docId!}`);
	if (precondition) return await docRef.delete(precondition);
	else return await docRef.delete();
};


/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId
 * @returns an array of all the documents in the collection with a _hidden boolean attribute
 */
export const listAllDocuments = async (
	db: Firestore,
	collectionId: string,
) => {
	const colRef = db.collection(collectionId);
	const docList = await colRef.listDocuments();
	const allDocsSnapshot = await db.getAll(...docList)
	const allDocs = allDocsSnapshot.map(doc => ({ id: doc.id, ...doc.data(), _hidden: !doc.exists }));

	return allDocs;
}
