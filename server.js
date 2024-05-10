const express = require("express");
const cors = require("cors");

const app = express();

var corOptions = {
  origin: "http://localhost:3000",
};

//middleware
app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// routers
const router_customer = require("./routes/CustomerRoutes");
const router_order = require("./routes/OrderRoutes");
app.use("/api", router_customer);
app.use("/api", router_order);

app.get("/", (req, res) => {

});

const PORT = 5000;

app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});
