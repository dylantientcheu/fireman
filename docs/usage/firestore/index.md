# Working with Firestore

After initializing an instance of Fireman you can query, update and delete data from your firestore instance using the [previously instantiated](/guide/#initializing-fireman/) Fireman instance.

## Get documents

Fireman provide a single querying powerful interface, with the `get` function, you are able to easily get single documents and collections from your Firestore instances.

::: tip
`db` is your Firestore instance ([see guide](/guide/#initializing-firestore) for how to initialize it). It needs to be passed as first argument in each function
:::

### Get a collection or a single document

```js
const fireman = new Fireman(db);

// Get a single document
fireman.get("users", {doc: "documentIdToQuery"}).then((usersinfo) => {
  console.log(userinfo);
});

// You could also append the document id to the collection name in the first argument
fireman.get("users/documentIdToQuery").then((userInfo) => {
  console.log(userInfo)
})
```

### Get documents with filters (querying)

```js
fireman.get("users", {
  where: [{field: "name", op: "==", val: "fireman"}],
  orderBy: [{field: "createdOn", dir: "desc"}],
  limit: 20
}).then((usersFound) => {
  console.log(usersFound);
});
```

::: warning
Errors are not caught internally by Fireman, you need to handle them yourself. Add a `.catch` on your functions or wrap them with a `try/catch` block.
:::

### Type declaration

```ts
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
  doc?: string;
  where?: FiremanWhere[];
  order?: FiremanOrderBy[];
  limit?: number;
}
```

## Add documents

Firestore offers a two ways to add documents to your collection. You can either add a document and generate a new ID for it, or you can add a document with a specific ID.

### Add with auto generated ID

```js
const todoData = {
  title: "Learn Firebase",
  completed: false,
  createdOn: new Date()
}

fireman.add("todos", todoData)
```

### Add with custom ID

```js
fireman.add("todos", todoData, "todoId")
```

## Update documents

```js
fireman.update("todos", { title: "new" }, "todo1")
```

## Delete documents

```js
fireman.delete("todos", "todo1")
```
