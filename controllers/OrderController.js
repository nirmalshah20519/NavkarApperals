const db = require("../models/index");
const convertToIndianWords = require("../Services/Number");

const number = require("../Services/Number");

const Product = db.Product;
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const Transaction = db.Transaction;
const Shipping = db.Shipping;
const Customer = db.Customer;
const ShippingPreference = db.ShippingPreferences;

const fs = require("fs");
const path = require("path");
const request = require("request");

const aws = require("../Services/AWS");

// ------------------------------------------------------------- Product ------------------------------------------------------------

// POST req for product

const addProduct = async (req, res) => {
  try {
    let info = {
      name: req.body.name,
    };
    // console.log(info);
    const product = await Product.create(info);
    res.status(200).send(product);
  } catch (error) {
    console.error("Error adding product type:", error);
    res.status(500).send("Error adding product type");
  }
};

const updateProduct = async (req, res) => {
  try {
    // Get the product ID from request parameters
    const productId = req.params.id;

    // Fetch the existing product from the database
    const existingProduct = await Product.findByPk(productId);

    // If the product doesn't exist, return a 404 error
    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // Update the product information with the data sent in the request body
    existingProduct.name = req.body.name; // You can add more fields to update as needed

    // Save the updated product to the database
    const updatedProduct = await existingProduct.save();

    // Send the updated product as response
    res.status(200).send(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};

// GET req for product Type

const getAllProductType = async (req, res) => {
  try {
    const allproductType = await Product.findAll({
      attributes: ["id", "name"],
    });
    res.status(200).send(allproductType);
  } catch (error) {
    console.error("Error getting all product types:", error);
    res.status(500).send("Error getting all product types");
  }
};

// DELETE req for Poduct

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    // Find the customer by ID and delete it
    const deletedProduct = await Product.destroy({ where: { id: productId } });
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(500).send("Error deleting Product");
  }
};

//---------------------------------------------------------  Order --------------------------------------------------------------------

// create order
const addOrder = async (req, res) => {
  try {
    const orderInfo = {
      id: req.body.id,
      BillNo: req.body.billNo, // Corrected property name
      orderDate: req.body.orderDate,
      remark: req.body.remark,
      details: req.body.details,
      customerId: req.body.customerId,
    };

    // console.log(orderInfo.customerId);

    let totalAmount = 0;
    for (const detail of orderInfo.details) {
      totalAmount +=
        parseFloat(detail.qty) * parseFloat(detail.rate) +
        parseFloat(detail.gst);
    }

    const order = await Order.create({
      // id: orderInfo.id,
      BillNo: orderInfo.BillNo, // Corrected property name
      orderDate: orderInfo.orderDate,
      TotalAmount: totalAmount,
      remark: orderInfo.remark,
      customerId: orderInfo.customerId,
    });

    await Transaction.create({
      Amount: totalAmount,
      TransactionDate: orderInfo.orderDate,
      orderId: order.id,
      remark: orderInfo.remark,
    });
    // Now add details to OrderDetail table
    for (const detail of orderInfo.details) {
      const product = await Product.findOne({
        where: { id: Number(detail.productName) },
      });
      if (!product) {
        throw new Error(`Product ${detail.productName} not found`);
      }

      await OrderDetail.create({
        quantity: detail.qty,
        rate: detail.rate,
        gst: detail.gst,
        orderid: order.id, // Use the id of the newly created order
        pid: product.id,
      });
    }

    res.status(200).send(order);
  } catch (error) {
    if (
      error.name === "SequelizeUniqueConstraintError" &&
      error.fields &&
      error.fields.BillNo
    ) {
      // BillNo already exists, handle the error gracefully
      res
        .status(400)
        .send(
          `BillNo '${error.fields.BillNo}' already exists. Please use a different BillNo.`
        );
    } else {
      console.error("Error adding order:", error);
      res.status(500).send("Error adding order");
    }
  }
};

// add Payment

const addPayment = async (req, res) => {
  try {
    const orderInfo = {
      paymentDate: req.body.paymentDate,
      remark: req.body.remark,
      customerId: req.body.customerId,
      amount: req.body.amount,
    };

    // console.log(orderInfo);

    const payment = await Transaction.create({
      Amount: req.body.amount,
      TransactionDate: req.body.paymentDate,
      customerId: req.body.customerId,
      remark: req.body.remark,
    });
    // Now add details to OrderDetail table

    res.status(200).send(payment);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).send("Error adding order");
  }
};

