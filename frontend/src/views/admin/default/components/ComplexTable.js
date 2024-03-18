import React, { useMemo, useState } from "react";
import {
  Flex,
  Table,
  Text,
  Th,
  Box,
  Tr,
  Thead,
  Tbody,
  Td,
  IconButton,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Icon,
  Input,
} from "@chakra-ui/react";
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
import Card from "components/card/Card";
import {MdOutlineRemoveRedEye, MdDeleteOutline, MdOutlineEdit } from 'react-icons/md'

export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;
  const [filterInput, setFilterInput] = useState("");

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
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

  const { pageIndex, pageSize, globalFilter } = state;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Products
        </Text>
        <Flex alignItems="center">
          <Box mr="10px">
            <Icon as={SearchIcon} color="gray.400" />
          </Box>
          <Input
            value={filterInput}
            onChange={(e) => {
              setFilterInput(e.target.value);
              setGlobalFilter(e.target.value || undefined);
            }}
            placeholder="Search..."
            style={{ width: "200px", padding: "5px" }}
          />
        </Flex>
      </Flex>

      {page.length === 0 ? (
        <Text
          color={textColor}
          fontSize="lg"
          fontWeight="normal"
          textAlign="center"
          my={4}
        >
          No results found
        </Text>
      ) : (
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px" w={'full'} px={'1.5rem'} >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    // pe="10px"
                    mx={'16px'}
                    key={index}
                    borderColor={borderColor}
                    w={'fit-content'}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "1rem" }}
                      color="gray.400"
                    >
                      {console.log(column.render("Header"))}
                      {column.render("Header")==='ACTION'?(<Text textAlign={'right'} w={'full'}>{column.render("Header")}</Text>):column.render("Header")}
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
                    let data = "";
                    if (
                      ["PRODUCT NAME"].includes(
                        cell.column.Header
                      )
                    ) {
                      data = (
                        
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {cell.value?cell.value: "-"}
                        </Text>
                      );
                    } else if (cell.column.Header === "ACTION") {
                      data = (
                        <Flex align="right" justifyContent={'end'}>
                          <IconButton
                            colorScheme={"blue"}
                            // size="md"
                            me={4}
                            padding={0}
                            fontWeight="700"
                            // onClick={() => handleClick(cell.row.original)}
                            icon={<MdOutlineEdit />}
                          >
                            {/* View {" >>"} */}
                            
                          </IconButton>
  
                          <IconButton
                            colorScheme={"red"}
                            // size="md"
                            padding={0}
                            fontWeight="700"
                            // onClick={() => handleDelClick(cell.row.original)}
                            icon={<MdDeleteOutline  />}
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
                        // borderColor="transparent"
                       
                      >
                        {data}
                      </Td>
          

                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}

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
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
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
