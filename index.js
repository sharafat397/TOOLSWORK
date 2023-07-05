
const express = require('express')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = 5000
// middle ware
app.use(cors())
app.use(express.json())

const uri =
  'mongodb+srv://Traveling-5th:g7zdHnix875yuNIc@cluster0.5hh8jwe.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const database = client.db('Traveling-with-fifth')
    const serviceCollection = database.collection('services')
    console.log('Database Connected')

    // send services to the database:
    app.post('/services', async (req, res) => {
      const service = req.body
      const result = await serviceCollection.insertOne(service)
      
      res.json(result)
      
    });

    // Update data into service collection:
    
    app.put('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const updatedService = req.body
      
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }

      const updateDoc = {
        $set: {
          name: updatedService.name,
          price: updatedService.price,
          duration: updatedService.duration,
          img: updatedService.img,
        },
      }
      const result = await serviceCollection.updateOne(
        filter,
        updateDoc,
        options
      )
      
      res.json(result)
    })
    
    // get All services
    app.get('/services', async(req,res) =>{
      const cursor = serviceCollection.find({})
      const service = await cursor.toArray()
      res.send(service)
      
      
    })

    // get a single service from service collection
    app.get('/services/:id([0-9a-fA-F]{24})', async(req, res)=>{
      const id = req.params.id.trim()
      const query = {_id: ObjectId(id)}
      const service = await serviceCollection.findOne(query)
      res.json(service)
      
    })
     // delete a data from service collection
     app.delete('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.deleteOne(query)
      res.json('result')
    })
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Travling on port:", port);
});




