const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config()

const app = express()

app.use(cors())
// parse application/json
app.use(bodyParser.json());



const uri = process.env.DB_PATH


let client = new MongoClient(uri, { useNewUrlParser: true });
const users = ["Arif", "Arman", "Abir", "Khan"]






// const  rootCall = (req, res) => res.send('Thank you very much')
// app.get('/', rootCall)

app.get('/', (req, res) =>{
    res.send('Thank you for calling me')
})
app.get("/products", (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      const collection = client.db("onlineStore").collection("products");
      collection.find( {name: 'mobile', stock: {$gt:20} }).limit(5).toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents);
        }
      });
      client.close();
    });
    
});

app.get('/fruits/banana', (req, res) => {
    res.send({fruit:'banana', quantity:1000, price:10000})
})

app.get('/users/:id', (req, res) => {
    const id = req.params.id
    // console.log(req.query.sort);
    const name = users[id]
    // console.log(req.params);
    res.send({id, name})
})


// post
app.post('/addProduct', (req, res) => {
    // console.log('data received', req.body);
    client = new MongoClient(uri, { useNewUrlParser: true });

    //save to database
    const product = req.body
    // console.log(product);

    client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.insertOne(product, (err, result) => {
        // console.log("successfully inserted", result);
        if (err) {
            console.log(err)
            res.status(500).send({message: err})
        }else{
            res.send(result.ops[0]);
        }
        
    })
    client.close();
    });
})

const port = process.env.PORT || 4200
app.listen(port, () => console.log(`Listening to port ${port}`))











