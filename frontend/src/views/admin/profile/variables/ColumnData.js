export const columnsDataTransactions = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "DATE",
      accessor: "datetime",
    },
    {
      Header: "REMARK",
      accessor: "remark",
    },
    {
      Header: "AMOUNT",
      accessor: "amount",
    },
    {
      Header: "BILL",
      accessor: "billNo",
    },
    {
        Header: "ACTION",
        accessor: "action",
    }
  ];

  export const columnsDataPayments = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "DATE",
      accessor: "TransactionDate",
    },
    {
      Header: "REMARK",
      accessor: "remark",
    },
    {
      Header: "AMOUNT",
      accessor: "Amount",
    },
    {
        Header: "ACTION",
        accessor: "action",
    }
  ];

  export const columnsDataLedger = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "DATE",
      accessor: "date",
    },
    {
      Header: "REMARK",
      accessor: "remark",
    },
    {
      Header: "CREDIT",
      accessor: "credit",
    },
    {
      Header: "DEBIT",
      accessor: "debit",
    }
  ];