const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
// const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
const app = express()
app.use(cors());
app.use(express.json()); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cidqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
         try{
                  await client.connect();
                  console.log('Database connected')

                  const database = client.db('shopistic');
                  const productsCollection = database.collection('products');
                  const usersCollection = database.collection('users');
                  const ordersCollection = database.collection('orders');
                  const reviewsCollection = database.collection('reviews');

                  // get all products
                app.get('/products', async(req, res) =>{
                const result = await productsCollection.find({}).toArray();
                res.json(result);
                });

                //save user to the database
              app.post('/users', async(req, res)=>{
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                res.json(result);
              });
              //verify admin
              app.get('/users/:email', async(req, res)=>{
                const email = req.params.email;
                const query = {email: email};
                const user = await usersCollection.findOne(query);
                let isAdmin = false;
                if(user?.role === 'admin'){
                  isAdmin = true;
                }
                res.json({admin: isAdmin});
              })
              // upset users
              app.put('/users', async (req, res) => {
                const user = req.body;
                const filter = { email: user.email };
                const options = { upsert: true };
                const updateDoc = { $set: user };
                const result = await usersCollection.updateOne(filter, updateDoc, options);
                res.json(result);
            });

                    // make admin
                app.put('/users/admin', async (req, res) => {
                  const user = req.body;
                  console.log(user);
                  const filter = { email: user.email };
                  const updateDoc = { $set: {role: 'admin'} };
                  const result = await usersCollection.updateOne(filter, updateDoc);
                  res.json(result);
                });

                  /* /* //---------------------Authentication-----------------------//


                      //getting users info to differnciate admin and user
                      app.get('/users/:email', async (req, res) => {
                        const email = req.params.email;
                        const query = { email: email };
                        const user = await usersCollection.findOne(query);
                        let isAdmin = false;
                        if (user?.role === 'admin') {
                            isAdmin = true;
                        }
                        res.json({ admin: isAdmin });
                    })

                    //send users to database
                    app.post('/users', async (req, res) => {
                        const user = req.body;
                        const result = await usersCollection.insertOne(user);
                        res.json(result);
                    })

                    //for sending new google login user to database
                    app.put('/users', async (req, res) => {
                        const user = req.body;
                        const filter = { email: user.email };
                        const options = { upsert: true };
                        const updateDoc = {
                            $set: user
                        }
                        const result = await usersCollection.updateOne(filter, updateDoc, options);
                        res.json(result);
                    })

                    //make admin[we can do status pending like this]
                    app.put('/users/admin', async (req, res) => {
                        const user = req.body;
                        const filter = { email: user.email };
                        const updateDoc = {
                            $set: { role: 'admin' }
                        };
                        const result = await usersCollection.updateOne(filter, updateDoc);
                        res.json(result);
                    }) */

 
         }
         finally{
                  // await client.close(); 
         }
}

run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.listen(port, () => {
  console.log(`Shopistic is listening at http://localhost:${port}`)
})