require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http  = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const dbUrl = process.env.databaseUri;
// this is for serving static file in our node application
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


const Message = mongoose.model('Message',{
   name: String,
   message: String
})


// route

const messages =
    [
        {
            "name": "Logan Ellis",
            "message": "Sunt laborum non qui cillum pariatur. Nisi et magna et cupidatat et ex voluptate consectetur sint nulla cupidatat amet fugiat tempor. Nostrud dolor magna reprehenderit amet proident enim labore cillum deserunt. Fugiat ipsum culpa et non anim cupidatat. Fugiat esse excepteur quis irure aliquip est exercitation in duis et voluptate eiusmod.\r\n"
        },
        {
            "name": "Lea Lyons",
            "message": "Aliqua velit aliquip ad exercitation adipisicing laborum in nulla esse ex magna ea aliqua. Irure enim duis sit reprehenderit aliqua culpa aliqua deserunt officia reprehenderit labore. Nulla laborum aliqua incididunt nisi eiusmod duis sint non velit ad mollit. Ipsum fugiat deserunt non est commodo id reprehenderit anim enim nulla aute qui pariatur. Minim anim velit consectetur cupidatat laboris nulla qui enim sit sint consectetur dolore.\r\n"
        }
    ]
app.get('/messages',(req,res)=>{
    Message.find()
        .then(data=>{
            //console.log(data);
            res.send({
                messages:data
            })

        })
        .catch(err=> {
            console.log(err)
            res.sendStatus(500)
        })
})

app.post('/messages',(req,res)=>{
    if(!req.body.name && !req.body.message){
        return res.sendStatus(201)
    }
    const message = new Message({
        name:req.body.name,
        message:req.body.message
    });
    message
        .save()
        .then(data=>{
            //console.log(data)
            messages.push(req.body);
            io.emit('message',req.body);
            res.sendStatus(200)
        })
        .catch(err=> {
            console.log(err);
            res.sendStatus(500)
        })

})

io.on('connection',(socket)=> {
   console.log(`user Connected`);
});

/*
mongoose.connect(dbUrl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    () => {
        console.log("mongdb is connected");
    })
const server = http.listen(3000,()=>{
    console.log("Server is listening on port ",server.address().port);
})*/

mongoose
    .connect(dbUrl)
    .then(result => {
        http.listen(process.env.PORT || 5000);
        console.log('DB is Connected')
    })
    .catch(err => {
        console.log(err);
    });
