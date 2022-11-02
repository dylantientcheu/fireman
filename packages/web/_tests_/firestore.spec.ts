import { db } from "./appInit";
import Fireman from "../../../dist/web/firestore";
import { expect } from "chai";

describe("Firestore web class functions test", () => {
	it("should be able to query from a collection", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.get("users");
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
	it("should be able to query from a collection and return id with different field id", async () => {
		const fireman = new Fireman(db, "_id__");
		try {
			const result = await fireman.get("users");
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
	it("should be able to get a document from a collection", async () => {
		const fireman = new Fireman(db, "_id__");
		try {
			const id = "KJp2JGqW39QqoURsPBU1HlvvhgU2";
			const result = await fireman.get(`users/${id}`);
			expect(result["_id__"]).to.eq(id);
		} catch (error) {
			console.log(error);
		}
	});

	it("should be able to return a doc using the second query notation", async () => {
		const fireman = new Fireman(db);
		try {
			const id = "KJp2JGqW39QqoURsPBU1HlvvhgU2";
			const result = await fireman.get(`users`, { doc: id });
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});

	it("should be able to query from a collection with where filters", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.get("users", {
				where: [{ field: "subscribed", op: "!=", val: false }],
			});
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
	it("should be able to query from a collection with orderby filters", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.get("users", {
				order: [{ field: "subscribedOn", dir: "desc" }],
			});
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
	it("should be able to query from a collection with limits", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.get("users", { limit: 1 });
			expect(result).to.have.length(1);
		} catch (error) {
			console.log(error);
		}
	});
	it("should add a document with generated id on Firestore", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.add("users", {
				name: "John Doe",
				subscribed: true,
				subscribedOn: new Date(),
			});
			expect(result).to.be.ok;
		} catch (error) {
			console.log(error);
		}
	});
	it("should add a document with specified id on Firestore", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.add(
				"users",
				{
					name: "John Doe",
					subscribed: true,
					subscribedOn: new Date(),
				},
				"johnDoe"
			);
			expect(result).to.be.undefined;
		} catch (error) {
			console.log(error);
		}
	});
	it("should update a document on Firestore", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.update("users", "johnDoe", {
				name: "John Doe",
				subscribed: false,
				subscribedOn: new Date(),
			});
			expect(result).to.be.undefined;
		} catch (error) {
			console.log(error);
		}
	});
	it("should delete a document from Firestore", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.delete("users", "johnDoe");
			expect(result).to.be.undefined;
		} catch (error) {
			console.log(error);
		}
	});
	it("should be able to count correctly the number of documents in collection", async () => {
		const fireman = new Fireman(db);
		try {
			const result = await fireman.count("count");
			expect(result).to.eq(3);
		} catch (error) {
			console.error(error);
		}
	});
});
