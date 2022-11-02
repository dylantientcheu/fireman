import {
	Firestore,
	SetOptions,
} from "firebase/firestore";
import {
	addDocument,
	deleteDocument,
	countDocuments,
	updateDocument,
	FiremanQuery,
	get,
} from "./utils";

export default class FiremanFirestore {
	db: Firestore | unknown;
	fieldId: string;

	/**
	 * create a Fireman instance of the class
	 * @param {Firestore} db - The Firestore instance from firebase.firestore.
	 * @param {string} [fieldId="id"] - The field that will be used as id when returning the object.
	 */
	constructor(db: Firestore | unknown, fieldId = "id") {
		this.db = db;
		this.fieldId = fieldId;
	}

	/**
	 * Get data from Firestore, it could be a single document or a collection of documents. You can also filter by adding queries in firemanQuery object.
	 * @param path - collection path or document path you can append the document id after the collection path if you need to get the document.
	 * @param query -  is an object of the {@link FiremanQuery} interface to help you filter and order the data.
	 * @returns {Promise<any>}
	 */
	async get(path: string, query: FiremanQuery = {}) {
		return get(this.db as Firestore, path, query, this.fieldId);
	}

	/**
	 * Count the number of documents in a collection.
	 * @param path - collection path or document path you can append the document id after the collection path if you need to get the document.
	 * @param query - is an object of the {@link FiremanQuery} interface to help you filter the data you need to count.
	 * @returns {Promise<number>}
	 */
	async count(path: string, query: FiremanQuery = {}) {
		return countDocuments(this.db as Firestore, path, query);
	}

	/**
	 * Add a document in Firestore.
	 * @param {string} colId collection id
	 * @param {string} [docId] document id, if not provided it will be generated automatically.
	 * @param {unknown} data your data to set
	 * @param {SetOptions} [options] - options to enforce on this set.
	 */

	async add(
		collectionId: string,
		data: any,
		docId: string | undefined = undefined,
		options?: SetOptions
	) {
		return addDocument(
			this.db as Firestore,
			collectionId,
			data,
			docId,
			options
		);
	}

	/**
	 * Update a document in Firestore.
	 * @param {string} colId collection id
	 * @param {string} docId document id
	 * @param {unknown} data your data to update
	 * @param {Precondition} [precondition] - A precondition to enforce on this update.
	 */

	async update(colId: string, docId: string, data: any) {
		return updateDocument(this.db as Firestore, colId, docId, data);
	}

	async delete(colId: string, docId: string) {
		return deleteDocument(this.db as Firestore, colId, docId);
	}
}
