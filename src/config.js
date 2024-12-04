const { MongoClient } = require('mongodb')
const url = 'mongodb+srv://shaki:shaki@cluster1.o9bisql.mongodb.net/';
const client = new MongoClient(url);


// Database Name
const dbName = 'wa_api';
let db = null;
const connection = async () => {
    if (!db) {
        try {
            await client.connect();
            console.log('Connected to MongoDB-'+dbName);
            db = client.db(dbName);
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            throw err;
        }finally{
            
        }
    }
    return db;
};

module.exports= {connection};
