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
      // { name: 'mobile', stock: { $gt: 20 } } find er modde dile filter korbe
      const collection = client.db("redOnion").collection("foods");
      // const collection = client.db("onlineStore").collection("products");
      collection.find().toArray((err, documents) => {
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




app.get("/allFeatures", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("redOnion").collection("features");
    collection.find().toArray((err, documents) => {
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


app.get('/product/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  // find({id:id})
  // console.log(req.query.sort);
  // console.log(req.params);

  // const name = users[id]
  // res.send({id, name})
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    // { name: 'mobile', stock: { $gt: 20 } } find er modde dile filter korbe
    const collection = client.db("redOnion").collection("foods");
    // const collection = client.db("onlineStore").collection("products");
    collection.find().toArray((err, documents) => {
      console.log(documents)
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        const dataSend = documents[id - 1]
        console.log(dataSend)
        res.send(dataSend);
      }
    });
    client.close();
  });
})


app.get('/food/:id', (req, res) => {
    const id = Number(req.params.id)
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      const collection = client.db("redOnion").collection("foods");
      collection.find({id}).toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents[0]);
        }
      });
      client.close();
    });
})



app.post('/getProductsByKey', (req, res) => {
  const key = req.params.key
  const productKeys = req.body
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("redOnion").collection("foods");
    // const collection = client.db("onlineStore").collection("products");
    collection.find({ key: {$in: productKeys} }).limit(5).toArray((err, documents) => {
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




// post
app.post('/placeOrder', (req, res) => {
  const orderDetails = req.body
  orderDetails.orderTime = new Date()
    

  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("redOnion").collection("orders");
    // const collection = client.db("onlineStore").collection("orders");
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: err })
      } else {
        res.send(result.ops[0]);
      }

    })
    client.close();
  });
}) 



app.post('/addProduct', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    const product = req.body

    client.connect(err => {
      const collection = client.db("redOnion").collection("foods");
    // const collection = client.db("onlineStore").collection("products");
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


app.post('/addProducts', (req, res) => {
  // console.log('data received', req.body);
  client = new MongoClient(uri, { useNewUrlParser: true });

  //save to database
  const product = req.body
  // console.log(product);

  client.connect(err => {
    const collection = client.db("redOnion").collection("features");
    // const collection = client.db("onlineStore").collection("products");
    collection.insert(product, (err, result) => {
      // console.log("successfully inserted", result);
      if (err) {
        console.log(err)
        res.status(500).send({ message: err })
      } else {
        res.send(result.ops[0]);
      }

    })
    client.close();
  });
})

const port = process.env.PORT || 4300
app.listen(port, () => console.log(`Listening to port ${port}`))











