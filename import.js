const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = 'mongodb+srv://usungur_db_user:IQea0v5bsLzZbDV@cluster0.uwtdtom.mongodb.net/propertypulse?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('propertypulse');
        const collection = db.collection('properties');

        const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} belge yüklendi.`);
    } catch (err) {
        console.error('Hata:', err);
    } finally {
        await client.close();
    }
}

run();
