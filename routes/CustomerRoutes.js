const CustomerController = require("../controllers/CustomerController");

const express = require("express");

const router = express.Router();


// Customer Types routs
router.post("/addCustomerType", CustomerController.addCustomerType);
router.get("/getAllCustomerType", CustomerController.getAllCustomerType);


// Customers Routs 
router.post("/addCustomer", CustomerController.addCustomer);
router.get("/getRequiredDataCustomers", CustomerController.getRequiredDataCustomers); // requird customer data only 
router.delete("/deleteCustomer/:id", CustomerController.deleteCustomer); // requird customer data only 
router.get("/getRequiredDataCustomersById/:id", CustomerController.getRequiredDataCustomersById); // requird customer data only 


// Order Routs

module.exports = router;
