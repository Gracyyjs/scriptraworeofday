import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://jrizz:jrizz1505@cluster0.4weqqem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}
