const express = require('express')
const {json} = require("body-parser")
const cors = require("cors")
const axios = require("axios").default
const app = express()
app.use(json())
app.use(cors())

const posts = {}

const handleEvents = (type, data) => {
  if(type === "postCreated"){
    const {id, title} = data
    posts[id] = {id, title, comments: []}
   }

   if(type === "COMMENT_CREATED"){
     const {id, content, postId, status} =  data
     const post = posts[postId]
     post.comments.push({id, content, status})
   }

   if(type === "COMMENT_UPDATED"){
     const {id, content, postId, status} = data
     console.log(data)
     const post = posts[postId]
     const comment = post.comments.find(comment => comment.id === id)
     comment.status = status
     comment.content = content
   }
}

app.get("/posts", (req, res) => {
    res.send(posts)
})

app.post("/events", (req,res) => {
   const {type, data} = req.body

   handleEvents(type, data)
   
   res.send({})
})

app.listen(4002, async ()=>{
  console.log("listening on 4002")
  const {data} = await axios.get("http://localhost:4005/events")
  for(let event of data){
    console.log("Processing event:", event.data);
    handleEvents(event.type, event.data)
  }
})
