import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Grid,
  Heading,
  RadioGroup,
  Radio,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios, * as others from 'axios';
import { useParams } from 'react-router-dom';

import { ArrowBackIcon } from "@chakra-ui/icons";

const CustomerForm = () => {

  const {id} = useParams();
  const [isEdit, setIsEdit] = useState(false)
  useEffect(()=>{
    if(id){
      getCustomer(id)
      setIsEdit(true)
    }
  },[])

  async function getCustomer(id) {

    try {
        const response = await axios.get(`http://localhost:5000/api/getCustomer/${id}`);
        console.log(response.data);
        setFormData(response.data)
        // setAlert({ message: "Form submitted successfully! Redirecting to home ...", type: "success" }); // Setting success message
        // const  timer = setTimeout(() => {setAlert({});handleGoBack();}, 2000); // Clearing alert after
        
    } catch (error) {
        // console.error('Error adding customer:', error);
        // setAlert({ message: error.message, type: "error" }); // Setting success message
        // const  timer = setTimeout(() => {setAlert({});}, 2000); // Clearing alert after
        
    }
}


  async function addCustomer(customerData) {
    // const axios = require('axios');
    setIsSubmitting(true);

    try {
        const response = await axios.post('http://localhost:5000/api/addCustomer', customerData);
        console.log('Customer added successfully:', response.data);
        setAlert({ message: "Form submitted successfully! Redirecting to home ...", type: "success" }); // Setting success message
        const  timer = setTimeout(() => {setAlert({});handleGoBack();}, 2000); // Clearing alert after
        setIsSubmitting(false);
    } catch (error) {
        console.error('Error adding customer:', error);
        setAlert({ message: error.message, type: "error" }); // Setting success message
        const  timer = setTimeout(() => {setAlert({});}, 2000); // Clearing alert after
        setIsSubmitting(false);
    }
}

async function updateCustomer(custData){
  
  // const axios = require('axios');
  setIsSubmitting(true);
  console.log("upd", custData);

  try {
      const response = await axios.post(`http://localhost:5000/api/updateCustomer/${id}`, custData);
      console.log('Customer updated successfully:', response.data);
      setAlert({ message: "Customer updated successfully! Redirecting to home ...", type: "success" }); // Setting success message
      const  timer = setTimeout(() => {setAlert({});handleGoBack();}, 2000); // Clearing alert after
      setIsSubmitting(false);
  } catch (error) {
      console.error('Error adding customer:', error);
      setAlert({ message: error.message, type: "error" }); // Setting success message
      const  timer = setTimeout(() => {setAlert({});}, 2000); // Clearing alert after
      setIsSubmitting(false);
  }
}


  const history = useHistory();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const handleGoBack = () => {
    history.goBack();
  };
  const initialData = {
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    contact: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    state: "",
    GSTIN: "",
  };
  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation rules
    let errorMessage = "";
    switch (name) {
      case "firstname":
        if (value.trim() === "") {
          errorMessage = "First name is required";
        }
        break;
      case "lastname":
        if (value.trim() === "") {
          errorMessage = "Last name is required";
        }
        break;
      case "email":
        if (value.trim() !== "" && !/^\S+@\S+\.\S+$/.test(value)) {
          errorMessage = "Invalid email address";
        }
        break;
      case "contact":
        if (!/^[0-9]{10}$/.test(value)) {
          errorMessage = "Invalid contact number";
        }
        break;
      case "address1":
        if (value.trim() === "") {
          errorMessage = "Address Line 1 is required";
        }
        break;
      case "address2":
        if (value.trim() === "") {
          errorMessage = "Address Line 2 is required";
        }
        break;
      case "city":
        if (value.trim() === "") {
          errorMessage = "City is required";
        }
        break;
      case "pincode":
        if (!/^[0-9]{6}$/.test(value)) {
          errorMessage = "Invalid pincode";
        }
        break;
      case "state":
        if (value.trim() === "") {
          errorMessage = "State is required";
        }
        break;
      default:
        break;
    }

    // Update formData and errors
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleRadioChange = (e) => {
    // console.log(e.target);
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formValid = true;
    const newErrors = {};

    // Validation rules
    Object.keys(formData).forEach((name) => {
      let errorMessage = "";
      const value = String(formData[name]).trim();
      switch (name) {
        case "firstname":
          if (value === "") {
            errorMessage = "First name is required";
            formValid = false;
          }
          break;
        case "lastname":
          if (value === "") {
            errorMessage = "Last name is required";
            formValid = false;
          }
          break;
        case "email":
          if (value !== "" && !/^\S+@\S+\.\S+$/.test(value)) {
            errorMessage = "Invalid email address";
            formValid = false;
          }
          break;
        case "contact":
          if (!/^[0-9]{10}$/.test(value)) {
            errorMessage = "Invalid contact number";
            formValid = false;
          }
          break;
        case "address1":
          if (value === "") {
            errorMessage = "Address Line 1 is required";
            formValid = false;
          }
          break;
        case "address2":
          if (value === "") {
            errorMessage = "Address Line 2 is required";
            formValid = false;
          }
          break;
        case "city":
          if (value === "") {
            errorMessage = "City is required";
            formValid = false;
          }
          break;
        case "pincode":
          if (!/^[0-9]{6}$/.test(value)) {
            errorMessage = "Invalid pincode";
            formValid = false;
          }
          break;
        case "state":
          if (value === "") {
            errorMessage = "State is required";
            formValid = false;
          }
          break;
        default:
          break;
      }

      newErrors[name] = errorMessage;
    });

    // Update errors state
    setErrors(newErrors);

    if (formValid) {
      // Handle form submission here, e.g., send data to backend
      console.log(formData);
      formData.gender="male"
      const custData = formData
      setFormData({...initialData, logisticName:''});
      setErrors({});
      if(isEdit){
        updateCustomer(custData)
      }
      else{
        addCustomer(custData);
      }
      console.log(custData);
      
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" bg="white">
      <Box mb="4">
        <Text
          // leftIcon={}
          // colorScheme="blue"
          fontSize={"1.5rem"}
          background={"transparent"}
          cursor={"pointer"}
          _hover={{ color: "blue" }}
          // variant="solid"
          onClick={handleGoBack}
        >
          <ArrowBackIcon />
        </Text>
        <Heading as="h2" size="lg" mb="2">
        {isEdit?'Update Customer':'Add New Customer'}

        </Heading>
      </Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          <Grid templateColumns="repeat(3, 1fr)" gap="8">
            <FormControl id="firstname">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                First Name
              </FormLabel>
              <Input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                borderColor={errors.firstname ? "red.500" : "gray.400"}
              />
              {errors.firstname && (
                <Text textColor={"red"}>{errors.firstname}</Text>
              )}
            </FormControl>

            <FormControl id="lastname">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Last Name
              </FormLabel>
              <Input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                borderColor={errors.lastname ? "red.500" : "gray.400"}
              />
              {errors.lastname && (
                <Text textColor={"red"}>{errors.lastname}</Text>
              )}
            </FormControl>

            <FormControl id="logistic">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Transport Name
              </FormLabel>
              <Input
                type="text"
                name="logisticName"
                value={formData.logisticName}
                onChange={handleChange}
                borderColor={errors.lastname ? "red.500" : "gray.400"}
              />
              {errors.lastname && (
                <Text textColor={"red"}>{errors.logisticName}</Text>
              )}
            </FormControl>
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap="8">
            <FormControl id="email">
              <FormLabel> Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                borderColor={errors.email ? "red.500" : "gray.400"}
              />
              {errors.email && <Text textColor={"red"}>{errors.email}</Text>}
            </FormControl>

            <FormControl id="contact">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Contact
              </FormLabel>
              <Input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                borderColor={errors.contact ? "red.500" : "gray.400"}
              />
              {errors.contact && (
                <Text textColor={"red"}>{errors.contact}</Text>
              )}
            </FormControl>

            <FormControl id="address1">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Address Line 1
              </FormLabel>
              <Input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                borderColor={errors.address1 ? "red.500" : "gray.400"}
              />
              {errors.address1 && (
                <Text textColor={"red"}>{errors.address1}</Text>
              )}
            </FormControl>
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap="8">
            <FormControl id="address2">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Address Line 2
              </FormLabel>
              <Input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                borderColor={errors.address2 ? "red.500" : "gray.400"}
              />
              {errors.address2 && (
                <Text textColor={"red"}>{errors.address2}</Text>
              )}
            </FormControl>

            <FormControl id="city">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                City
              </FormLabel>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                borderColor={errors.city ? "red.500" : "gray.400"}
              />
              {errors.city && <Text textColor={"red"}>{errors.city}</Text>}
            </FormControl>

            <FormControl id="pincode">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Pincode
              </FormLabel>
              <Input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                borderColor={errors.pincode ? "red.500" : "gray.400"}
              />
              {errors.pincode && (
                <Text textColor={"red"}>{errors.pincode}</Text>
              )}
            </FormControl>
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap="8">
            <FormControl id="state">
              <FormLabel>
                {" "}
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                State
              </FormLabel>
              <Input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                borderColor={errors.state ? "red.500" : "gray.400"}
              />
              {errors.state && <Text textColor={"red"}>{errors.state}</Text>}
            </FormControl>

            <FormControl id="GSTIN">
              <FormLabel> GSTIN</FormLabel>
              <Input
                type="text"
                name="GSTIN"
                value={formData.GSTIN??''}
                onChange={handleChange}
                borderColor={errors.GSTIN ? "red.500" : "gray.400"}
              />
              {errors.GSTIN && <Text textColor={"red"}>{errors.GSTIN}</Text>}
            </FormControl>
          </Grid>

          <Button
            type="submit"
            colorScheme="blue"
            alignSelf="flex-end"
            borderRadius={3}
            isLoading={isSubmitting}
          >
            {
              isEdit? 'Update' : 'Submit'
            }
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

export default CustomerForm;
