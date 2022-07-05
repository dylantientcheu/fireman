import { Firestore, FieldPath, WhereFilterOp, OrderByDirection, SetOptions } from "firebase/firestore";
interface FiremanWhere {
    field: string | FieldPath;
    op: WhereFilterOp;
    val: unknown;
}
interface FiremanOrderBy {
    field: string | FieldPath;
    dir: OrderByDirection;
}
interface FiremanQuery {
    collectionId: string;
    docId?: string;
    whereArray?: FiremanWhere[];
    orderByArray?: FiremanOrderBy[];
    limitDocs?: number;
}
/**
 * Get data from Firestore, it could be a single document or a collection of documents. You can also filter the data by adding the `whereArray` and `orderBy` attribute.
 * @param db {@link Firestore} instance
 * @param firemanQuery  is an object of the {@link FiremanQuery} interface
 * @returns {Promise<any>}
 * @returns
 */
export declare const get: (db: Firestore, firemanQuery: FiremanQuery) => Promise<any[] | {
    id: string;
}>;
/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId document collection id
 * @param docId document id
 * @returns {Promise<boolean>}
 */
export declare const doesDocumentExists: (db: Firestore, collectionId: string, docId: string) => Promise<boolean>;
/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId
 * @param data your data
 * @param docId your document id (if you need to set it manually)
 * @param options
 */
export declare const addDocument: (db: Firestore, collectionId: string, data: any, docId?: string | null, options?: SetOptions) => Promise<void>;
/**
 *
 * @param db Firestore database instance
 * @param collectionId collection id
 * @param docId document id
 * @param data your data to update
 */
export declare const updateDocument: (db: Firestore, collectionId: string, docId: string, data: any) => Promise<void>;
/**
 *
 * @param db {@link Firestore} instance
 * @param collectionId
 * @param docId
 */
export declare const deleteDocument: (db: Firestore, collectionId: string, docId: string) => Promise<void>;
export {};
