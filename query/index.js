import express from "express"
import bodyParser  from "body-parser"
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const handleEvents = (type,data) => {
    if(type === `PostCreated`){
        const { id,title } = data
        posts[id] = { id,title, comments: [] }
    }
    if(type === `CommentCreated`){
        const {id,postId,content,status} = data
        const post = posts[postId]
        post.comments.push({ id,content,status})
    }
    if(type === `CommentUpdated`){
        const {id,postId,content,status} = data
        const post = posts[postId]

        const comment = post.comments.find(p => { return p.id === id})
        comment.status = status
        comment.content = content
    }
}
app.get(`/posts`,(req,res) => {
    res.send(posts)
})

app.post(`/events`,(req,res) => {
    const { type, data } = req.body
    handleEvents(type,data)
    console.log(posts)
    res.send({})
})

app.listen(4002,async() => {
    console.log(`Listeng on 4002`)
    const res = await axios.get(`http://event-bus-srv:4005/events`)
    for(let event of res.data){
        console.log(`Processing Event`,event.type)
        handleEvent(event.type,event.data)
    }
})