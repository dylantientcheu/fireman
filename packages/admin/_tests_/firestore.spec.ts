import { db } from "./appInit";
import { addDocument, deleteDocument, doesDocumentExists, get, listAllDocuments, updateDocument } from "../../../dist/admin/firestore"
import { expect } from "chai"

describe('Firestore admin functions test', () => {
  it('should be able to query from a collection', async () => {
    try {
      const result = await get(db, {collectionId: 'users'});
      expect(result).to.be.ok;
    } catch (error) {
      console.log(error);
    }
  })
  it("should be able to query from a collection with where filters", async () => {
		try {
			const result = await get(db, { collectionId: "users", whereArray: [{field: "subscribed", op: "!=", val: false}] });
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
  it("should be able to query from a collection with orderby filters", async () => {
		try {
			const result = await get(db, {
				collectionId: "users",
				orderByArray: [{ field: "subscribedOn", dir: "desc" }],
			});
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
  it("should be able to query from a collection with limits", async () => {
		try {
			const result = await get(db, {
				collectionId: "users",
				limitDocs: 1
			});
			expect(result).to.have.length(1);
		} catch (error) {
			console.log(error);
		}
	});
  it("should check if a document exists", async () => {
		try {
			const result = await doesDocumentExists(db, "users","doesntExistInFirestore");
			expect(result).to.be.not.true;
		} catch (error) {
			console.log(error);
		}
	});
  it("should add a document with auto id on Firestore", async () => {
		try {
			const result = await addDocument(
				db,
				"users",
				{name: "John Doe", subscribed: true, subscribedOn: new Date()}
			);
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
  it("should add a document with specified id on Firestore", async () => {
		try {
			const result = await addDocument(db, "users", {
				name: "John Doe",
				subscribed: true,
				subscribedOn: new Date(),
			}, 'johnDoe');
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
  it("should update a document on Firestore", async () => {
		try {
			const result = await updateDocument(
				db,
				"users",
				"johnDoe",
        {
					name: "John Doe",
					subscribed: false,
					subscribedOn: new Date(),
				},
			);
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
  it("should delete a document from Firestore", async () => {
		try {
			const result = await deleteDocument(
				db,
				"users",
				"johnDoe"
			);
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
  it("should list all documents on Firestore", async () => {
		try {
			const result = await listAllDocuments(
				db,
				"users",
			);
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
})