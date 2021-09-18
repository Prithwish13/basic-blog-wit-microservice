const express = require("express")
const cors = require("cors")
const {json} = require("body-parser")
const {randomBytes} = require("crypto")
const axios = require("axios").default
const app = express()
const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };

const posts = {}
app.use(cors(corsOpts))
app.use(json())
app.get("/posts",(req,res)=> {
    res.send(posts)
})

app.post("/posts",async (req, res)=>{
    const id =  randomBytes(4).toString("hex")
    const {title} = req.body
    posts[id]= {
        id,
        title
    }
    try {
     await axios.post("http://localhost:4005/events",{
        type: "postCreated",
        data: {
          id,
          title
        }
      })
    } catch (error) {
      console.log(error)
    }
    res.status(201).send(posts[id])
});

app.post("/events", (req, res) => {
  console.log("Received Events", req.body.type)
  res.send({})
})

app.listen(4000, ()=> {
    console.log("listening on 4000")
})
