require('dotenv').config()
var client = require('./app.js');
const express = require('express')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const path = require('path')
const bodyParser = require('body-parser')

const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 5000
const app = express();
app.use(express.json());
const mails = client.inbox
console.log("Inbox contains:", mails)


app.get('/', (req, res) => {
	res.send('HOME PAGE');
});

app.get('/inbox', (req, res) =>{
	//display mails in inbox
	res.send(client.inbox)
})

app.get('/inbox/:id', (req,res) => {
	//display specific email
	res.send(req.params.id)
})

app.listen(port, () => console.log(`Listening on port ${port}...`));


