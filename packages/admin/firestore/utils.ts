import {
	Firestore,
	Query,
	FieldPath,
	Precondition,
	WhereFilterOp,
	OrderByDirection,
	SetOptions,
} from "firebase-admin/firestore";

export type FiremanWhere = {
	field: string | FieldPath;
	op: WhereFilterOp;
	val: unknown;
};

export type FiremanOrderBy = {
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
 * Get data from Firestore, it could be a single document or a collection of documents. You can also filter by adding queries in the `whereArray` and `orderBy` attribute.
 * @param db {@link Firestore} instance
 * @param path collection path or document path you can append the document id after the collection path if you need to get the document.
 * @param firemanQuery  is an object of the {@link FiremanQuery} interface
 * @returns {Promise<any>}
 * @returns
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
		const docRef = db.collection(collectionId).doc(doc);
		const docSnap = await docRef.get();
		return { [fieldId]: docSnap.id, ...docSnap.data() };
	}

	// query collection
	const data: any[] = [];

	q = db.collection(collectionId);

	where.forEach((wh) => {
		q = q.where(wh.field, wh.op, wh.val);
	});

	order.forEach((orderBy) => {
		q = q.orderBy(orderBy.field, orderBy.dir);
	});

	if (limit) {
		q = q.limit(limit);
	}

	const querySnapshot = await q.get();
	querySnapshot.forEach((doc) => {
		data.push({ [fieldId]: doc.id, ...doc.data() });
	});
	return data;
};


export const countDocuments = async (
	db: Firestore,
	path: string,
	firemanQuery: FiremanQuery = {},
): Promise<any> => {
	let q: Query;
	let {where, limit } = firemanQuery;

	// set default values
	if (!where) where = <FiremanWhere[]>[];

	q = db.collection(path);

	where.forEach((wh) => {
		q = q.where(wh.field, wh.op, wh.val);
	});


	if (limit) {
		q = q.limit(limit);
	}

	const querySnapshot = await q.count().get();

	return querySnapshot.data().count;
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
		const docRef = db.doc(`${collectionId}/${docId}`);
		if (options) return await docRef.set(data, options);
		else return await docRef.set(data);
	} else {
		const colRef = db.collection(collectionId);
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
 * List all documents in a collection, even those that are not visible because they contain no data.
 * @param db {@link Firestore} instance
 * @param collectionId
 * @returns an array of all the documents in the collection with a _hidden boolean attribute
 */
export const listAllDocuments = async (
	db: Firestore,
	collectionId: string
): Promise<
	{
		_hidden: boolean;
		id: string;
    [key: string]: any;
	}[] | undefined
> => {
	const colRef = db.collection(collectionId);
	const docList = await colRef.listDocuments();
	const allDocsSnapshot = await db.getAll(...docList);
	const allDocs = allDocsSnapshot.map((doc) => ({
		id: doc.id,
		_hidden: !doc.exists,
		...doc.data(),
	}));

	return allDocs;
};

export const isCollection = (col: string) => {
	return col.split("/").length % 2 === 0 ? false : true;
};
