const db = require("../models/index");

const CustomerType = db.CustomerType;
const Customer =  db.Customer;
const Order = db.Order;
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
    const customer = await Customer.create(info);
    res.status(200).send(customer);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).send("Error adding customer");
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

    // Check if any customers found
    if (!customers || customers.length === 0) {
      return res.status(404).send("No customers found");
    }

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
      attributes: ['id', 'BillNo', 'orderDate', 'TotalAmount', 'remark']
    });

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
    
    // Ensure all values are defined before sending in the response
    const responseData = {
      id,
      name,
      email,
      mobile,
      type: cust,
      address,
      GSTIN,
      transactions:transformedTransactions
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
  getRequiredDataCustomers,
  deleteCustomer,
  getRequiredDataCustomersById,
};
  