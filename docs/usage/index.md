# Working with Firestore

## Get documents

Fireman provide a single querying powerful interface, with the `get` function, you are able to easily get single documents and collections from your Firestore instances.

::: tip
`db` is your Firestore instance ([see guide](/guide/#initializing-firestore) for how to initialize it). It needs to be passed as first argument in each function
:::

### Get a single document

```js
import { get } from "@fireman/web/firestore";

get(db, {collectionId: "users", documentId: "user1"}).then((userinfo) => {
  console.log(userinfo); // returns true or false
});
```

### Get all documents from collection

```js
import { get } from "@fireman/web/firestore";

get(db, {collectionId: "users"}).then((userinfo) => {
  console.log(userinfo);
});
```

### Get documents with filters (querying)

```js
import { get } from "@fireman/web/firestore";

get(db, {
    collectionId: "users",
    whereArray: [{field: "name", op: "==", val: "fireman"}],
    orderByArray: [{field: "createdOn", dir: "desc"}],
    limitDocs: 20
  }).then((usersFound) => {
  console.log(usersFound);
});
```

### Check if a document exists

Returns a boolean indicating if a document exists.

```js
import { doesDocumentExists } from "@fireman/web/firestore";

doesDocumentExists(db, "users", "user1").then((exists) => {
  console.log(exists); // => true or false
});
```

::: warning
Errors are not caught internally by Fireman, you need to handle them yourself. Add a `.catch` on your functions or wrap them with a `try/catch` block.
:::

### Type declaration

```ts
type FiremanWhere =  {
 field: string | FieldPath;
 op: WhereFilterOp;
 val: unknown;
}

type FiremanOrderBy = {
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
```

## Add documents

Firestore offers a two ways to add documents to your collection. You can either add a document and generate a new ID for it, or you can add a document with a specific ID.

### Add with auto generated ID

```js
import { addDocument } from "@fireman/web/firestore";

const todoData = {
  title: "Learn Firebase",
  completed: false,
  createdOn: new Date()
}

addDocument(db, todo, todoData)
```

### Add with custom ID

```js
addDocument(db, todo, todoData, "todo1")
```

## Update documents

```js
import { updateDocument } from "@fireman/web/firestore";

updateDocument(db, todo, {title: "new"}, "todo1")
```

## Delete documents

```js
import { deleteDocument } from "@fireman/web/firestore";

deleteDocument(db, todo, "todo1")
```
