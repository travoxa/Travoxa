const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://milanjiji0987654321:NnJOOXTkMp0iatG9@cluster0.49g9d.mongodb.net/?appName=Cluster0";

async function test() {
  console.log('Testing MongoDB connection...');
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected successfully to MongoDB!");
    
    // List databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log("📂 Available databases:");
    dbs.databases.forEach(db => console.log(`  - ${db.name}`));
    
    await client.close();
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Full error:", error);
  }
}

test();
