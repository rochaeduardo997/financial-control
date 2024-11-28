"use client";
import { useIntl } from "react-intl";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";

type Props = {
  columns: GridColDef[];
  rows: any[];
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: Dispatch<
    SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
  rowCount: number;
  isLoading: boolean;
};

const BlankTable = ({
  columns,
  rows,
  paginationModel,
  setPaginationModel,
  rowCount,
  isLoading,
}: Props) => {
  const intl = useIntl();

  return (
    <DataGrid
      disableColumnFilter={true}
      rows={rows}
      columns={columns}
      localeText={{
        noRowsLabel: intl.formatMessage({
          id: "GENERAL.TABLE.LABEL.NO_DATA_FOUND",
        }),
      }}
      slotProps={{
        pagination: {
          showFirstButton: true,
          showLastButton: true,
          labelRowsPerPage: intl.formatMessage({
            id: "GENERAL.TABLE.LABEL.PAGINATION",
          }),
          labelDisplayedRows: ({ from, to, count }) => `${from}-${to}/${count}`,
        },
      }}
      rowCount={rowCount}
      pageSizeOptions={[10, 25, 50, 100]}
      paginationModel={paginationModel}
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      loading={isLoading}
    />
  );
};

export default BlankTable;
