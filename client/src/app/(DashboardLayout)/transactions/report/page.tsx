"use client";
import { Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIntl } from "react-intl";
import Table from "../../components/transactions/report/Table";

const Report = () => {
  const intl = useIntl();

  return (
    <PageContainer
      title={intl.formatMessage({
        id: "NAVBAR.ITEM.TRANSACTIONS.TITLE.REPORT",
      })}
    >
      <Box>
        <Table />
      </Box>
    </PageContainer>
  );
};

export default Report;
