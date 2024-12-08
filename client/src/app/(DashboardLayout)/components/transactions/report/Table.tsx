"use client";
import ReportService from "@/infra/service/Report.service";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DayJS from "dayjs";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Transaction from "../../../../../../../server/src/core/entity/Transaction";
import { TFilters } from "../../../../../../../server/src/core/repository/ReportRepository.interface";
import BlankCard from "../../shared/BlankCard";
import BlankTable from "../../shared/BlankTable";
import TableCustomToolbar from "./TableCustomToolbar";
import MoreInformations from "./MoreInformations";

const Table = () => {
  const intl = useIntl();
  const reportService = new ReportService();

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<TFilters | undefined>();

  useEffect(() => {
    getReportCount();
    getReport(paginationModel.page, paginationModel.pageSize);
  }, [filters]);

  useEffect(() => {
    getReport(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const getReport = async (page: number = 0, limit: number = 25) => {
    try {
      setIsLoading(true);
      if (!filters) return;
      const result = await reportService.findAll(page + 1, limit, {
        ...filters,
      });
      setTransactions(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportCount = async () => {
    try {
      if (!filters) return;
      const result = await reportService.findAllCount({ ...filters });
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
      field: "description",
      headerName: intl.formatMessage({
        id: "TRANSACTION.TABLE.DESCRIPTION.HEADER",
      }),
      valueGetter: (value) => value,
      sortable: false,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "options",
      headerName: intl.formatMessage({
        id: "GENERAL.TABLE.OPTIONS",
      }),
      align: "center",
      renderCell: ({ row }) => <MoreInformations id={row.id} />,
      sortable: false,
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <Box>
      <BlankCard
        title={`${intl.formatMessage({ id: "GENERAL.TRANSACTIONS" })}/${intl.formatMessage(
          { id: "NAVBAR.ITEM.TRANSACTIONS.TITLE.REPORT" },
        )}`}
      >
        <BlankTable
          key="transaction_report_table"
          columns={columns}
          rows={transactions}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rowCount={rowCount}
          isLoading={isLoading}
          CustomToolbarContent={
            <TableCustomToolbar
              onFilter={(filters: TFilters) => {
                setFilters(filters);
              }}
            />
          }
        />
      </BlankCard>
    </Box>
  );
};

export default Table;
