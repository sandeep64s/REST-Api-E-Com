import { MongoClient } from "mongodb";

const url = process.env.DB_URL;

let client;

export const connectToMongoDB = () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("Mongodb is connected");
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient=()=>{
  return client;
}

export const getDB = () => {
  return client.db();
};

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counter")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    await db.collection("counter").insertOne({ _id: "cartItemId", value: 0 });
  }
  const existingCounter1 = await db
    .collection("counter")
    .findOne({ _id: "productId" });
  if (!existingCounter1) {
    await db.collection("counter").insertOne({ _id: "productId", value: 0 });
  }
};

const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 });
    console.log("Indexes are created");
  } catch (err) {
    console.log("Error in createIndexes : " + err);
  }
};
