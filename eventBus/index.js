import express from "express"
import bodyParser  from "body-parser"
import axios from "axios"

const app = express()
app.use(bodyParser.json())
const events = []
app.post(`/events`,async (req,res) => {
    const event = req.body

    events.push(event)

    await axios.post(`http://localhost:4000/events`,event)
    await axios.post(`http://localhost:4001/events`,event)
    await axios.post(`http://localhost:4002/events`,event)
    await axios.post(`http://localhost:4003/events`,event)

    res.send({status: `OK`})
})
app.get(`/events`,(req,res) => {
    res.send(events)
})
app.listen(4005, () => {
    console.log(`Listening to 4005`)
})