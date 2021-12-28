const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ssjj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express.static middleware
const staticPath = path.join(__dirname, '../public')
app.use(express.static(staticPath))


// mongodb connect
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const noteCollection = client.db(process.env.DB_NAME).collection(process.env.DB_SUBNAME);


    // get data from mongodb
    app.get('/readFromDatabase', (req, res) => {
        noteCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
    // edit an item from mongodb
    app.get('/editSingleTopic/:id', (req, res) => {
        const editItem = req.params.id
        noteCollection.find({ _id: ObjectId(editItem) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })
    // updating value to mongodb
    app.patch('/updateValue/:id', (req, res) => {
        const updateItem = req.params.id;
        noteCollection.updateOne({ _id: ObjectId(updateItem) },
            {
                $set: {
                    name: req.body.name,
                    date: req.body.date,
                    question: req.body.question,
                    ans: req.body.ans,
                }
            }
        )
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })
    // delete data form mongodb
    app.delete('/delete/:id', (req, res) => {
        const deleteItem = req.params.id;
        noteCollection.deleteOne({_id: ObjectId(deleteItem)})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })
    // post data to mongodb
    app.post('/dataInjectDatabase', (req, res) => {
        const receiveData = req.body;
        noteCollection.insertOne(receiveData)
            .then(result => {
                res.redirect('/')
                console.log('data send mongodb successfully')
            })
    })
    console.log('database connected');
});


// port listening
const port = 1000;
app.listen(port, () => {
    console.log(`port listen ${port}`);
})