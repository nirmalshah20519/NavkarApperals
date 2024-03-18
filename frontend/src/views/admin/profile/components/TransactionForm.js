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

const TransactionForm = () => {

  useEffect(() => {
    getProducts().then(()=>{})
  }, [])

  const [products, setProducts] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });

  async function getProducts() {
    try {
        const response = await axios.get('http://localhost:5000/api/getAllProductType');
        // console.log(response.data);
        const d = response.data
        // console.log(d);
        // setCustomerData(d)
        setProducts(d)
        // console.log(currentCustomer,id);

        
        // setIsSubmitting(false);
    } catch (error) {
        console.error('Error adding customer:', error);
        // setError('Oops! Something went wrong. Please try again later.');
        // setIsSubmitting(false);
    }
}


async function addOrder(order) {
  try {
      const response = await axios.post('http://localhost:5000/api/addOrder',order);
      console.log('Order added successfully:', response.data);
      setAlert({ message: "Form submitted successfully! Redirecting to home ...", type: "success" }); // Setting success message
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

  const [formData, setFormData] = useState({
    customerId:-1,
    billNo: "",
    remark: "", // Add the remark field
    orderDate: "",
    details: [
      {
        productName: "",
        qty: "",
        rate: "",
      },
    ],
  });

  const [errors, setErrors] = useState({
    billNo: "",
    remark: "", // Add remark field to errors state
    orderDate: "",
    details: [{ productName: "", qty: "", rate: "" }],
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
    if (!formData.billNo.trim()) {
      errorsCopy.billNo = "Bill number is required";
      formValid = false;
    } else {
      errorsCopy.billNo = "";
    }

    if (!formData.orderDate.trim()) {
      errorsCopy.orderDate = "Order date is required";
      formValid = false;
    } else {
      errorsCopy.orderDate = "";
    }

    // Validate remark field
    if (!formData.remark.trim()) {
      errorsCopy.remark = "Remark is required";
      formValid = false;
    } else {
      errorsCopy.remark = "";
    }

    // Details level validation
    const detailsErrors = formData.details.map((detail, index) => {
      const detailErrors = {};
      if (!detail.productName || !detail.qty || !detail.rate) {
        detailErrors.productName = "Product name is required";
        detailErrors.qty = "Quantity is required";
        detailErrors.rate = "Rate is required";
        formValid = false;
      }
      return detailErrors;
    });

    setErrors({ ...errorsCopy, details: detailsErrors });

    if (formData.details.length === 0) {
      formValid = false;
      setErrors({
        ...errors,
        details: [
          {
            productName: "At least one product detail is required",
            qty: "",
            rate: "",
          },
        ],
      });
    }

    if (formValid) {
      // Handle form submission here
      formData.customerId = id
      const order = formData
      console.log(formData);
      setFormData({
        billNo: "",
        remark: "", // Reset remark field
        orderDate: "",
        details: [{ productName: "", qty: "", rate: "" }],
      });
      setErrors({
        billNo: "",
        remark: "", // Reset remark field
        orderDate: "",
        details: [{ productName: "", qty: "", rate: "" }],
      });
      // handleGoBack();
      addOrder(order)
    }
  };

  const handleGoBack = () => {
    history.push({
      pathname: `/admin/data-tables/profile/${id}`,
      state: { id: id },
    });
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { productName: "", qty: "", rate: "" }],
    });
    setErrors({
      ...errors,
      details: [...errors.details, { productName: "", qty: "", rate: "" }],
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
            Bill Details
          </Text>
          <Stack direction="row" spacing="4">
            {/* Bill Number */}
            <FormControl id="billNo" flex="1">
              <FormLabel>
                <Text textColor={"red"} display={"inline"}>
                  *
                </Text>{" "}
                Bill Number
              </FormLabel>
              <Input
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={(e) =>
                  setFormData({ ...formData, billNo: e.target.value })
                }
                borderColor={errors.billNo ? "red.500" : "gray.400"}
              />
              {errors.billNo && <Text textColor={"red"}>{errors.billNo}</Text>}
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
                name="orderDate"
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({ ...formData, orderDate: e.target.value })
                }
                borderColor={errors.orderDate ? "red.500" : "gray.400"}
              />
              {errors.orderDate && (
                <Text textColor={"red"}>{errors.orderDate}</Text>
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

          {/* Product Details */}
          <Text fontWeight={"semibold"} size="xl" mb="2">
            Product Details
          </Text>

          {formData.details.map((detail, index) => (
            <Stack direction="row" spacing="4" key={index} alignItems="center">
              <FormControl flex="1">
                <FormLabel>
                  <Text textColor={"red"} display={"inline"}>
                    *
                  </Text>{" "}
                  Product Name
                </FormLabel>
                <Select
                  name="productName"
                  value={detail.productName}
                  onChange={(e) => handleChange(e, index)}
                  borderColor={
                    errors.details[index] && errors.details[index].productName
                      ? "red.500"
                      : "gray.400"
                  }
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl flex="1">
                <FormLabel>
                  <Text textColor={"red"} display={"inline"}>
                    *
                  </Text>{" "}
                  Quantity (qty)
                </FormLabel>
                <Input
                  type="number"
                  name="qty"
                  value={detail.qty}
                  onChange={(e) => handleChange(e, index)}
                  borderColor={
                    errors.details[index] && errors.details[index].qty
                      ? "red.500"
                      : "gray.400"
                  }
                />
              </FormControl>

              <FormControl flex="1">
                <FormLabel>
                  <Text textColor={"red"} display={"inline"}>
                    *
                  </Text>{" "}
                  Rate
                </FormLabel>
                <Input
                  type="number"
                  name="rate"
                  value={detail.rate}
                  onChange={(e) => handleChange(e, index)}
                  borderColor={
                    errors.details[index] && errors.details[index].rate
                      ? "red.500"
                      : "gray.400"
                  }
                />
              </FormControl>

              <FormControl flex="1">
                <FormLabel>Total</FormLabel>
                <Input
                  type="text"
                  name="total"
                  value={detail.qty * detail.rate}
                  readOnly
                />
              </FormControl>

              <Button
                onClick={() => handleDeleteDetail(index)}
                colorScheme="red"
                alignSelf="flex-end"
              >
                Delete
              </Button>
            </Stack>
          ))}

          {errors.details.length > 0 &&
            errors.details.map((detailErrors, index) => (
              <Stack direction="row" spacing="4" key={index} display={"flex"}>
                <Text flex="1" textColor={"red"}>
                  {detailErrors.productName}
                </Text>
                <Text flex="1" textColor={"red"}>
                  {detailErrors.qty}
                </Text>
                <Text flex="1" textColor={"red"}>
                  {detailErrors.rate}
                </Text>
                <Text flex="1" textColor={"red"}></Text>
              </Stack>
            ))}

          {/* Add Product Detail Button */}
          <Button
            width={"fit-content"}
            background={"#008080"} // Teal color for the background
            color={"white"}
            _hover={{ background: "#006688" }} // Darker shade of teal for hover effect
            onClick={handleAddDetail}
          >
            Add Product Detail
          </Button>

          {/* Submit Button */}
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

export default TransactionForm;
