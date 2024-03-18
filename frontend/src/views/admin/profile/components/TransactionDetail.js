import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Flex,
  Spacer,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { MdDeleteOutline } from "react-icons/md";
import axios, * as others from "axios";
import { MdPrint } from "react-icons/md";

const TransactionDetail = () => {
  const history = useHistory();
  const location = useLocation();
  // console.log(location.state);
  const pathSegments = window.location.href.split("/");
  const meta = {
    id: pathSegments[pathSegments.length - 3],
    tid: pathSegments[pathSegments.length - 1],
  };
  const { id, tid } = location.state ?? meta;

  const [transactionData, setTransactionData] = useState(null);

  const [save, setSave] = useState(false)

  useEffect(() => {
    getTransaction().then(() => {
      console.log("Order loaded..");
      // console.log(orderStatus);
      // const currentCustomer = customerData.find(customer => customer.id === Number(id))
      // setCustomer(currentCustomer)
      // console.log(customer);
    });
  }, []);

  // Sample transaction data, replace it with actual data from your API or state management
  // const transactionData = {
  //   id: tid,
  //   date: "2024-03-01",
  //   total: 250.0,
  //   items: [
  //     { id: 1, name: "Product 1", quantity: 2, price: 100.0 },
  //     { id: 2, name: "Product 2", quantity: 1, price: 50.0 },
  //     { id: 3, name: "Product 3", quantity: 3, price: 30.0 },
  //   ],
  // };

  async function getTransaction() {
    // const axios = require('axios');
    // setIsSubmitting(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/getTransactionDetail/${tid}`
      );
      // console.log(response.data);
      const d = response.data;
      // console.log(d);
      setTransactionData(d);
      if(d.status==='shipped'){
        setSave(true)
        const date = new Date(d.shippingDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const day = String(date.getDate()).padStart(2, '0');

        // Format the date for input type date
        const formattedDate = `${year}-${month}-${day}`;


        const {logisticName, shippingDate, trackingNo} = d;
        console.log(shippingDate);
        const status = d.status.charAt(0).toUpperCase() + d.status.slice(1);
        setOrderStatus(status)
        setShowForm(true);
        setFormValues({logisticName, shippingDate:formattedDate, trackingNo})
      }
      // setIsSubmitting(false);
    } catch (error) {
      console.error("Error adding customer:", error);
      // setError('Oops! Something went wrong. Please try again later.');
      // setIsSubmitting(false);
    }
  }

  const [orderFormStatus, setOrderFormStatus] = useState("Created");
  const [orderStatus, setOrderStatus] = useState("Created");
  const [showForm, setShowForm] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });

  const [formValues, setFormValues] = useState({
    logisticName: "",
    shippingDate: "",
    trackingNo: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);
    if (e.target.value !== "Created") {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formValues).forEach((field) => {
      if (!formValues[field]) {
        errors[field] = `${field} is required`;
      }

      
      
    });

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      formValues.tid=tid
      saveShipping(formValues).then(()=>{console.log("saved ");setSave(true)})
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    // console.log(id);
    history.push(`/admin/data-tables/profile/${id.id}`, { id: id.id });
  };

  async function getRecept(){
    try {
      const resp = await axios.get('http://localhost:5000/api/getReceipt/4');
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function saveShipping(shipping){
    try {
      const resp = await axios.post(`http://localhost:5000/api/addShipping`,shipping);
      setAlert({ message: "Shipping data saved successfully", type: "success" }); // Setting success message
      const  timer = setTimeout(() => {setAlert({});}, 3000); // Clearing alert after
      console.log(alert);
      // return resp.data;
    } catch (error) {
      console.log(error);
      setAlert({ message: "Something went wrong.", type: "error" }); // Setting success message
      const  timer = setTimeout(() => {setAlert({});}, 3000); // Clearing alert after
    }
  }

  const handlePrint = (id)=>{
    setIsSubmitting(true)
    console.log(id);
    getRecept().then((d)=>{
      // console.log(d);
      const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(d); // Assuming d contains the HTML content you want to print
        printWindow.document.close();
        const time = setTimeout(() => {
          printWindow.print();
          console.log('ppp');
          setIsSubmitting(false)
        }, 50);
        
    })

  }

  return (
    <Box p="4" bg="white" borderRadius="lg">
      <Text
        fontSize="1.5rem"
        background="transparent"
        cursor="pointer"
        _hover={{ color: "blue" }}
        onClick={handleGoBack}
      >
        <ArrowBackIcon />
      </Text>

      {transactionData ? (
        <Stack spacing="4">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="semibold" fontSize="xl">
              Transaction Detail
            </Text>
            <Spacer />
            <IconButton as={MdPrint} boxSize={6} isLoading={isSubmitting} onClick={handlePrint} />
          </Flex>
          <Text>
            <strong>Transaction ID:</strong> {transactionData.id}
          </Text>
          <Text>
            <strong>Date:</strong>{" "}
            {new Date(transactionData.date).toLocaleDateString()}
          </Text>

          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Quantity</Th>
                <Th>Price</Th>
                <Th>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionData.items.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>₹ {item.price.toFixed(2)}</Td>
                  <Td>₹ {item.total.toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Text fontWeight="semibold">
            <strong>Total:</strong> ₹ {transactionData.total.toFixed(2)}
          </Text>

          <Flex justifyContent="flex-start" alignItems={"end"} gap={2}>
            <FormControl width="25%">
              <FormLabel htmlFor="order-status">Order Status</FormLabel>
              <Select
                id="order-status"
                value={orderStatus}
                onChange={handleStatusChange}
              >
                {orderStatus === "Created" && (
                  <option value="Created">Created</option>
                )}
                {/* <option value="Paid">Paid</option> */}
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Select>
            </FormControl>

            {/* <Button ml={2} onClick={handleSaveStatus}>Save Status</Button> */}
          </Flex>

          {showForm && (
            <>
              <Text fontSize="2xl" fontWeight="bold" mt="8" mb="4">
                Shipping Details
              </Text>
              <form onSubmit={handleSubmit}>
                <Flex
                  align="center"
                  justify="space-between"
                  alignItems={"center"}
                  wrap="wrap"
                  gap="20px"
                >
                  <FormControl isInvalid={!!formErrors.logisticName} flex="1">
                    <FormLabel htmlFor="logisticName">Logistic Name</FormLabel>
                    <Input
                      id="logisticName"
                      name="logisticName"
                      value={formValues.logisticName}
                      onChange={handleChange}
                      placeholder="Enter logistic name"
                    />
                    {formErrors.logisticName && (
                      <FormErrorMessage>
                        {formErrors.logisticName}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!formErrors.shippingDate} flex="1">
                    <FormLabel htmlFor="shippingDate">Shipping Date</FormLabel>
                    <Input
                      id="shippingDate"
                      name="shippingDate"
                      type="date"
                      value={formValues.shippingDate}
                      onChange={handleChange}
                      placeholder="Select shipping date"
                    />
                    {formErrors.shippingDate && (
                      <FormErrorMessage>
                        {formErrors.shippingDate}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!formErrors.trackingNo} flex="1">
                    <FormLabel htmlFor="trackingNo">Tracking Number</FormLabel>
                    <Input
                      id="trackingNo"
                      name="trackingNo"
                      value={formValues.trackingNo}
                      onChange={handleChange}
                      placeholder="Enter tracking number"
                    />
                    {formErrors.trackingNo && (
                      <FormErrorMessage>
                        {formErrors.trackingNo}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    mt={4}
                    colorScheme="green"
                    // isLoading={isSubmitting}
                    
                    type="button"
                  >
                    <em className="bi bi-whatsapp"></em>
                  </Button>
                  <Button
                    mt={4}
                    colorScheme="red"
                    // isLoading={isSubmitting}
                    type="button"
                  >
                    <MdDeleteOutline />
                  </Button>
                  <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    type="submit"
                    disabled={save}
                  >
                    Save
                  </Button>
                </Flex>
              </form>
            </>
          )}
        </Stack>
      ) : (
        <Text>Order not found</Text>
      )}
      {alert.message && (
        <Alert status={alert.type} mt="4">
          <AlertIcon />
          {alert.message}
        </Alert>
      )}
    </Box>
  );
};

export default TransactionDetail;
