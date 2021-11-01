const express =require('express')
const app=express()
const cors=require('cors')
const { MongoClient } = require('mongodb');
const port=process.env.PORT|| 5000;
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iz4fi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req,res)=>{
    res.send("server is working!! ")
})







client.connect(err => {
    const serviceCollection = client.db("Bistora-database").collection("services");
    const usersCollection=client.db("Bistora-database").collection("users")
    
    // add users
    app.post("/addUsers",async(req,res)=>{
        console.log(req.body)
        const result=await usersCollection.insertOne(req.body)
        console.log(result)
    })

    // get my orders
    app.get("/myOrders/:email",async (req,res)=>{
        console.log(req.body)
        const result=await usersCollection.find({
            mail:req.params.email,
        }).toArray();
        res.send(result)
    })



    // add orders
    app.post("/addServices", async (req, res) => {
        console.log(req.body);
        const result=await serviceCollection.insertOne(req.body)
        console.log(result);
    });
    
    // get data
    app.get("/services", async (req,res)=>{
        console.log(req.body);
        const result =await serviceCollection.find({}).toArray()
        
        res.send(result)
    })

    // get single item
    app.get("/services/:id",async (req, res) => {
        console.log(req.params.id);
        await serviceCollection
          .find({ _id: ObjectId(req.params.id) })
          .toArray((err, results) => {
            res.send(results[0]);
          });
    });

    // delete orders
    app.delete("/deleteOrders/:id",async(req,res)=>{
        console.log(req.params.id)
        const result= await usersCollection.deleteOne({
            _id:ObjectId(req.params.id),
        })
        res.send(result)
    })

    // delete services
    app.delete("/deleteServices/:id",async(req,res)=>{
        console.log(req.params.id)
        const result= await serviceCollection.deleteOne({
            _id:ObjectId(req.params.id),
        })
        res.send(result)
    })




    // get all user
    app.get("/allOrders",async(req,res)=>{
        const result= await usersCollection.find({}).toArray();
        res.send(result)
    })
    // get all services

    app.get("/allServices",async(req,res)=>{
        const result =await serviceCollection.find({}).toArray()
        res.send(result)
    })
    
    // client.close();

});


app.listen(port,()=>{
    console.log('hello',port)
})