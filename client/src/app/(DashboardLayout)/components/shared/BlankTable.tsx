"use client";
import { useIntl } from "react-intl";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {
  columns: GridColDef[];
  rows: any[];
  paginationModel: { page: number; pageSize: number };
};

const BlankTable = ({ columns, rows, paginationModel }: Props) => {
  const intl = useIntl();

  return (
    <DataGrid
      disableColumnFilter={true}
      rows={rows}
      columns={columns}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[25, 50, 100]}
      localeText={{
        noRowsLabel: intl.formatMessage({
          id: "GENERAL.TABLE.LABEL.NO_DATA_FOUND",
        }),
      }}
      slotProps={{
        pagination: {
          labelRowsPerPage: intl.formatMessage({
            id: "GENERAL.TABLE.LABEL.PAGINATION",
          }),
          labelDisplayedRows: ({ from, to, count }) => `${from}-${to}/${count}`,
        },
      }}
    />
  );
};

export default BlankTable;
