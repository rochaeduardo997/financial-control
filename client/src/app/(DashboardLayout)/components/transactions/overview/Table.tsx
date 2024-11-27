"use client";
import { Box, IconButton } from "@mui/material";
import { useIntl } from "react-intl";
import { GridColDef } from "@mui/x-data-grid";
import BlankCard from "../../shared/BlankCard";
import DayJS from "dayjs";
import { IconTrash, IconPencil } from "@tabler/icons-react";
import BlankTable from "../../shared/BlankTable";
import { useEffect, useState } from "react";
import Transaction from "../../../../../../../server/src/core/entity/Transaction";
import TransactionService from "@/infra/service/Transaction.service";

const Table = () => {
  const intl = useIntl();
  const transactionService = new TransactionService();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    try {
      const result = await transactionService.findAll();
      setTransactions(result);
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "direction",
      headerName: intl.formatMessage({
        id: "TRANSACTION.TABLE.DIRECTION.HEADER",
      }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.DIRECTION.DESCRIPTION",
      }),
      valueGetter: (value) =>
        intl.formatMessage({
          id: `TRANSACTION.TABLE.DIRECTION.VALUE.${(value + "").toUpperCase()}`,
        }),
      sortable: false,
      flex: 1,
    },
    {
      field: "name",
      headerName: intl.formatMessage({ id: "TRANSACTION.TABLE.NAME.HEADER" }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.NAME.DESCRIPTION",
      }),
      sortable: false,
      flex: 1,
    },
    {
      field: "value",
      headerName: intl.formatMessage({ id: "TRANSACTION.TABLE.VALUE.HEADER" }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.VALUE.DESCRIPTION",
      }),
      valueGetter: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
      sortable: false,
      flex: 1,
    },
    {
      field: "when",
      headerName: intl.formatMessage({
        id: "TRANSACTION.TABLE.WHEN.HEADER",
      }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.WHEN.DESCRIPTION",
      }),
      valueGetter: (value) => DayJS(value).format("HH:mm:ss DD/MM/YY"),
      sortable: false,
      flex: 1,
    },
    {
      field: "options",
      headerName: intl.formatMessage({
        id: "GENERAL.TABLE.OPTIONS",
      }),
      renderCell: () => (
        <>
          <IconButton aria-label="edit" color="warning">
            <IconPencil />
          </IconButton>{" "}
          <IconButton aria-label="delete" color="error">
            <IconTrash />
          </IconButton>
        </>
      ),
      sortable: false,
      flex: 1,
    },
  ];

  const paginationModel = { page: 0, pageSize: 25 };

  return (
    <Box>
      <BlankCard
        title={`${intl.formatMessage({ id: "GENERAL.TRANSACTIONS" })}/${intl.formatMessage(
          { id: "NAVBAR.ITEM.TRANSACTIONS.TITLE.OVERVIEW" },
        )}`}
      >
        <BlankTable
          columns={columns}
          rows={transactions}
          paginationModel={paginationModel}
        />
      </BlankCard>
    </Box>
  );
};

export default Table;
