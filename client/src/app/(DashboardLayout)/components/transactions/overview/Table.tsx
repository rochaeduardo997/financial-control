"use client";
import { Box, IconButton } from "@mui/material";
import { useIntl } from "react-intl";
import { GridColDef } from "@mui/x-data-grid";
import BlankCard from "../../shared/BlankCard";
import DayJS from "dayjs";
import { IconTrash, IconPencil } from "@tabler/icons-react";
import BlankTable from "../../shared/BlankTable";

const Table = () => {
  const intl = useIntl();

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

  const rows = [
    {
      id: 1,
      name: "name1",
      value: Math.random() * 100000,
      direction: "in",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 2,
      name: "name2",
      value: Math.random() * 100000,
      direction: "out",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 3,
      name: "name3",
      value: Math.random() * 100000,
      direction: "out",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 4,
      name: "name4",
      value: Math.random() * 100000,
      direction: "in",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 5,
      name: "name5",
      value: Math.random() * 100000,
      direction: "out",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 6,
      name: "name6",
      value: Math.random() * 100000,
      direction: "in",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 7,
      name: "name7",
      value: Math.random() * 100000,
      direction: "in",
      when: new Date("2024-11-10T09:31:53"),
    },
    {
      id: 8,
      name: "name8",
      value: Math.random() * 100000,
      direction: "in",
      when: new Date("2024-11-10T09:31:53"),
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
          rows={rows}
          paginationModel={paginationModel}
        />
      </BlankCard>
    </Box>
  );
};

export default Table;