// const getCustomerPayments = async (req, res) =>{
//   const custId = req.params.id;

//   res.status(200).send(Transactions);
// }

// Delete order

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id; // Assuming the order ID is passed as a route parameter

    // Find the order by ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      // If order is not found, return 404 Not Found
      return res.status(404).send("Order not found");
    }

    await OrderDetail.destroy({
      where: {
        orderid: orderId,
      },
    });

    // Delete the order
    await order.destroy();

    // Return success response
    res.status(200).send("Order deleted successfully");
  } catch (error) {
    // Handle errors
    console.error("Error deleting order:", error);
    res.status(500).send("Error deleting order");
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transId = req.params.id; // Assuming the order ID is passed as a route parameter

    // Find the order by ID
    const trans = await Transaction.findByPk(transId);

    if (!trans) {
      // If order is not found, return 404 Not Found
      return res.status(404).send("Transaction not found");
    }

    // Delete the order
    await trans.destroy();

    // Return success response
    res.status(200).send("Transaction deleted successfully");
  } catch (error) {
    // Handle errors
    console.error("Error deleting order:", error);
    res.status(500).send("Error deleting order");
  }
};

// get order
const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id; // Assuming the order ID is passed as a route parameter

    // Find the order by ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      // If order is not found, return 404 Not Found
      return res.status(404).send("Order not found");
    }

    // Return the order information
    res.status(200).send(order);
  } catch (error) {
    // Handle errors
    console.error("Error getting order:", error);
    res.status(500).send("Error getting order");
  }
};

