const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://dbUser1:fsIvGho18wQK9ybT@cluster0.vhnnfcc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  async function run() {
    try {
      const mainUsers = client.db("UserInfos").collection("Users");
      // create user
      app.post("/users", async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await mainUsers.insertOne(user);
        console.log(result);
        res.send(result);
      });

      // get all users

      app.get("/", async (req, res) => {
        const query = {};
        const curser = mainUsers.find(query);
        const result = await curser.toArray();
        res.send(result);
      });

       // find single user

       app.get("/user/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await mainUsers.findOne(query);
        res.send(user);
      });

      // update user
      app.put("/user/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const userData = req.body;
        const option = { upsert: true };

        const updateUser = {
          $set: {
            name: userData.name,
            email: userData.email,
            Address: userData.Address,
          },
        };
        const result = await mainUsers.updateOne(query,updateUser,option)
        res.send(result)
      });

     
      // deleting user data
      app.delete("/user/delete/:id", async (req, res) => {
        const userID = req.params.id;
        const query = { _id: ObjectId(userID) };
        const deleteUser = await mainUsers.deleteOne(query);
        res.send(deleteUser);
      });
    } finally {
    }
  }
  run((error) => {
    console.log(error);
  });
});

app.listen(port, () => {
  console.log(`api listening port in ${port}`);
});

// user: dbUser1
// password: fsIvGho18wQK9ybT
