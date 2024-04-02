import {
  Flex,
  Table,
  Button,
  Text,
  Box,
  Icon,
  Input,
  Th,
  Tr,
  Thead,
  Tbody,
  Td,
  Tooltip,
  IconButton,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import Card from "components/card/Card";
import {
  MdOutlineRemoveRedEye,
  MdDeleteOutline,
  
  MdOutlineEdit,
} from "react-icons/md";
// import { DefaultColumnFilter } from "./DefaultColumnFilter";

const HighlightedText = ({ text = "", highlight = "" }) => {
  // Ensure text is a string
  const textAsString = String(text);

  if (!highlight.trim()) {
    return <span style={{fontWeight:'bold', fontSize:'1.1rem',color:'#3F3F3F'}}>{textAsString}</span>;
  }
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = textAsString.split(regex);
  return (
    <span style={{fontWeight:'bold', fontSize:'1.1rem',color:'#3F3F3F'}}>
      {parts.filter(String).map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            style={{
              backgroundColor: "#FFE633",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function ColumnsTable(props) {
  const history = useHistory();

  const handleAddCustomer = () => {
    history.push({
      pathname: `/admin/customers/addCustomer`,
    });
  };
  const { columnsData, tableData, handleClick, handleDelClick, handleEditClick } = props;

  const [filterInput, setFilterInput] = useState("");

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 1000 }, // Setting initial page index and page size
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      {/* <Flex px="25px" justify="space-between" mb="20px" align="center">
      <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
        Customers
      </Text>
      <Button colorScheme="blue" onClick={handleAddCustomer}>Add Customers</Button>
    </Flex> */}
      {/* Search input */}
      <Flex
        px="25px"
        mb="20px"
        justify="flex-start"
        align="center"
        border={`solid ${textColor} 2p`}
      >
        <Box mr="10px">
          <Icon as={SearchIcon} color="gray.400" />
        </Box>
        
        <Input
          value={filterInput}
          onChange={(e) => {
            setFilterInput(e.target.value);
            setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
          }}
          placeholder="Search..."
          style={{padding: "5px" }}
        />
      </Flex>

      {/* Table */}

      {page.length === 0 ? (
        <Text
          color={textColor}
          fontSize="lg"
          fontWeight="normal"
          textAlign="center"
          my={4}
        >
          No customers found
        </Text>
      ) : (
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let content = cell.value; // Default rendering content
                    if (
                      ["ID", "NAME", "EMAIL", "MOBILE"].includes(
                        cell.column.Header
                      )
                    ) {
                      content = (
                        <HighlightedText
                          text={cell.value ? cell.value : "-"}
                          highlight={filterInput}
                        />
                      );
                    } else if (cell.column.Header === "ACTION") {
                      content = (
                        <Flex align="center">
                          <IconButton
                            colorScheme={"blue"}
                            // size="md"
                            me={2}
                            padding={0}
                            fontWeight="700"
                            onClick={() => handleClick(cell.row.original)}
                            icon={<MdOutlineRemoveRedEye />}
                          >
                            {/* View {" >>"} */}
                          </IconButton>

                          <IconButton
                            colorScheme={"red"}
                            // size="md"
                            me={2}
                            padding={0}
                            fontWeight="700"
                            onClick={() => handleDelClick(cell.row.original)}
                            icon={<MdDeleteOutline />}
                          >
                            {/* View {" >>"} */}
                          </IconButton>

                          <IconButton
                            colorScheme={"green"}
                            // size="md"
                            padding={0}
                            fontWeight="700"
                            onClick={() => handleEditClick(cell.row.original)}
                            icon={<MdOutlineEdit />}
                          >
                            {/* View {" >>"} */}
                          </IconButton>
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        maxH="30px !important"
                        py="8px"
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {content}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}

      {/* Pagination */}
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink="0">Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value) => {
              const page = value ? value - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  );
}
