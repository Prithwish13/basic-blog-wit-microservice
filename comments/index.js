const express = require("express")
const cors = require("cors")
const {json} = require("body-parser")
const {randomBytes} = require("crypto")
const axios = require("axios").default
const app = express()

const commentsByPostId  = {}
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
app.use(cors(corsOpts))
app.use(json())
app.get("/posts/:id/comments",(req,res)=> {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post("/posts/:id/comments", async (req, res)=>{
    const commentId =  randomBytes(4).toString("hex")
    const {content} = req.body
    const comments = commentsByPostId[req.params.id] || []
    comments.push({id: commentId, content: content, status: "pending"})
    commentsByPostId[req.params.id] = comments
    try {
      await axios.post("http://localhost:4005/events",{
         type: "COMMENT_CREATED",
         data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: "pending"
         }
       })
     } catch (error) {
       console.log(error)
     }
    res.status(201).send(comments)
});

app.post("/events", async (req, res) => {
  console.log("Received Events", req.body.type)
  const {type, data } = req.body
  if(type === "COMMENT_MODERATED") {
  const {id, postId, status, content} = data
  const comments = commentsByPostId[postId]
  console.log(comments)
  const comment = comments.find(comment => comment.id === id)
  comment.status = status
  try {
    await axios.post("http://localhost:4005/events", {
      type: "COMMENT_UPDATED",
      data: {
        id,
        status,
        postId,
        content
      }
    })
  } catch (error) {
    console.log(error)
  }
  }
  res.send({})
})

app.listen(4001, ()=> {
    console.log("listening on 4001")
})
