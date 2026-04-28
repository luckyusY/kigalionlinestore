import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  _kigaliMongoClientPromise?: Promise<MongoClient>;
};

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._kigaliMongoClientPromise) {
      globalForMongo._kigaliMongoClientPromise = new MongoClient(uri).connect();
    }
    return globalForMongo._kigaliMongoClientPromise;
  }

  return new MongoClient(uri).connect();
}

export async function getDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db(process.env.MONGODB_DB || "kigalionlinestore");
}
