import express from 'express'
import path from "path";
import mongoose from "mongoose"
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv";
import authMiddleware, { redirectIfLoggedIn } from "./Middleware/authMiddleware.js";
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js'

dotenv.config();



const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/api', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use("/api/user", userRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error(err));


app.use('/', authRoutes)



app.use(express.static(path.join(__dirname, '../client')))


app.get('/', redirectIfLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"))
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/sign-up.html"))
})

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/sign-in.html"))
})

app.get("/profile", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/profile.html"));
});

function mustBeLoggedIn(req, res, next) {
  if (req.user) {
      return next()
  }
   res.sendFile(path.join(__dirname, "../client/sign-in.html"))
}

app.get("/homepage", mustBeLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/homepage.html"))
})


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});