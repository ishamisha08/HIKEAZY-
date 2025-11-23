import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://Hikeazy:HikeaesilywithHikeazy@cluster0.9u93b.mongodb.net';

async function deleteData() {
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB
        await client.connect();

        // Select the database and collection
        const database = client.db("Hikeazy"); // Replace with your database name
        const collection = database.collection("bookings"); // Replace with your collection name

        // Delete multiple documents where a field matches a specific value
        const deleteManyResult = await collection.deleteMany({state :"Terengganu" }); // Adjust field name and value
        console.log(`${deleteManyResult.deletedCount} document(s) were deleted.`);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        // Close the connection
        await client.close();
    }
}

// Call the function
deleteData();
