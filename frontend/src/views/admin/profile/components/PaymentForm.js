import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  Select,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios, * as others from 'axios';

const PaymentForm = () => {


  let initialData = {
    customerId:-1,
    remark: "", // Add the remark field
    paymentDate: "",
    amount:""
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });



async function addPayment(Payment) {
  try {
      const response = await axios.post('http://localhost:5000/api/addPayment',Payment);
      console.log('Order added successfully:', response.data);
      setAlert({ message: "Payment added successfully! Redirecting to home...", type: "success" }); // Setting success message
      const  timer = setTimeout(() => {setAlert({});handleGoBack();}, 2000); // Clearing alert after
      setIsSubmitting(false);

      
      // setIsSubmitting(false);
  } catch (error) {
    console.error('Error adding Order:', error);
    setAlert({ message: error.message +' '+ error.response.data, type: "error" }); // Setting success message
    const  timer = setTimeout(() => {setAlert({});}, 3000); // Clearing alert after
    setIsSubmitting(false);
  }
}

  const history = useHistory();
  const location = useLocation();
  const { id } = location.state;

  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({
    remark: "", // Add the remark field
    paymentDate: "",
    amount:""
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.details];
    updatedDetails[index][name] = value;
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorsCopy = { ...errors };
    let formValid = true;

    // Form level validation

    if (!String(formData.orderDate).trim()) {
      errorsCopy.paymentDate = "Order date is required";
      formValid = false;
    } else {
      errorsCopy.paymentDate = "";
    }

    // Validate remark field
    if (!formData.remark.trim()) {
      errorsCopy.remark = "Remark is required";
      formValid = false;
    } else {
      errorsCopy.remark = "";
    }

    // Validate remark field
    if (!formData.amount.trim()) {
        errorsCopy.amount = "Amoint is required";
        formValid = false;
      } else {
        errorsCopy.amount = "";
      }



    if (formValid) {
      // Handle form submission here
      formData.customerId = id
      const payment = formData
      console.log(formData);
      setFormData({
        remark: "", // Add the remark field
        paymentDate: "",
        amount:""
      });
      setErrors({
        remark: "", // Add the remark field
        paymentDate: "",
        amount:""
      });
      // handleGoBack();
      console.log(formData);
      addPayment(payment)
    }
  };

  const handleGoBack = () => {
    history.push({
      pathname: `/admin/customers/profile/${id}`,
      state: { id: id },
    });
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { productName: "", qty: "", rate: "", gst:""}],
    });
    setErrors({
      ...errors,
      details: [...errors.details, { productName: "", qty: "", rate: "", gst:"" }],
    });
  };

  const handleDeleteDetail = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData({
      ...formData,
      details: updatedDetails,
    });
    const updatedErrors = [...errors.details];
    updatedErrors.splice(index, 1);
    setErrors({
      ...errors,
      details: updatedErrors,
    });
  };

  const calcTotal = (qty, rate, gst)=>{
    let total =  Number(qty)*Number(rate)+Number(gst)
    return total
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" bg="white">
      {/* Back button */}
      <Text
        fontSize={"1.5rem"}
        background={"transparent"}
        cursor={"pointer"}
        _hover={{ color: "blue" }}
        onClick={handleGoBack}
      >
        <ArrowBackIcon />
      </Text>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Bill Details */}
        <Stack spacing="4">
          <Text fontWeight={"semibold"} size="xl" mb="2">
            Payment Details
          </Text>
          <Stack direction="row" spacing="4">
            {/* Bill Number */}
            <FormControl id="amount" flex="1">
              <FormLabel>
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Amount
              </FormLabel>
              <Input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                borderColor={errors.amount ? "red.500" : "gray.400"}
              />
              {errors.amount && <Text textColor={"red"}>{errors.amount}</Text>}
            </FormControl>

            {/* Order Date */}
            <FormControl id="orderDate" flex="1">
              <FormLabel>
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Order Date (YYYY-MM-DD)
              </FormLabel>
              <Input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
                borderColor={errors.paymentDate ? "red.500" : "gray.400"}
              />
              {errors.paymentDate && (
                <Text textColor={"red"}>{errors.paymentDate}</Text>
              )}
            </FormControl>
          </Stack>

          {/* Remark */}
          <FormControl id="remark">
            <FormLabel>
              <Text textColor={"red"} display={"inline"}>
                *
              </Text>{" "}
              Remark
            </FormLabel>
            <Input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
              borderColor={errors.remark ? "red.500" : "gray.400"}
            />
            {errors.remark && <Text textColor={"red"}>{errors.remark}</Text>}
          </FormControl>

         
          <Button
            type="submit"
            colorScheme="blue"
            alignSelf="flex-end"
            borderRadius={3}
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </Stack>
      </form>
      {alert.message && (
        <Alert status={alert.type} mt="4">
          <AlertIcon />
          {alert.message}
        </Alert>
      )}
    </Box>
  );
};

export default PaymentForm;
