"use client";
import { useIntl } from "react-intl";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import { Box, Button } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";

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

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="success" startIcon={<IconPlus />}>
          {intl.formatMessage({
            id: "GENERAL.NEW",
          })}
        </Button>{" "}
      </GridToolbarContainer>
    );
  }

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
      slots={{ toolbar: CustomToolbar }}
    />
  );
};

export default BlankTable;
