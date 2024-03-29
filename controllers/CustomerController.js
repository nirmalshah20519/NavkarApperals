const { where } = require("sequelize");
const db = require("../models/index");

const CustomerType = db.CustomerType;
const Customer =  db.Customer;
const Order = db.Order;
const Transaction = db.Transaction;
const ShippingPreference = db.ShippingPreferences;
// --------------------------------------------------------customer types--------------------------------------------------------- 

// POST req for customer Type
const addCustomerType = async (req, res) => {
  try {
    let info = {
      name: req.body.name,
    };
    
    const customerType = await CustomerType.create(info);
    res.status(200).send(customerType);
  } catch (error) {
    console.error("Error adding customer type:", error);
    res.status(500).send("Error adding customer type");
  }
};

// GET req for customer Type
const getAllCustomerType = async (req, res) => {
  try {
    const allCustomerType = await CustomerType.findAll({
      attributes: ['id', 'name']
    });
    res.status(200).send(allCustomerType);
  } catch (error) {
    console.error("Error getting all customer types:", error);
    res.status(500).send("Error getting all customer types");
  }
};

const getPreference = async (req, res) => {
  

  try {
    const id = req.params.id;
    const pref = await ShippingPreference.findOne({where:{customerId:id}, attributes:['id','LogisticName']});
    res.status(200).send(pref);
  } catch (error) {
    console.error("Error getting all customer types:", error);
    res.status(500).send("Error getting all customer types");
  }
}

//------------------------------------------------------------ Customers----------------------------------------------------------

// POST all the customers 
const addCustomer = async (req, res) => {
  try {
    let info = {
      id : req.body.id,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      gender : req.body.gender,
      email : req.body.email,
      contact : req.body.contact,
      address1 : req.body.address1,
      address2 : req.body.address2,
      city : req.body.city,
      pincode : req.body.pincode,
      state : req.body.state,
      GSTIN : req.body.GSTIN,
      status : true,
      typeid : 1,
    };
    let logisticName = req.body.logisticName;

    // Check if logisticName is provided
    if (!logisticName) {
      return res.status(400).send("LogisticName is required");
    }

    const customer = await Customer.create(info);

    let shipPref = {
      LogisticName: logisticName,
      customerId: customer.id
    }
    const pref = await ShippingPreference.create(shipPref);

    res.status(200).send(customer);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).send("Error adding customer");
  }
};

const getCustomer = async (req, res) => {
  try {
    let custId = req.params.id;
    const customer = await Customer.findByPk(custId)
    
    const ship = await ShippingPreference.findOne({where : {customerId:custId}});
    const logisticName = ship?.LogisticName || ''
    const response = {...customer.dataValues, logisticName}
    res.status(200).send(response);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).send("Error adding customer");
  }
};

const updateCustomer = async (req, res) => {
  try {
    let custId = req.params.id;
    const customer = await Customer.findByPk(custId);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    
    let info = {
      id: req.body.id || customer.id,
      firstname: req.body.firstname || customer.firstname,
      lastname: req.body.lastname || customer.lastname,
      gender: req.body.gender || customer.gender,
      email: req.body.email || '',
      contact: req.body.contact || customer.contact,
      address1: req.body.address1 || customer.address1,
      address2: req.body.address2 || customer.address2,
      city: req.body.city || customer.city,
      pincode: req.body.pincode || customer.pincode,
      state: req.body.state || customer.state,
      GSTIN: req.body.GSTIN || '',
      status: true,
      typeid: 1,
    };
    let logisticName = req.body.logisticName;
    
    // Update customer information
    await customer.update(info);
    
    if (logisticName) {
      // Update shipping preference if logisticName is provided
      const ship = await ShippingPreference.findOne({ where: { customerId: custId } });
      if (!ship) {
        // return res.status(404).send("Shipping preference not found");
        let shipPref = {
          LogisticName: logisticName,
          customerId: customer.id
        }
        const pref = await ShippingPreference.create(shipPref);
      }else{
        await ship.update({ LogisticName: logisticName });
      }
    }
    
    res.status(200).send(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).send("Error updating customer");
  }
};

  

