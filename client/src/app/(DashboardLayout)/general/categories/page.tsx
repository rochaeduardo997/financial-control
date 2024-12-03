"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import Table from "../../components/categories/Table";

const Categories = () => {
  const intl = useIntl();

  return (
    <PageContainer
      title={intl.formatMessage({ id: "NAVBAR.ITEM.CATEGORIES.TITLE" })}
    >
      <Box>
        <Table />
      </Box>
    </PageContainer>
  );
};

export default Categories;
