import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://milanjiji0987654321:vhlQrQ49THxvQH6D@cluster0.49g9d.mongodb.net/travoxa?appName=Cluster0";

async function checkGroups() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const groups = await db.collection('backpackergroups').find({}).toArray();
        if (!groups) {
          console.log("No collection 'backpackergroups' found or no documents.");
          process.exit(0);
        }
        
        console.log(`Total groups: ${groups.length}`);
        groups.forEach(g => {
            console.log(`Group: ${g.groupName}, Verified: ${g.verified}, TripSource: ${g.tripSource}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkGroups();
