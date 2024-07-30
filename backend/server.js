const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config({path:__dirname+"/.env"});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully.")
})

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js")
const commentsRouter = require("./routes/comments.js")
const repliesRouter = require("./routes/replies.js")

app.use('/', authRouter)
app.use('/profile', profileRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
app.use('/replies', repliesRouter)

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
})