// get required data for Transaction Detail
const getTransactionDetail = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const order = await Order.findOne({ where: { id: transactionId } });
    if (!order) {
      return res.status(404).send("Data not found");
    }

    const orderDate = order.orderDate;
    const orderStatus = order.status;
    const transactionDetails = [];

    const transactions = await OrderDetail.findAll({
      where: { orderid: transactionId },
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).send("Transactions not found");
    }

    let grandtotal = 0;

    for (const transaction of transactions) {
      const { quantity, rate, pid, gst } = transaction;
      const product = await Product.findOne({ where: { id: pid } });

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const productName = product.name;
      const productId = product.id;
      const totalAmount = quantity * rate;

      transactionDetails.push({
        id: productId,
        name: productName,
        quantity,
        price: Number(rate),
        gst: Number(gst),
        total: totalAmount,
      });
      grandtotal += totalAmount;
    }

    const responseData = {
      id: transactionId,
      date: orderDate,
      status: orderStatus,
      items: transactionDetails ?? [],
      total: grandtotal,
    };

    if (order.status === "shipped") {
      const shipId = order.shippingID;
      const shippingInstance = await Shipping.findByPk(shipId);
      responseData.shipId = shipId;
      responseData.logisticName = shippingInstance.LogisticName;
      responseData.shippingDate = shippingInstance.ShippingDate;
      responseData.trackingNo = shippingInstance.TrackingNo;
      // return res.status(200).json(shippingInstance);
    }
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const getReceipt = async (req, res) => {
  const transactionId = Number(req.params.id);

  const order = await Order.findOne({ where: { id: transactionId } });
  // console.log(order);

  const orderdetails = await OrderDetail.findAll({
    where: { orderid: transactionId },
    include: Product,
  });
  // console.log(orderdetails);

  let totalRows = 20; /* fixed number of lines in receipts */
  let taxableAmount = 0;
  let tax = 0;

  let htmlTxt = orderdetails
    .map((item, index) => {
      taxableAmount += parseFloat(item.quantity) * parseFloat(item.rate);
      tax += parseFloat(item.gst);
      return ` <tr>
        <td>${index + 1}</td>
        <td>${item.Product.name}</td>
        <td>620520</td>
        <td>${item.quantity}</td>
        <td>PCS</td>
        <td>${item.rate}</td>
        <td>${item.gst}</td>
        <td>${
          parseFloat(item.quantity) * parseFloat(item.rate) +
          parseFloat(item.gst)
        }</td>
      </tr>`;
    })
    .join("");

  // console.log(htmlTxt);
  const extraRows = `<tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
</tr>`;
  for (let i = 0; i < totalRows - orderdetails.length; i++) {
    htmlTxt += extraRows;
  }
  // console.log(htmlTxt);

  const customerId = order.customerId;

  const customer = await Customer.findOne({ where: { id: customerId } });

  const pref = await ShippingPreference.findOne({
    where: { customerId: customerId },
  });
  console.log();

  const name = customer.firstname + " " + customer.lastname;
  const address = customer.address1 + " " + customer.address2;

  const city = customer.city + "-" + customer.pincode;

  const contact = "+91" + " " + customer.contact;
  const gstin = customer.GSTIN;

  const billNo = order.BillNo;
  const orderDate =
    order.orderDate.getDate() +
    "/" +
    (order.orderDate.getMonth() + 1) +
    "/" +
    order.orderDate.getFullYear();
  // console.log(orderDate);
  // console.log(orderDate);

  const totalInWords = number.convertToIndianWords(taxableAmount + tax);
  // console.log(totalInWords);
  // console.log(totalInWords);

  try {
    // Construct the file path for receipt.html
    const filePath = path.join(__dirname, "..", "Template", "receipt.html");

    // Read the receipt.html file asynchronously
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading receipt file:", err);
        return res.status(500).send("Internal Server Error");
      }

      // console.log(data);
      data = data.replace("##name##", name);
      data = data.replace("##address##", address);
      data = data.replace("##city##", city);
      data = data.replace("##contact##", contact);
      data = data.replace("##gstin##", gstin);

      data = data.replace("##billno##", billNo);
      data = data.replace("##date##", orderDate);
      // data = data.replace("##remarks##", order.remarks);
      data = data.replace(
        "##transport##",
        pref?.dataValues?.LogisticName ?? "N/A"
      );

      data = data.replace(
        "##taxable##",
        number.formatIndianCurrency(parseFloat(taxableAmount.toPrecision(3)))
      );
      data = data.replace(
        "##taxable##",
        number.formatIndianCurrency(parseFloat(taxableAmount.toPrecision(3)))
      );
      data = data.replace(
        "##tax##",
        number.formatIndianCurrency(tax.toPrecision(3))
      );
      data = data.replace("##billWords##", totalInWords);
      data = data.replace(
        "##grand##",
        number.formatIndianCurrency(taxableAmount + tax)
      );
      data = data.replace("##orderdetail##", htmlTxt);
      res.send(data);
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const sendReceipt = async (req, res) => {
  const transactionId = req.params.id;

  const order = await Order.findOne({ where: { id: transactionId } });

  const orderdetails = await OrderDetail.findAll({
    where: { orderid: transactionId },
    include: Product,
  });

  let totalRows = 20; /* fixed number of lines in receipts */
  let taxableAmount = 0;
  let tax = 0;

  let htmlTxt = orderdetails
    .map((item, index) => {
      taxableAmount += parseFloat(item.quantity) * parseFloat(item.rate);
      tax += parseFloat(item.gst);
      return ` <tr>
        <td>${index + 1}</td>
        <td>${item.Product.name}</td>
        <td>620520</td>
        <td>${item.quantity}</td>
        <td>PCS</td>
        <td>₹ ${item.rate}</td>
        <td>₹ ${Number(item.gst).toFixed(2)}</td>
        <td>₹ ${Number(
          parseFloat(item.quantity) * parseFloat(item.rate) +
            parseFloat(item.gst)
        ).toFixed(2)}</td>
      </tr>`;
    })
    .join("");

  // console.log(htmlTxt);
  const extraRows = `<tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
</tr>`;
  for (let i = 0; i < totalRows - orderdetails.length; i++) {
    htmlTxt += extraRows;
  }
  // console.log(htmlTxt);

  const customerId = order.customerId;

  const customer = await Customer.findOne({ where: { id: customerId } });

  const pref = await ShippingPreference.findOne({
    where: { customerId: customerId },
  });
  // console.log();

  const name = customer.firstname + " " + customer.lastname;
  const address = customer.address1 + " " + customer.address2;

  const city = customer.city + "-" + customer.pincode;

  const contact = "+91" + " " + customer.contact;
  const contactWh = "+91" + customer.contact;
  const gstin = customer.GSTIN;

  const billNo = order.BillNo;
  const orderDate =
    order.orderDate.getDate() +
    "/" +
    (order.orderDate.getMonth() + 1) +
    "/" +
    order.orderDate.getFullYear();
  // console.log(orderDate);
  // console.log(orderDate);

  const totalInWords = number.convertToIndianWords(taxableAmount + tax);
  // console.log(totalInWords);
  // console.log(totalInWords);

  try {
    // Construct the file path for receipt.html
    const filePath = path.join(__dirname, "..", "Template", "receipt.html");

    // Read the receipt.html file asynchronously
    fs.readFile(filePath, "utf8", async (err, data) => {
      if (err) {
        console.error("Error reading receipt file:", err);
        return res.status(500).send("Internal Server Error");
      }

      // console.log(data);
      data = data.replace("##name##", name);
      data = data.replace("##address##", address);
      data = data.replace("##city##", city);
      data = data.replace("##contact##", contact);
      data = data.replace("##gstin##", gstin);

      data = data.replace("##billno##", billNo);
      data = data.replace("##date##", orderDate);
      // data = data.replace("##remarks##", order.remarks);
      data = data.replace(
        "##transport##",
        pref?.dataValues?.LogisticName ?? "N/A"
      );

      data = data.replace(
        "##taxable##",
        number.formatIndianCurrency(parseFloat(taxableAmount.toFixed(2)))
      );
      data = data.replace(
        "##taxable##",
        number.formatIndianCurrency(parseFloat(taxableAmount.toFixed(2)))
      );
      data = data.replace(
        "##tax##",
        number.formatIndianCurrency(parseFloat(tax.toFixed(2)))
      );
      data = data.replace("##billWords##", totalInWords);
      data = data.replace(
        "##grand##",
        number.formatIndianCurrency(taxableAmount + tax)
      );
      data = data.replace("##orderdetail##", htmlTxt);

      // converting html code to pdf file

      const date = new Date();
      const dateString = `d${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const timeString = `t${date.getHours().toString().padStart(2, "0")}_${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const baseDir = "F:/ledgers";

      const safeName = name.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize name to be filesystem safe
      const fileName = `${safeName}_${dateString}_${timeString}.pdf`;
      const pdfPath = path.join(baseDir, fileName);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(data);
      await page.pdf({
        path: pdfPath,
        format: "A4",
        margin: {
          top: "15mm", // Top margin
          right: "15mm", // Right margin
          bottom: "15mm", // Bottom margin
          left: "15mm", // Left margin
        },
      });

      await browser.close();

      // upload to bucket and send whatsapp

      const bucketName = "myaws1122";
      const filePath = pdfPath;
      let arr = filePath.split("\\");
      const fileKey = arr[arr.length - 1];
      const publicUrl = await aws.uploadFileToS3(bucketName, fileKey, filePath);

      const message =`Jai Jinendra🙏,\n\nPlease find the invoice PDF file with the bill number *${billNo}* attached.\n\nThank you for choosing us for your purchase! 💼,\n*NAVKAR APPARELS*`;

      aws.sendWhatsapp(message, contactWh, publicUrl).then((r) => {
        // console.log(r);
        if (r.message_status == "Success") {
          res.status(200).send({ message: "Message Sent Successfully" });
        } else {
          res.status(500).send({ message: "Error sending message" });
        }
      });
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const getBillNo = async (req, res) => {
  const maxIdResult = await Order.max("id");
  let primaryKey = maxIdResult || 0;

  primaryKey++;
  const formattedPrimaryKey = primaryKey.toString().padStart(4, "0");

  const currentYear = new Date().getFullYear();

  const billNo = `NA/${currentYear}/${formattedPrimaryKey}`;

  res.status(200).send({ billNo });
};

//--------------------------------------------------------Shipping Order --------------------------------------------------------------

// post

const addShipping = async (req, res) => {
  try {
    let info = {
      LogisticName: req.body.logisticName, // Corrected property name
      ShippingDate: req.body.shippingDate, // Corrected property name
      TrackingNo: req.body.trackingNo, // Corrected property name
    };
    let tid = req.body.tid;
    const shipping = await Shipping.create(info);
    let sid = shipping.id;

    // Find the order instance by primary key (tid)
    const order = await Order.findByPk(tid);

    // Update the order's shippingId field to sid
    await order.update({ shippingID: sid, status: "shipped" });

    await order.save();

    // Send response with the created shipping record
    res.status(200).send({ order, shipping });
  } catch (error) {
    console.error("Error adding shipping type:", error);
    res.status(500).send("Error adding shipping type");
  }
};

const deleteShipping = async (req, res) => {
  try {
    let tid = req.params.tid;

    // Find the order instance by primary key (tid)
    const order = await Order.findByPk(tid);

    const sid = order.shippingID;

    await Shipping.destroy({ where: { id: sid } });

    // Update the order's shippingId field to sid
    await order.update({ shippingID: null, status: "created" });

    await order.save();

    // Send response with the created shipping record
    res.status(200).send({ message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error adding shipping type:", error);
    res.status(500).send({ message: "Error adding shipping type" });
  }
};

const getLedger = async (req, res) => {
  try {
    custID = req.params.id;
    const orderList = await Order.findAll({
      where: { customerId: custID },
      attributes: ["id"],
    });
    const orderIds = orderList.map((order) => order.id);
    const trasactionCustList = await Transaction.findAll({
      where: { customerId: custID },
    });

    const mappedTransactions1 = trasactionCustList.map((transaction) => ({
      id: transaction.id,
      remark: transaction.remark,
      date: transaction.TransactionDate,
      credit:
        parseFloat(transaction.Amount) > 0
          ? parseFloat(transaction.Amount)
          : null,
      debit:
        parseFloat(transaction.Amount) <= 0
          ? parseFloat(transaction.Amount) * -1
          : null,
    }));

    const transactionOrderList = await Transaction.findAll({
      where: { orderId: orderIds },
    });

    const mappedTransactions2 = transactionOrderList.map((transaction) => ({
      id: transaction.id,
      remark: transaction.remark,
      date: transaction.TransactionDate,
      credit:
        parseFloat(transaction.Amount) <= 0
          ? parseFloat(transaction.Amount) * -1
          : null,
      debit:
        parseFloat(transaction.Amount) > 0
          ? parseFloat(transaction.Amount)
          : null,
    }));

    const resp = [...mappedTransactions1, ...mappedTransactions2];
    debugger;    

    //resp.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).send([]);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).send("Error retrieving customer");
  }
};

const puppeteer = require("puppeteer");

const printLedger = async (req, res) => {
  const custId = req.params.id;

  const orderList = await Order.findAll({
    where: { customerId: custId },
    attributes: ["id"],
  });
  const orderIds = orderList.map((order) => order.id);

  const trasactionCustList = await Transaction.findAll({
    where: { customerId: custId },
  });

  const mappedTransactions1 = trasactionCustList.map((transaction) => ({
    id: transaction.id,
    remark: transaction.remark,
    date: transaction.TransactionDate,
    credit:
      parseFloat(transaction.Amount) > 0
        ? parseFloat(transaction.Amount)
        : null,
    debit:
      parseFloat(transaction.Amount) <= 0
        ? parseFloat(transaction.Amount) * -1
        : null,
  }));

  const transactionOrderList = await Transaction.findAll({
    where: { orderId: orderIds },
  });

  const mappedTransactions2 = transactionOrderList.map((transaction) => ({
    id: transaction.id,
    remark: transaction.remark,
    date: transaction.TransactionDate,
    credit:
      parseFloat(transaction.Amount) <= 0
        ? parseFloat(transaction.Amount) * -1
        : null,
    debit:
      parseFloat(transaction.Amount) > 0
        ? parseFloat(transaction.Amount)
        : null,
  }));

  const resp = [...mappedTransactions1, ...mappedTransactions2];

  //resp.sort((a, b) => b.date - a.date);

  let credit = 0;
  let debit = 0;

  mappedTransactions1.forEach((t) => {
    if (t.credit) credit += t.credit;
  });

  mappedTransactions2.forEach((t) => {
    if (t.debit) debit += t.debit;
  });

  const net = (credit - debit).toFixed(2);

  credit = credit.toFixed(2);
  debit = debit.toFixed(2);

  let htmlTxt = resp
    .map((item, index) => {
      return ` <tr>
        <td>${index + 1}</td>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td>${item.remark}</td>
        <td class="text-success">${number.formatIndianCurrency(
          item.credit
        )}</td>
        <td class="text-danger">${number.formatIndianCurrency(item.debit)}</td>
      </tr>`;
    })
    .join("");

  const customer = await Customer.findOne({ where: { id: custId } });
  const name = customer.firstname + " " + customer.lastname;
  const address = customer.address1 + " " + customer.address2;
  const city = customer.city + "-" + customer.pincode;
  const contact = "+91" + " " + customer.contact;
  const gstin = customer.GSTIN;

  try {
    const filePath = path.join(__dirname, "..", "Template", "ledger.html");
    const template = await fs.promises.readFile(filePath, "utf8");
    let data = template
      .replace("##name##", name)
      .replace("##address##", address)
      .replace("##city##", city)
      .replace("##contact##", contact)
      .replace("##gstin##", gstin)
      .replace("##credit##", number.formatIndianCurrency(credit))
      .replace("##debit##", number.formatIndianCurrency(debit))
      .replace("##colorclass##", net > 0 ? "text-success" : "text-danger")
      .replace("##net##", number.formatIndianCurrency(net))
      .replace("##ledgerdetail##", htmlTxt);

    // Format date and time for the file name
    // const date = new Date();
    // const dateString = `d${date.getFullYear()}-${(date.getMonth() + 1)
    //   .toString()
    //   .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    // const timeString = `t${date.getHours().toString().padStart(2, "0")}_${date
    //   .getMinutes()
    //   .toString()
    //   .padStart(2, "0")}`;

    // const baseDir = "D:/Projects/NvkrPdfs";

    // const safeName = name.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize name to be filesystem safe
    // const fileName = `${safeName}_${dateString}_${timeString}.pdf`;
    // const pdfPath = path.join(baseDir, fileName);

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(data);
    // // await page.goto(data, {waitUntil: 'networkidle0'});
    // await page.pdf({
    //   path: pdfPath,
    //   format: "A4",
    //   printBackground: true,
    //   margin: {
    //     top: "15mm",
    //     right: "15mm",
    //     bottom: "15mm",
    //     left: "15mm",
    //   },
    // });

    //await browser.close();
    // Optionally send the PDF file directly to the client:
    res.status(200).send(data);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

const sendLedger = async (req, res) => {
  const custId = req.params.id;

  const orderList = await Order.findAll({
    where: { customerId: custId },
    attributes: ["id"],
  });
  const orderIds = orderList.map((order) => order.id);

  const trasactionCustList = await Transaction.findAll({
    where: { customerId: custId },
  });

  const mappedTransactions1 = trasactionCustList.map((transaction) => ({
    id: transaction.id,
    remark: transaction.remark,
    date: transaction.TransactionDate,
    credit:
      parseFloat(transaction.Amount) > 0
        ? parseFloat(transaction.Amount)
        : null,
    debit:
      parseFloat(transaction.Amount) <= 0
        ? parseFloat(transaction.Amount) * -1
        : null,
  }));

  const transactionOrderList = await Transaction.findAll({
    where: { orderId: orderIds },
  });

  const mappedTransactions2 = transactionOrderList.map((transaction) => ({
    id: transaction.id,
    remark: transaction.remark,
    date: transaction.TransactionDate,
    credit:
      parseFloat(transaction.Amount) <= 0
        ? parseFloat(transaction.Amount) * -1
        : null,
    debit:
      parseFloat(transaction.Amount) > 0
        ? parseFloat(transaction.Amount)
        : null,
  }));

  const resp = [...mappedTransactions1, ...mappedTransactions2];

  //resp.sort((a, b) => b.date - a.date);

  let credit = 0;
  let debit = 0;

  mappedTransactions1.forEach((t) => {
    if (t.credit) credit += t.credit;
  });

  mappedTransactions2.forEach((t) => {
    if (t.debit) debit += t.debit;
  });

  const net = (credit - debit).toFixed(2);

  credit = credit.toFixed(2);
  debit = debit.toFixed(2);

  let htmlTxt = resp
    .map((item, index) => {
      return ` <tr>
        <td>${index + 1}</td>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td>${item.remark}</td>
        <td class="text-success">${number.formatIndianCurrency(
          item.credit
        )}</td>
        <td class="text-danger">${number.formatIndianCurrency(item.debit)}</td>
      </tr>`;
    })
    .join("");

  const customer = await Customer.findOne({ where: { id: custId } });
  const name = customer.firstname + " " + customer.lastname;
  const address = customer.address1 + " " + customer.address2;
  const city = customer.city + "-" + customer.pincode;
  const contact = "+91" + " " + customer.contact;
  const contactWh = "+91" +customer.contact;
  const gstin = customer.GSTIN;

  try {
    const filePath = path.join(__dirname, "..", "Template", "ledger.html");
    const template = await fs.promises.readFile(filePath, "utf8");
    let data = template
      .replace("##name##", name)
      .replace("##address##", address)
      .replace("##city##", city)
      .replace("##contact##", contact)
      .replace("##gstin##", gstin)
      .replace("##credit##", number.formatIndianCurrency(credit))
      .replace("##debit##", number.formatIndianCurrency(debit))
      .replace("##colorclass##", net > 0 ? "text-success" : "text-danger")
      .replace("##net##", number.formatIndianCurrency(net))
      .replace("##ledgerdetail##", htmlTxt);

    // Format date and time for the file name
    const date = new Date();
    const dateString = `d${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    // const timeString = `t${date.getHours().toString().padStart(2, "0")}_${date
    //   .getMinutes()
    //   .toString()
    //   .padStart(2, "0")}`;

    const baseDir = "F:/ledgers";

    const safeName = name.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize name to be filesystem safe
    const fileName = `${safeName}_${dateString}.pdf`;
    const pdfPath = path.join(baseDir, fileName);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(data);
    // await page.goto(data, {waitUntil: 'networkidle0'});
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    await browser.close();
    // Optionally send the PDF file directly to the client:

    const bucketName = "myaws1122";
      const fp = pdfPath;
      let arr = fp.split("\\");
      const fileKey = arr[arr.length - 1];
      const publicUrl = await aws.uploadFileToS3(bucketName, fileKey, fp);

      const message =`Jai Jinendra🙏,\n\nPlease find the Ledger file attached.\n\nThank you for choosing us for your purchase! 💼,\n*NAVKAR APPARELS*`;

      aws.sendWhatsapp(message, contactWh, publicUrl).then((r) => {
        // console.log(r);
        if (r.message_status == "Success") {
          res.status(200).send({ message: "Message Sent Successfully" });
        } else {
          res.status(500).send({ message: "Error sending message" });
        }
      });

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

const sendShipping = async (req, res) => {
  let tid = req.params.tid;

  // Find the order instance by primary key (tid)
  const order = await Order.findByPk(tid);

  const sid = order.shippingID;
  const cid = order.customerId;

  const customer = await Customer.findByPk(cid);

  const mobileNo = customer.contact;

  const shipping = await Shipping.findByPk(sid);

  const logName = shipping.LogisticName;
  const shipDate = shipping.ShippingDate;
  const TrackingNo = shipping.TrackingNo;

  const message = `Jai Jinendra!🙏\nyour order has been shipped!\n
🚚 Logistic Name: *${logName}*\n
📅 Shipping Date: *${new Date(shipDate).toDateString()}*\n
🔍 Tracking Number: *${TrackingNo}*\n
Kindly Contact me for any help. ( +917046094496 ). \n*NAVKAR APPARELS* 🎉`;

  aws.sendWhatsapp(message, '+91'+mobileNo, "").then((r) => {
    console.log(r);
    if (r.message_status == "Success") {
      res.status(200).send({ message: "Message Sent Successfully" });
    } else {
      res.status(500).send({ message: "Error sending message" });
    }
  });
};

const send2 = async (req, res) => {
  const bucketName = "myaws1122";
  const filePath = "./pdfs/Samarth_Patel_d2024-05-10_t12_33.pdf";
  let arr = filePath.split("/");
  const fileKey = arr[arr.length - 1];

  const publicUrl = await aws.uploadFileToS3(bucketName, fileKey, filePath);

  const options = {
    method: "POST",
    url: "https://whats-api.rcsoft.in/api/create-message",
    headers: {},
    formData: {
      appkey: "e5b99411-7abc-4933-840a-c9aeba91b303",
      authkey: "1v3xzHSGqoNQYyG1uxDi7OmIwLPzBVRp6DSRva4jlyRwaU8UrN",
      to: req.body.receiverNumber, // Assuming receiver number is sent in the request body
      message: req.body.message, // Assuming message is sent in the request body
      file: publicUrl,
    },
  };

  request(options, function (error, response) {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log(response.body);
      res.status(response.statusCode).send(response.body);
    }
  });
};

//--------------------------------------------------------- export --------------------------------------------------------------------
module.exports = {
  addProduct,
  getAllProductType,
  deleteProduct,
  addOrder,
  deleteOrder,
  getOrder,
  getTransactionDetail,
  addShipping,
  updateProduct,
  getReceipt,
  sendReceipt,
  getBillNo,
  deleteShipping,
  addPayment,
  deleteTransaction,
  getLedger,
  sendLedger,
  printLedger,
  send2,
  sendShipping,
};
