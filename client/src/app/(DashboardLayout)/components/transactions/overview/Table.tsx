"use client";
import TransactionService from "@/infra/service/Transaction.service";
import { Box, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import DayJS from "dayjs";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Transaction from "../../../../../../../server/src/core/entity/Transaction";
import BlankCard from "../../shared/BlankCard";
import BlankTable from "../../shared/BlankTable";
import NewButton from "./NewButton";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

const Table = () => {
  const intl = useIntl();
  const transactionService = new TransactionService();

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    getTransactionsCount();
  }, []);

  useEffect(() => {
    getTransactions(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const getTransactions = async (page: number = 0, limit: number = 25) => {
    try {
      setIsLoading(true);
      const result = await transactionService.findAll(page + 1, limit);
      setTransactions(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionsCount = async () => {
    try {
      const result = await transactionService.findAllCount();
      setRowCount(result);
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
      minWidth: 150,
    },
    {
      field: "name",
      headerName: intl.formatMessage({ id: "TRANSACTION.TABLE.NAME.HEADER" }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.NAME.DESCRIPTION",
      }),
      sortable: false,
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
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
      minWidth: 150,
    },
    {
      field: "options",
      headerName: intl.formatMessage({
        id: "GENERAL.TABLE.OPTIONS",
      }),
      renderCell: ({ row }) => (
        <>
          <EditButton
            id={row.id}
            onClose={() => {
              getTransactionsCount();
              getTransactions(paginationModel.page, paginationModel.pageSize);
            }}
          />{" "}
          <DeleteButton
            id={row.id}
            name={row.name}
            value={row.value}
            onClose={() => {
              getTransactionsCount();
              getTransactions(paginationModel.page, paginationModel.pageSize);
            }}
          />
        </>
      ),
      sortable: false,
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <Box>
      <BlankCard
        title={`${intl.formatMessage({ id: "GENERAL.TRANSACTIONS" })}/${intl.formatMessage(
          { id: "NAVBAR.ITEM.TRANSACTIONS.TITLE.OVERVIEW" },
        )}`}
      >
        <BlankTable
          key="transaction_overview_table"
          columns={columns}
          rows={transactions}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rowCount={rowCount}
          isLoading={isLoading}
          NewButton={
            <NewButton
              onClose={() => {
                getTransactionsCount();
                getTransactions(paginationModel.page, paginationModel.pageSize);
              }}
            />
          }
        />
      </BlankCard>
    </Box>
  );
};

export default Table;
