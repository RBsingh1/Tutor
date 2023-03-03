const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const cors = require("cors");

// Connect Database
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'access-control-allow-origin':'*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
//   }));

const routes = require("./src/routes/routes");
const adminAuth = require("./src/admin/routes/auth");
const adminRoutes = require("./src/admin/routes/admin");
const bannerRoutes = require("./src/admin/routes/banner");
const subjectRoutes = require("./src/admin/routes/subject");
const studentRoutes = require("./src/admin/routes/student");
const router = require("./src/users/user");
//  const tutor = require('./src/users/login')

/*  app.listen(3000,()=>{
    console.log(`Welcome Admin, Server Started at ${3000}`)
})*/
app.get("/", (req, res)=>{
  res.send("Welcome tutot admin");
});
exports.app = functions.https.onRequest(app);
//  app.use("/", tutor);
app.use("/api", router);
app.use("/api", routes);
app.use("/admin", adminAuth);
app.use("/admin", adminRoutes);
app.use("/admin", bannerRoutes);
app.use("/admin", subjectRoutes);
app.use("/admin", studentRoutes);
