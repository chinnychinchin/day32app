//Load required libraries
const express = require('express');
const expressWS = require('express-ws')
const morgan = require('morgan');
const cors = require('cors');

//Configure port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

//Instantiate an instance of express
const app = express();
const appWS = expressWS(app)

//Create a global variable to save all the connected names in
const ROOM = {}

//Make message
const mkMsg = (payload, name) => {

    return JSON.stringify({
        message: payload,
        from: name,
        timestamp: (new Date()).toString()
    })

}

//Congifure app 
app.use(morgan('combined'));
app.use(cors());

app.ws('/chat', (ws, req) => {

    const name = req.query.name
    console.log(`New websocket connection made by ${name}`);
    //console.log(req)
    ws.participant = name
    ROOM[name] = ws //making a new key in the room object with a name = req.query.name and value = ws (the endpoint of the connected client)
    for (let participant in ROOM){
        ROOM[participant].send(mkMsg(`Welcome ${name}`))
    }

    ws.on('message', (payload)=>{
        const message = mkMsg(payload,name)
        //Because the argument in .send(arg) has to be a string
        for (let participant in ROOM){
            ROOM[participant].send(message)
        }
    })

    //setup
    ws.on('close', () => {
        console.info(`Chatroom closed for ${name}`)
        ROOM[name].close();
        delete ROOM[name] //deletes the attribute from the object

    })

})

//Start app
app.listen(PORT, () => {console.log(`Chatroom started on port ${PORT} at ${new Date()}`)})