const getRequiredDataCustomers = async (req, res) => {
  try {
    // Fetch all customers
    const customers = await Customer.findAll({
      where: {
        status: true
      }
    });

    // // Check if any customers found
    // if (!customers || customers.length === 0) {
    //   return res.status(404).send("No customers found");
    // }

    // Map through each customer and extract required data
    const selectedData = customers.map(customer => {
      // Concatenate firstname and lastname into one field named "name"
      const name = `${customer.firstname} ${customer.lastname}`;

      // Extract only required fields from the customer object
      const { id, email, contact } = customer;

      // Create a new object containing only required fields
      return { id, name, email, mobile:contact, status:500 };
    });

    selectedData.sort((a, b) => a.id - b.id);
    res.status(200).send(selectedData);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).send("Error fetching customers");
  }
};

const getRequiredDataCustomersById = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Find the customer by ID
    const customer = await Customer.findOne({ where: { id: customerId } });
    
    // If customer not found, return 404 Not Found
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    
    const custTypes = await CustomerType.findAll();
    const cust = custTypes.find(c => c.id === customer.typeid)?.name;

    // Find specific fields of transactions associated with the customer
    const transactions = await Order.findAll({
      where: { customerId: customerId },
      attributes: ['id', 'BillNo', 'orderDate', 'TotalAmount', 'remark'],
      order: [['orderDate', 'DESC']]
    });

    const payments = await  Transaction.findAll({where:{customerId :customerId}, attributes: ['id', 'remark', 'Amount','TransactionDate'], order: [['TransactionDate', 'DESC']]});

    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      datetime: transaction.orderDate.toISOString(), // Assuming orderDate is a Date object
      remark: transaction.remark,
      amount: transaction.TotalAmount,
      billNo: transaction.BillNo
    }));

    // Construct full name
    const name = `${customer.firstname} ${customer.lastname}`;
    const address = `${customer.address1 || ''} ${customer.address2 || ''} ${customer.city || ''} ${customer.pincode || ''} ${customer.state || ''}`;
    const mobile = customer.contact;

    // Extract required values from the customer object
    const { id, email, GSTIN } = customer;

    // getting ledger

    const orderList = await Order.findAll({
      where: { customerId: customerId },
      attributes: ["id"],
    });
    const orderIds = orderList.map((order) => order.id);
    const trasactionCustList = await Transaction.findAll({
      where: { customerId: customerId },
    });

    const mappedTransactions1 = trasactionCustList.map(transaction => ({
      id: transaction.id,
      remark: transaction.remark,
      date: transaction.TransactionDate,
      credit: parseFloat(transaction.Amount) > 0 ? parseFloat(transaction.Amount) : null,
      debit: parseFloat(transaction.Amount) <= 0 ? parseFloat(transaction.Amount) * -1 : null
  }));

    const transactionOrderList = await Transaction.findAll({
      where: { orderId: orderIds },
    });

    const mappedTransactions2 = transactionOrderList.map(transaction => ({
      id: transaction.id,
      remark: transaction.remark,
      date: transaction.TransactionDate,
      credit: parseFloat(transaction.Amount) <= 0 ? parseFloat(transaction.Amount) * -1 : null,
      debit: parseFloat(transaction.Amount) > 0 ? parseFloat(transaction.Amount) : null,
  }));

    const resp = [...mappedTransactions1, ...mappedTransactions2]
    
    // Ensure all values are defined before sending in the response
    const responseData = {
      id,
      name,
      email,
      mobile,
      type: cust,
      address,
      GSTIN,
      transactions:transformedTransactions,
      payments:payments,
      ledger:resp
    };

    // Return the required values in the response
    res.json(responseData);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).send("Error retrieving customer");
  }
};





// Delete Customer 
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Update the status column to false
    const updatedRows = await Customer.update(
      { status: false },
      { where: { id: customerId } }
    );
    
    // Check if any rows were updated
    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.status(200).json({ message: "Customer status updated successfully" });
  } catch (error) {
    console.error("Error updating customer status:", error);
    res.status(500).json({ message: "Error updating customer status" });
  }
};



module.exports = {
  addCustomerType,
  getAllCustomerType,
  addCustomer,
  getCustomer,
  updateCustomer,
  getRequiredDataCustomers,
  deleteCustomer,
  getRequiredDataCustomersById,
  getPreference
};
  