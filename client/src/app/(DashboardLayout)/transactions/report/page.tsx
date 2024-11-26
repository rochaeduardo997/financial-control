"use client";
import { Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIntl } from "react-intl";

const Dashboard = () => {
  const intl = useIntl();

  return (
    <PageContainer
      title={intl.formatMessage({
        id: "NAVBAR.ITEM.TRANSACTIONS.TITLE.REPORT",
      })}
    >
      <Box>REPORT</Box>
    </PageContainer>
  );
};

export default Dashboard;
