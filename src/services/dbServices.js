
const { ObjectId } =  require("mongodb");
const {connection} = require("../config.js")
const fs = require('fs');
const path = require('path');


const addNumbers = async (req, res) => {
    const data = req?.body;


    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('phone_numbers').insertOne({...data, created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result});
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};

const addItems = async (req, res) => {
    const data = req?.body;


    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection(data?.table).insertOne({...data?.data, created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result});
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};

const getItems = async (req, res) => {
    const { query,table } = req?.body;
    console.log(query,table);
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        

        // Perform the query
        const result = await db.collection(table).find(query).sort({ _id: -1 }).toArray();
        
        
        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};
const getItemsFromCrm = async (req, res) => {
   
    
    const { query,table } = req?.body;
    console.log("connects 2",req?.body);
    try {
        const db = await connection("cpr-utm"); // Ensure connection is established

        // Prepare the query to find documents by host
        

        // Perform the query
        const result = await db.collection(table).find(query).sort({ _id: -1 }).toArray();
        console.log(result);
        
        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};

const updateMessageStatus = async (req, res) => {
    //const sql = "SELECT * FROM schedule";
    const {data,table,query} = req?.body;
    try {
        const db = await connection(); // Ensure connection is established
        
        
        
        // Insert the document into the `phone_numbers` collection
        const result = await db.collection(table).updateMany(
            { ...query },          // Filter
            { $set: { ...data } }       // Update
          );
       
          
        // Respond with the inserted document
        res.send({ status: 200, message: "Updated", result: result});
        // return result
        
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Data Not Updated", err });
        // console.log(err);
        
    }
};


const updateItem = async (req, res) => {
    //const sql = "SELECT * FROM schedule";
    const {data,table,id} = req?.body;
    try {
        const db = await connection(); // Ensure connection is established
        const objid  = new ObjectId(id)
        console.log(objid,data,table,id);
        
        // Insert the document into the `phone_numbers` collection
        const result = await db.collection(table).updateOne(
            { _id:objid },          // Filter
            { $set: { ...data } }       // Update
          );

        // Respond with the inserted document
        res.send({ status: 200, message: "Updated", result: result});
        // return result
        
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Data Not Updated", err });
        // console.log(err);
        
    }
};
const updateItemCrm = async (req, res) => {
    //const sql = "SELECT * FROM schedule";
    const {data,table,id} = req?.body;
    try {
        const db = await connection("cpr-utm"); // Ensure connection is established
        const objid  = new ObjectId(id)
        console.log(objid,data,table,id);
        
        // Insert the document into the `phone_numbers` collection
        const result = await db.collection(table).updateOne(
            { _id:objid },          // Filter
            { $set: { ...data } }       // Update
          );

        // Respond with the inserted document
        res.send({ status: 200, message: "Updated", result: result});
        // return result
        
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Data Not Updated", err });
        // console.log(err);
        
    }
};


const addSectors = async (req, res) => {
    const data = req?.body;


    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('sectors').insertOne({...data, created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result});
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};

const addUser = async (req, res) => {
    const data = req?.body;
    console.log(data);

    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('users').insertOne({...data, created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result});
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};
const getConverSation = async (req, res)=>{
    try {
        
        const db = await connection();
        const {senderId,receiverId} = req?.body;

        const query = {
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        };

        const options = {
            sort: { timestamp: -1 } // Sort by timestamp in ascending order (oldest first)
        };

        const conversation = await db.collection("wa_messages").find().toArray();
        console.log("Conversation between the two users:", conversation);
        return res.send({ status: 200, message: "Saved", result: conversation});
       
    }catch(err){
        res.send({ status: 503, message: "Error", err});
    }
}
const saveMessage = async (req, res) => {
    const data = req?.body;
    console.log(data);

    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('wa_messages').insertOne({...data, created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Saved", result: result});
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};


const addMultipleNumbers = async (req, res) => {
    const data = req?.body; // Assuming `data` is an array of arrays like [[name1, phone1, host1], [name2, phone2, host2], ...]
    try {
        const db = await connection(); // Ensure connection is established
        console.log(data);
        
        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('phone_numbers').insertMany(data);

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result });
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};

const deleteNumber = async (req, res) => {
    const { host, phone } = req?.body;
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to delete documents where phone is in the given list and host matches
        const query = {
            phone: { $in: phone }
        };

        // Perform the deletion
        const result = await db.collection('phone_numbers').deleteMany(query);

        // Respond with the result
        res.send({ status: 200, message: "Deleted", result: result.deletedCount });
    } catch (err) {
        res.send({ status: 500, message: "Data Not Deleted", err });
    }
};

const deleteschedule = async (req, res) => {
    const { id } = req?.body;
    try {
        const db = await connection(); // Ensure connection is established

        // Convert 'id' to the correct format if necessary (e.g., ObjectId)
        const objectId = new ObjectId(id) // Convert string ID to ObjectId if it's an ObjectId

        // Prepare the query to delete a document by ID
        const query = { _id: objectId };

        // Perform the deletion
        const result = await db.collection('schedule').deleteOne(query);

        // Respond with the result
        res.send({ status: 200, message: "Deleted", result: result.deletedCount });
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Data Not Deleted", err });
    }
};

const deleteItem = async (req, res) => {
    const { id,table } = req?.body;
    try {
        const db = await connection(); // Ensure connection is established

        // Convert 'id' to the correct format if necessary (e.g., ObjectId)
        const objectId = new ObjectId(id) // Convert string ID to ObjectId if it's an ObjectId

        // Prepare the query to delete a document by ID
        const query = { _id: objectId };

        // Perform the deletion
        const result = await db.collection(table).deleteOne(query);

        // Respond with the result
        res.send({ status: 200, message: "Deleted", result: result.deletedCount });
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Data Not Deleted", err });
    }
};
const deleteItemcrm = async (req, res) => {
    const { id,table } = req?.body;
    try {
        const db = await connection("cpr-utm"); // Ensure connection is established

        // Convert 'id' to the correct format if necessary (e.g., ObjectId)
        const objectId = new ObjectId(id) // Convert string ID to ObjectId if it's an ObjectId

        // Prepare the query to delete a document by ID
        const query = { _id: objectId };

        // Perform the deletion
        const result = await db.collection(table).deleteOne(query);

        // Respond with the result
        res.send({ status: 200, message: "Deleted", result: result.deletedCount });
    } catch (err) {
        console.log(err);
        
        res.send({ status: 500, message: "Data Not Deleted", err });
    }
};
const deleteImage = async (req, res) => {
    const { image } = req?.body;
    const fullImagePath = path.resolve('/home/fwabdaln/dash.universalinternational.org/wa-api-images', image);
    
    fs.unlink(fullImagePath, async (err) => {
        if (err) {
            console.error("Error deleting image:", err);
            return res.status(500).send({ status: 500, message: "Failed to delete image" });
        }
        
        try {
            const db = await connection(); // Ensure connection is established
    
            
    
            // Prepare the query to delete a document by ID
            const query = { image };
    
            // Perform the deletion
            const result = await db.collection('images').deleteOne(query);
    
            // Respond with the result
            res.send({ status: 200, message: "Deleted", result: result.deletedCount });
        } catch (err) {
            console.log(err);
            
            res.send({ status: 500, message: "Data Not Deleted", err });
        }
    
    
    })
    
};

const insertHistory = async (req, res) => {
    const data = req?.body;
    //const sql = "INSERT INTO history (column1, column2, column3) VALUES ($1, $2, $3) RETURNING *";
    
    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('history').insertOne({...data,created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result,data });
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};

const getNumbers = async (req, res) => {
    const { host } = req?.body;
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        const query = { host };

        // Perform the query
        const result = await db.collection('phone_numbers').find().sort({ _id: -1 }).toArray();

        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};

const getSectors = async (req, res) => {
    const { host } = req?.body;
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        const query = {  };

        // Perform the query
        const result = await db.collection('sectors').find(query).sort({ _id: -1 }).toArray();

        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};

const getHistory = async (req, res) => {
    
    
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        const query = { };

        // Perform the query
        const result = await db.collection('history').find(query).sort({ _id: -1 }).limit(1000).toArray();

        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};


const getImages = async (req, res) => {
   
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        const query = {  };

        // Perform the query
        const result = await db.collection('images').find(query).sort({ _id: -1 }).toArray();

        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};

const makeScadual = async (req, res) => {
    const data = req?.body;
    // const sql = "INSERT INTO schedule (column1, column2) VALUES ($1, $2) RETURNING *";
    
    try {
        const db = await connection(); // Ensure connection is established

        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('schedule').insertOne({...data,created_at:new Date().getTime()});

        // Respond with the inserted document
        res.send({ status: 200, message: "Inserted", result: result });
    } catch (err) {
        res.send({ status: 500, message: "Data Not Inserted", err });
    }
};

const checkScedule = async (req, res) => {
    //const sql = "SELECT * FROM schedule";
    
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        const query = { };

        // Perform the query
        const result = await db.collection('schedule').find(query).sort({ _id: -1 }).toArray();

        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};

const updateUser = async (req, res) => {
    //const sql = "SELECT * FROM schedule";
    const {phone,instance_id,access_token,name} = req?.body;
    try {
        const db = await connection(); // Ensure connection is established
        const objid  = new ObjectId(id)
        // Insert the document into the `phone_numbers` collection
        const result = await db.collection('users').updateOne(
            { id:'1' },          // Filter
            { $set: { instance_id: instance_id,access_token:access_token,name,phone:phone,updated_at:new Date().getTime() } }       // Update
          );

        // Respond with the inserted document
        res.send({ status: 200, message: "Updated", result: result});
        // return result
        
    } catch (err) {
        res.send({ status: 500, message: "Data Not Updated", err });
        // console.log(err);
        
    }
};

const getanuser = async (req, res) => {
    const { number } = req?.body;
    try {
        const db = await connection(); // Ensure connection is established

        // Prepare the query to find documents by host
        const query = { number:number };

        // Perform the query
        const result = await db.collection('users').find(query).sort({ _id: -1 }).toArray();

        // Respond with the result
        res.send({ status: 200, message: "Success", result });
    } catch (err) {
        res.send({ status: 500, message: "Not Data Fetched", err });
    }
};

module.exports = { addMultipleNumbers, addNumbers, addUser, checkScedule, deleteNumber, deleteschedule, getanuser, getHistory, getImages, getNumbers, insertHistory, makeScadual, updateUser,deleteImage, addSectors, getSectors, deleteItem, addItems, getItems, updateItem, saveMessage, getConverSation, updateMessageStatus, getItemsFromCrm, updateItemCrm }
