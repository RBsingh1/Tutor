require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
var bodyParser = require('body-parser');
var compression = require('compression')



const cors = require('cors')

// Connect Database
connectDB();

const app = express();
app.use(compression({
    level:8
}))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

app.use("/uploads",express.static('uploads'))  //Images path for student_update Api in user.js file

app.use("/Images/topicdocument",express.static('Images/topicdocument'))
app.use("/Images/topicVideos",express.static('Images/topicVideos'))
app.use("/Images/bannerImage",express.static('Images/bannerImage'))
app.use("/Images/samplefile",express.static('Images/samplefile'))

// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'access-control-allow-origin':'*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
//   }));

//admin
const routes = require('./src/routes/routes');
const adminAuth = require('./src/admin/routes/auth');
const adminRoutes = require('./src/admin/routes/admin');
const bannerRoutes = require('./src/admin/routes/banner');
const subjectRoutes = require('./src/admin/routes/subject');
const studentRoutes = require('./src/admin/routes/student');
const quizRoutes = require("./src/admin/routes/quiz")
const questionRouter = require("./src/admin/routes/questionSet")
const batchRouter = require("./src/admin/routes/batches")
const topicRouter = require("./src/admin/routes/topic")
const sampleRouter = require("./src/admin/routes/samplePaper")
const dashBoard = require("./src/admin/routes/dashboard")
const paymentRouter = require("./src/admin/routes/payment")
const notificationRouter = require("./src/admin/routes/notification")
const noticeRouter = require("./src/admin/routes/noticeBoard")
const chatRouter = require("./src/admin/routes/chat")
const contactRouter = require("./src/admin/routes/contactus")
const ZoomRouter = require("./src/admin/routes/Zoom_meeting")


//users
const watchRouter = require("./src/users/watchlatest")
const router = require('./src/users/user');
const userchat = require('./src/users/chat');


app.listen(3000,()=>{
    console.log(`Welcome Admin, Server Started at ${3000}`)
})

//app.use("/",tutor)
app.use("/api",router)
app.use("/api",routes)
app.use("/api",watchRouter)
app.use("/api",userchat)
app.use("/admin",adminAuth)
app.use("/admin",adminRoutes)
app.use("/admin",bannerRoutes)
app.use("/admin",subjectRoutes)
app.use("/admin",studentRoutes)
app.use("/admin",quizRoutes)
app.use("/admin",questionRouter)
app.use("/admin",batchRouter)
app.use("/admin",topicRouter)
app.use("/admin",sampleRouter)
app.use("/admin",dashBoard)
app.use("/admin",paymentRouter)
app.use("/admin",notificationRouter)
app.use("/admin",noticeRouter)
app.use("/admin",chatRouter)
app.use("/admin",contactRouter)
app.use("/admin",ZoomRouter)
