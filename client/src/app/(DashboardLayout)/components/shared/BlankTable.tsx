"use client";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFeatureMode,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Dispatch, ElementType, SetStateAction } from "react";
import { useIntl } from "react-intl";

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
  paginationMode?: GridFeatureMode;
  rowCount: number;
  isLoading: boolean;
  CustomToolbarContent?: JSX.Element;
};

const BlankTable = ({
  columns,
  rows,
  paginationModel,
  setPaginationModel,
  paginationMode = "server",
  rowCount,
  isLoading,
  CustomToolbarContent,
}: Props) => {
  const intl = useIntl();

  function CustomToolbar() {
    if (CustomToolbarContent)
      return (
        <GridToolbarContainer>{CustomToolbarContent}</GridToolbarContainer>
      );

    return <></>;
  }

  return (
    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <DataGrid
          sx={{ overflowX: "scroll" }}
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
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to}/${count}`,
            },
          }}
          rowCount={rowCount}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          paginationMode={paginationMode}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          slots={{ toolbar: CustomToolbar }}
          disableRowSelectionOnClick
          disableMultipleRowSelection
          disableColumnFilter
          columnBufferPx={100}
          rowBufferPx={100}
        />
      </Box>
    </Box>
  );
};

export default BlankTable;
