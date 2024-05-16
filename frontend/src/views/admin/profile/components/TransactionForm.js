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
import axios, * as others from "axios";

const TransactionForm = () => {
  useEffect(() => {
    getProducts().then(() => {});
    getBillNo().then((d) => {
      setFormData({ ...formData, billNo: d.billNo });
    });
  }, []);

  let initialData = {
    customerId: -1,
    billNo: "",
    remark: "", // Add the remark field
    orderDate: "",
    details: [
      {
        productName: "",
        qty: "",
        rate: "",
        gstRate: "",
        customGst: "",
      },
    ],
  };

  const [products, setProducts] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });

  async function getProducts() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getAllProductType"
      );
      // console.log(response.data);
      const d = response.data;
      // console.log(d);
      // setCustomerData(d)
      setProducts(d);
      // console.log(currentCustomer,id);

      // setIsSubmitting(false);
    } catch (error) {
      console.error("Error adding customer:", error);
      // setError('Oops! Something went wrong. Please try again later.');
      // setIsSubmitting(false);
    }
  }
  async function getBillNo() {
    try {
      const response = await axios.get("http://localhost:5000/api/getBillNo");
      // console.log(response.data);
      const d = response.data;
      return d;
    } catch (error) {
      console.error("Error getting Billno:", error);
      // setError('Oops! Something went wrong. Please try again later.');
      // setIsSubmitting(false);
    }
  }

  async function addOrder(order) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/addOrder",
        order
      );
      console.log("Order added successfully:", response.data);
      setAlert({
        message: "Form submitted successfully! Redirecting to home ...",
        type: "success",
      }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
        handleGoBack();
      }, 2000); // Clearing alert after
      setIsSubmitting(false);

      // setIsSubmitting(false);
    } catch (error) {
      console.error("Error adding Order:", error);
      setAlert({
        message: error.message + " " + error.response.data,
        type: "error",
      }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
      }, 3000); // Clearing alert after
      setIsSubmitting(false);
    }
  }

  const history = useHistory();
  const location = useLocation();
  const { id } = location.state;

  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({
    billNo: "",
    remark: "", // Add remark field to errors state
    orderDate: "",
    details: [{ productName: "", qty: "", rate: "", gst: "" }],
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
      formData.customerId = id;
      const det = formData.details.map((d) => {
        const g = isNaN(d.gstRate)?d.customGst:d.gstRate
        return {
          productName: Number(d.productName),
          qty: Number(d.qty),
          rate: Number(d.rate),
          gst : Number(d.qty) * (Number(d.rate) * (Number(g)/100))
        };
      });

      const order = formData;
      order.details = det;
      setFormData({
        billNo: "",
        remark: "", // Reset remark field
        orderDate: "",
        details: [
          { productName: "", qty: "", rate: "", gstRate: "", customGst: "" },
        ],
      });
      setErrors({
        billNo: "",
        remark: "", // Reset remark field
        orderDate: "",
        details: [
          { productName: "", qty: "", rate: "", gstRate: "", customGst: "" },
        ],
      });
      addOrder(order);
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
      details: [
        ...formData.details,
        { productName: "", qty: "", rate: "", gstRate: "", customGst: "" },
      ],
    });
    setErrors({
      ...errors,
      details: [
        ...errors.details,
        { productName: "", qty: "", rate: "", gst: "" },
      ],
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

  const calcTotal = (qty, rate, gst, cust) => {
    let g = isNaN(gst) ? Number(cust) : Number(gst);
    let totalWithTax = Number(rate) * (1 + Number(g) / 100);
    let total = totalWithTax * Number(qty);
    return total.toPrecision(String(Math.round(total)).length + 2);
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
                readOnly
                value={formData.billNo}
                onChange={(e) =>
                  setFormData({ ...formData, billNo: e.target.value })
                }
                borderColor={errors.billNo ? "red.500" : "gray.400"}
                placeholder="Enter Bill Number"
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
                placeholder="Select Order Date"
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
              placeholder="Add a remark"
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
                  placeholder="Choose a product"
                >
                  {/* <option value="">Select Product</option> */}
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
                  placeholder="Enter quantity"
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
                  placeholder="Enter rate per unit"
                />
              </FormControl>

              {/* <FormControl flex="1">
                <FormLabel>
                  <Text textColor={"red"} display={"inline"}>
                    *
                  </Text>{" "}
                  GST
                </FormLabel>
                <Input
                  type="number"
                  name="gst"
                  value={detail.gst}
                  onChange={(e) => handleChange(e, index)}
                  borderColor={
                    errors.details[index] && errors.details[index].gst
                      ? "red.500"
                      : "gray.400"
                  }
                  placeholder="Enter GST rate"
                />
              </FormControl> */}

              <FormControl flex="1">
                <FormLabel>
                  <Text textColor={"red"} display={"inline"}>
                    *
                  </Text>{" "}
                  GST Rate
                </FormLabel>
                <Stack display="flex" direction="row">
                  <Select
                    width="60%"
                    name="gstRate"
                    value={detail.gstRate}
                    onChange={(e) => {
                      const newDetails = [...formData.details];
                      newDetails[index].gstRate = e.target.value;
                      newDetails[index].customGst =
                        e.target.value === "custom" ? "" : undefined;
                      setFormData({ ...formData, details: newDetails });
                    }}
                    borderColor={
                      errors.details[index] && errors.details[index].gst
                        ? "red.500"
                        : "gray.400"
                    }
                  >
                    <option defaultValue="0" selected>
                      Select gst rate
                    </option>
                    <option value="2.5">2.5%</option>
                    <option value="5">5%</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {detail.gstRate === "custom" && (
                    <Input
                      type="number"
                      name="customGst"
                      placeholder="Enter custom GST rate"
                      value={detail.customGst || ""}
                      onChange={(e) => {
                        const newDetails = [...formData.details];
                        newDetails[index].customGst = e.target.value;
                        setFormData({ ...formData, details: newDetails });
                      }}
                      borderColor="gray.400"
                      width="40%" // Ensuring the width matches the select width
                    />
                  )}
                </Stack>
              </FormControl>

              <FormControl flex="1">
                <FormLabel>Total</FormLabel>
                <Input
                  type="text"
                  name="total"
                  value={calcTotal(
                    detail.qty,
                    detail.rate,
                    detail.gstRate,
                    detail.customGst
                  )}
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
