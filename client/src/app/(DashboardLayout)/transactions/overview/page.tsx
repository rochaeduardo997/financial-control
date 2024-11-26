"use client";
import { Box, Button, IconButton } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIntl } from "react-intl";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import BlankCard from "../../components/shared/BlankCard";
import DayJS from "dayjs";
import { IconTrash, IconPencil } from "@tabler/icons-react";

const Dashboard = () => {
  const intl = useIntl();

  const columns: GridColDef[] = [
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
      sortable: false,
      flex: 1,
      valueGetter: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
    },
    {
      field: "direction",
      headerName: intl.formatMessage({
        id: "TRANSACTION.TABLE.DIRECTION.HEADER",
      }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.DIRECTION.DESCRIPTION",
      }),
      sortable: false,
      flex: 1,
      valueGetter: (value) =>
        intl.formatMessage({
          id: `TRANSACTION.TABLE.DIRECTION.VALUE.${(value + "").toUpperCase()}`,
        }),
    },
    {
      field: "when",
      headerName: intl.formatMessage({
        id: "TRANSACTION.TABLE.WHEN.HEADER",
      }),
      description: intl.formatMessage({
        id: "TRANSACTION.TABLE.WHEN.DESCRIPTION",
      }),
      sortable: false,
      flex: 1,
      valueGetter: (value) => DayJS(value).format("HH:mm:ss DD/MM/YY"),
    },
    {
      field: "options",
      headerName: intl.formatMessage({
        id: "GENERAL.TABLE.OPTIONS",
      }),
      sortable: false,
      flex: 1,
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

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <PageContainer
      title={intl.formatMessage({
        id: "NAVBAR.ITEM.TRANSACTIONS.TITLE.OVERVIEW",
      })}
    >
      <Box>
        <BlankCard>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </BlankCard>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
