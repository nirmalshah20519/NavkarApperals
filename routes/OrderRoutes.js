const OrderController = require("../controllers/OrderController");

const express = require("express");

const router = express.Router();


// Product router
router.post("/addProduct", OrderController.addProduct); 
router.get("/getAllProductType", OrderController.getAllProductType); 
router.delete("/deleteProduct/:id", OrderController.deleteProduct); 
router.patch("/updateProduct/:id", OrderController.updateProduct); 



// Order router

router.post("/addOrder", OrderController.addOrder); 
router.get("/getOrder/:id", OrderController.getOrder); 
router.delete("/deleteOrder/:id", OrderController.deleteOrder); 


// order detail router
router.get("/getTransactionDetail/:id", OrderController.getTransactionDetail); 
router.get("/getReceipt/:id", OrderController.getReceipt); 


// shpping router
router.post("/addShipping", OrderController.addShipping); 
router.delete("/deleteShipping/:tid", OrderController.deleteShipping); 
// router.post("/updateShippingIdInOrder", OrderController.updateShippingIdInOrder); 

module.exports = router;