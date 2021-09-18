const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios").default

const app = express()

app.use(bodyParser.json())


app.post("/events", async (req, res) => {
    const {type, data} =  req.body
    console.log(data)
    if(type === "COMMENT_CREATED"){
        const status = data.content.includes("orange") ? "rejected" : "approved"
        try {
             await axios.post("http://localhost:4005/events", {
                 type: "COMMENT_MODERATED",
                 data: {
                     id: data.id,
                     postId: data.postId,
                     status,
                     content: data.content
                 }
             })
        } catch (error) {
            console.log(error)
        }
    }

    res.send({})
})

app.listen(4003, () => {
    console.log("Listening on 4003")
})
