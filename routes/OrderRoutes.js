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

// Transaction router

router.post("/addPayment", OrderController.addPayment);  
// router.get("/getOrder/:id", OrderController.getOrder); 
router.delete("/deleteTransaction/:id", OrderController.deleteTransaction); 

router.get('/getLedger/:id', OrderController.getLedger)



// order detail router
router.get("/getTransactionDetail/:id", OrderController.getTransactionDetail); 
router.get("/getReceipt/:id", OrderController.getReceipt); 
router.get("/getBillNo", OrderController.getBillNo); 
router.get("/printLedger/:id", OrderController.printLedger); 



// shpping router
router.post("/addShipping", OrderController.addShipping); 
router.delete("/deleteShipping/:tid", OrderController.deleteShipping); 
// router.post("/updateShippingIdInOrder", OrderController.updateShippingIdInOrder); 

module.exports = router;