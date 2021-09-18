const express = require("express")
const {json} = require("body-parser")
const axios = require("axios").default

const app = express()

app.use(json())
const events = []

app.post("/events", (req,  res) => {
    const event = req.body
    events.push(event)
    try {
        axios.post('http://localhost:4000/events', event)
        axios.post('http://localhost:4001/events', event)
        axios.post('http://localhost:4002/events', event)
        axios.post('http://localhost:4003/events', event)
    } catch (error) {
        console.log(error)
    }
    res.send({ status: "Ok"})
})

app.get("/events", (req, res) => {
    res.send(events)
})

app.listen(4005, () => {
    console.log('Listening on post 4005')
})
