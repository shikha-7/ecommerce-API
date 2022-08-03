require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const FileUplaod = require("express-fileupload")

const connectDB = require("./db/connect");
const Authrouter = require("./routes/authRoutes");
const Userrouter = require("./routes/userRoutes");
const Productrouter = require("./routes/productRoutes");
const Reviewrouter = require("./routes/reviewRoutes");
const Orderrouter = require("./routes/orderRoutes");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(FileUplaod({
    useTempFiles: true,
}));
// app.get("/api/v1/static", (req, res) => {
//     console.log(req.cookies);
//     console.log(req.signedCookies);
//     res.send("static route")
// })

app.use("/api/v1/auth", Authrouter);
app.use("/api/v1/user", Userrouter);
app.use("/api/v1/product", Productrouter);
app.use("/api/v1/review", Reviewrouter);
app.use("/api/v1/order", Orderrouter);


const start = async () => {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
        console.log(`server is listing on port no. ${port}`)
    });
}

start();