"use client";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Category from "../../../../../../server/src/core/entity/Category";
import BlankCard from "../shared/BlankCard";
import BlankTable from "../shared/BlankTable";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import NewButton from "./NewButton";
import CategoryService from "@/infra/service/Category.service";

const Table = () => {
  const intl = useIntl();
  const categoryService = new CategoryService();

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategory] = useState<Category[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const result = await categoryService.findAll();
      setRowCount(result.length);
      setCategory(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: intl.formatMessage({ id: "CATEGORY.TABLE.NAME.HEADER" }),
      description: intl.formatMessage({
        id: "CATEGORY.TABLE.NAME.DESCRIPTION",
      }),
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
              getCategories();
            }}
          />{" "}
          <DeleteButton
            id={row.id}
            name={row.name}
            value={row.value}
            onClose={() => {
              getCategories();
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
        title={`${intl.formatMessage({ id: "GENERAL.GENERAL" })}/${intl.formatMessage({ id: "GENERAL.CATEGORIES" })}`}
      >
        <BlankTable
          columns={columns}
          rows={categories}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rowCount={rowCount}
          isLoading={isLoading}
          paginationMode="client"
          NewButton={
            <NewButton
              onClose={() => {
                getCategories();
              }}
            />
          }
        />
      </BlankCard>
    </Box>
  );
};

export default Table;
