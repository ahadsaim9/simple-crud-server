const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

/* *************** middleware *************** */
app.use(cors());
app.use(express.json());

/* *************** end middleware *************** */
// ELDPP9T99BdjbZ11;

const uri =
  "mongodb+srv://ahadsaim111:ELDPP9T99BdjbZ11@cluster0.04p06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();

    // const database = client.db("userDB");
    // const usersCollection = database.collection("users");

    const usersCollection = client.db("userDB").collection("user");

    /* *************** Users get  *************** */
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    /* *************** Update *************** */
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });
    /* *************** Update end *************** */
    /* *************** put *************** */
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateUser,
        option
      );
      res.send(result);
    });

    /* *************** Post *************** */
    app.post("/users", async (req, res) => {
      const user = req.body;

      console.log(`New User:`, user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    console.log("Connected to MongoDB");
    /* *************** post end *************** */

    /* *************** Delete *************** */

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("please delete id from database: ", id);

      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    /* *************** Delete end *************** */
    await client.db("admin").command({ ping: 1 });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  } finally {
    // await client.close();
  }
}

run();
/* *************** Connect *************** */

/* *************** get *************** */

app.get("/", (req, res) => {
  res.send("Simple crud is running....");
});

app.listen(port, () => {
  console.log(`simple crud is running on port: ${port}`);
});

console.log("Server is starting...");
