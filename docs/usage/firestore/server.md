# Working with Firestore on the server

::: tip
Fireman abstracts the Firestore SDK API providing you [exactly the same API you use on the client](/usage/firestore/), but on the server using the package `@fireman/admin`.

`@fireman/admin` provides also provide a few more helper functions to make your requests easier on the server.
In most cases every function you use on the client should work the same on the server with the package (but not the other way around).
:::

## Querying, updating and deleting data

Works exactly as on the client. [see here](/usage/firestore/), however, the imports should be replaced by `@fireman/admin`:

::: info
`db` is your Firestore instance ([see guide](/guide/#initializing-firestore) for how to initialize it). It needs to be passed as first argument in each function
:::

```js
import Fireman from "fireman/admin/firestore";

const fireman = new Fireman(db);

// get
fireman.get("users", {doc: "user1"}).then((userinfo) => {
  console.log(userinfo);
});

// add
fireman.add("todo", todoData)

// update
fireman.update("todo", "todo1", { title: "new" })

// delete
fireman.delete("todo", "todo1")
```

## List all documents `[server only]`

`@fireman/admin` provides a helper function to [list all documents in a collection](https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#listDocuments). This function returns all documents with ids (yes, even the zombie ones).

```js
import { listAllDocuments } from "@fireman/admin/firestore/utils";

listAllDocuments(db, collectionId).then(allDocs => {
  console.log(allDocs)
})
```
