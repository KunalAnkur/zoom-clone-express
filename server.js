const express = require('express')
const app = express()
const server = require('http').Server(app)

app.get('/' ,(req,res)=>{
    res.status(200).send('<h1>hello world</h1>')
})

server.listen(3000,()=>{
    console.log('The server is started at localhost:3000')
})
