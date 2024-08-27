import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  CircularProgress,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import ColumnsTable from "views/admin/profile/components/ColumnsTable";
import axios from "axios";
import ColumnsTablePayments from "./components/ColumnsTablePayments";
import ColumnsTableLedger from "./components/ColumnsTableLedger";
import avatar from "assets/img/avatars/customer.jpg";
import banner from "assets/img/auth/banner.png";
import React, { useEffect, useState } from "react";
import {
  columnsDataLedger,
  columnsDataPayments,
  columnsDataTransactions,
} from "./variables/ColumnData";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function Overview() {
  const [customerData, setCustomerData] = useState([]);
  const [customerPaymentData, setCustomerPaymentData] = useState([]);
  const [customer, setCustomer] = useState({});
  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    setGlobalLoading(true);
    getCustomers().then((d) => {
      setOrderTotal(0);
      d.transactions.forEach((e) => setOrderTotal((o) => o + Number(e.amount)));
      // setGlobalLoading(false);
      setPaymentsTotal(0);
      d.payments.forEach((e) => setPaymentsTotal((o) => o + Number(e.Amount)));
      setGlobalLoading(false);
    });
  }, []);

  async function getCustomers() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getRequiredDataCustomersById/${id}`
      );
      const d = response.data;
      setCustomer(d);
      return d;
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  }

  const textColor = useColorModeValue("secondaryGray.900", "white");

  const location = useLocation();
  const { id } = useParams();
  const history = useHistory();

  const handleAddTransaction = () => {
    history.push({
      pathname: `/admin/customers/profile/${customer.id}/addTransaction`,
      state: { id: customer.id },
    });
  };

  const handleAddPayment = () => {
    history.push({
      pathname: `/admin/customers/profile/${customer.id}/addPayment`,
      state: { id: customer.id },
    });
  };

  const handleViewTransaction = (tid) => {
    history.push({
      pathname: `/admin/customers/profile/${customer.id}/Transaction/${tid}`,
      state: { id: customer, tid: tid },
    });
  };

  const handleGoBack = () => {
    history.push({
      pathname: `/admin/customers/`,
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isPyOpen, setPyIsOpen] = useState(false);
  const [ordId, setOrdId] = useState(-1);
  const [pyId, setpyId] = useState(-1);
  const onClose = () => setIsOpen(false);
  const onPyClose = () => setPyIsOpen(false);
  const cancelRef = React.useRef();

  async function deleteOrder(id) {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteOrder/${id}`
      );
      setAlert({ message: "order deleted successfully!", type: "success" });
      setTimeout(() => {
        setAlert({});
      }, 2500);
    } catch (error) {
      setError("Oops! Something went wrong. Please try again later.");
      setAlert({ message: error.message, type: "error" });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
  }

  async function deletePayment(id) {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteTransaction/${id}`
      );
      setAlert({
        message: "Transaction deleted successfully!",
        type: "success",
      });
      setTimeout(() => {
        setAlert({});
      }, 2500);
      getCustomers().then(() => {
        console.log("donr");
      });
    } catch (error) {
      setError("Oops! Something went wrong. Please try again later.");
      setAlert({ message: error.message, type: "error" });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
  }

  const handleDelClick = (id) => {
    setOrdId(id);
    setIsOpen(true);
  };

  const handlePayDelClick = (id) => {
    setpyId(id);
    setPyIsOpen(true);
  };

  const handleDeleteConfirmed = () => {
    deleteOrder(ordId).then(() => {
      getCustomers().then(() => {
        console.log("");
      });
    });
    setOrdId(-1);
    onClose();
  };

  async function getLedger() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/printLedger/${id}`
      );
      return response.data;
    } catch (error) {
      setError("Oops! Something went wrong. Please try again later.");
      setAlert({ message: error.message, type: "error" });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
  }

  async function whatsappLedger() {
    setIsLoading2(true);

    try {
      await axios
        .get(`http://localhost:5000/api/sendLedger/${id}`)
        .then((resp) => {
          setIsLoading2(false);
          setAlert({ message: "Message sent successfully", type: "success" });
          setTimeout(() => {
            setAlert({});
          }, 3000);
        })
        .catch((err) => {
          setIsLoading2(false);
          setAlert({ message: "Error Sending Message", type: "error" });
          setTimeout(() => {
            setAlert({});
          }, 3000);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handlePrint = () => {
    setIsLoading(true);
    getLedger().then((d) => {
      setIsLoading(false);
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(d);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 50);
    });
  };

  const handlePyDeleteConfirmed = () => {
    deletePayment(pyId).then((data) => {
      if (!data) {
        setAlert({ message: "Failed to Delete Payment.", type: "error" });
      } else {
        setAlert({ message: `Successfully Deleted Payment.`, type: "success" });
      }
    });
    setpyId(-1);
    onPyClose();
  };

  const formatIndianCurrency = (num) => {
    let strNum = num.toFixed(2).toString();
    let parts = strNum.split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? "." + parts[1] : ".00";
    let formattedIntegerPart = "";
    for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formattedIntegerPart = "," + formattedIntegerPart;
      }
      formattedIntegerPart = integerPart[i] + formattedIntegerPart;
    }
    return "₹ " + formattedIntegerPart + decimalPart;
  };

  if(globalLoading){
    return <Box
    position="fixed"
    top="0"
    left="0"
    width="100vw"
    height="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="rgba(255, 255, 255, 0.8)"
    zIndex="9999"
  >
    <CircularProgress color="blue.500" />
    <Text fontSize={"1.5rem"}
            background={"transparent"}
            cursor={"pointer"}
            _hover={{ color: "blue" }}> Loading ...</Text>
  </Box>
  }

  return (
    <>
    {/* {globalLoading && } */}
      <Box>
          <Text
            fontSize={"1.5rem"}
            background={"transparent"}
            cursor={"pointer"}
            _hover={{ color: "blue" }}
            onClick={handleGoBack}
          >
            <ArrowBackIcon />
          </Text>

          <Flex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "flex-start" }}
            gap={{ base: "20px", lg: "20px" }}
          >
            <Banner
              banner={banner}
              avatar={avatar}
              name={customer.name}
              job={customer.type}
              id={customer.id}
            />

            <General
              gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
              pe="20px"
              contact={customer.mobile}
              address={customer.address}
              email={customer.email}
              gst={customer.GSTIN}
              orderTotal={formatIndianCurrency(orderTotal)}
              paymentsTotal={formatIndianCurrency(paymentsTotal)}
              currentStatus={formatIndianCurrency(paymentsTotal - orderTotal)}
              status={paymentsTotal - orderTotal > 0}
            />
          </Flex>

          {alert.message && (
            <Alert status={alert.type} mt="4">
              <AlertIcon />
              {alert.message}
            </Alert>
          )}
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em" bg={"white"}>
              <Tab
                _selected={{
                  bg: "blue.500",
                  color: "white",
                  borderColor: "blue.500",
                }}
                _hover={{ bg: "blue.400" }}
                fontWeight="semibold"
              >
                Orders
              </Tab>
              <Tab
                _selected={{
                  bg: "blue.500",
                  color: "white",
                  borderColor: "blue.500",
                }}
                _hover={{ bg: "blue.400" }}
                fontWeight="semibold"
              >
                Transactions
              </Tab>
              <Tab
                _selected={{
                  bg: "blue.500",
                  color: "white",
                  borderColor: "blue.500",
                }}
                _hover={{ bg: "blue.400" }}
                fontWeight="semibold"
              >
                Ledger
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Flex
                  px="25px"
                  py={"16px"}
                  borderRadius={"16px"}
                  justify="space-between"
                  mb="20px"
                  align="center"
                  bg={"white"}
                >
                  <Text
                    color={textColor}
                    fontSize="2rem"
                    fontWeight="700"
                    lineHeight="100%"
                  >
                    Orders
                  </Text>
                  <Button colorScheme="blue" onClick={handleAddTransaction}>
                    Add Order
                  </Button>
                </Flex>

                <ColumnsTable
                  columnsData={columnsDataTransactions}
                  tableData={customer.transactions ?? []}
                  handleClick={handleViewTransaction}
                  handleDelClick={handleDelClick}
                />
              </TabPanel>
              <TabPanel>
                <Flex
                  px="25px"
                  py={"16px"}
                  borderRadius={"16px"}
                  justify="space-between"
                  mb="20px"
                  align="center"
                  bg={"white"}
                >
                  <Text
                    color={textColor}
                    fontSize="2rem"
                    fontWeight="700"
                    lineHeight="100%"
                  >
                    Transactions
                  </Text>
                  <Button colorScheme="blue" onClick={handleAddPayment}>
                    Add Transaction
                  </Button>
                </Flex>
                <ColumnsTablePayments
                  columnsData={columnsDataPayments}
                  tableData={customer.payments ?? []}
                  handleDelClick={handlePayDelClick}
                />
              </TabPanel>
              <TabPanel>
                <Flex
                  px="25px"
                  py={"16px"}
                  borderRadius={"16px"}
                  justify="space-between"
                  mb="20px"
                  align="center"
                  bg={"white"}
                >
                  <Text
                    color={textColor}
                    fontSize="2rem"
                    fontWeight="700"
                    lineHeight="100%"
                  >
                    Ledger
                  </Text>
                  <Flex justify="end" me="20px" align="center" bg={"white"} gap={"8px"}>
                    <Button colorScheme="blue" onClick={handlePrint}>
                      {isLoading ? (
                        <Spinner
                          thickness="4px"
                          speed="1s"
                          emptyColor="gray.200"
                          color="blue.500"
                          size="lg"
                        />
                      ) : (
                        "Generate Ledger"
                      )}
                    </Button>
                    <Button colorScheme="green" onClick={whatsappLedger}>
                      {isLoading2 ? (
                        <Spinner
                          thickness="4px"
                          speed="1s"
                          emptyColor="gray.200"
                          color="green.500"
                          size="lg"
                        />
                      ) : (
                        <em className="bi bi-whatsapp"></em>
                      )}
                    </Button>
                  </Flex>
                </Flex>

                <ColumnsTableLedger
                  columnsData={columnsDataLedger}
                  tableData={customer.ledger ?? []}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirm Deletion
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this order #{ordId}?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={handleDeleteConfirmed} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <AlertDialog
            isOpen={isPyOpen}
            leastDestructiveRef={cancelRef}
            onClose={onPyClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirm Deletion
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this Transaction #{pyId}?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onPyClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handlePyDeleteConfirmed}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
    </>
  );
}
