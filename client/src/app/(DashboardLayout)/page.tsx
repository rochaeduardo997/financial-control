"use client";
import DashboardService from "@/infra/service/Dashboard.service";
import { Typography, Divider, Box, Grid2 as Grid } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import BlankCard from "./components/shared/BlankCard";
import { useIntl } from "react-intl";
import BlankPieChart from "./components/shared/BlankPieChart";
import BlankBarChart from "./components/shared/BlankBarChart";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const intl = useIntl();
  const dashboardService = new DashboardService();

  const [isLoading, setIsLoading] = useState(false);
  const [inOut, setInOut] = useState({in: 0, out: 0});

  useEffect(() => {
    if(inOut.in > 0 || inOut.out > 0) return;
    getInOut();
  }, []);

  const getInOut = async () => {
    try {
      setIsLoading(true);
      const result = await dashboardService.getDashboardInOutTotals(new Date().getFullYear());
      setInOut(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Dashboard">
      <BlankCard
        title="Dashboard"
      >
        <Typography component="div" variant="h5" sx={{ paddingBottom: 3 }}>{`${intl.formatMessage({ id: "DASHBOARD.CARD.IN_OUT" })}`}</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <BlankBarChart series={[{ data: [inOut.in, inOut.out]}]} categories={['Entrada', 'Saída']} currency={'R$'} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BlankPieChart series={[inOut.in, inOut.out]} labels={['Entrada', 'Saída']} currency={'R$'} />
          </Grid>
        </Grid>

        <Divider sx={{ m: 2 }} />

        <Typography component="div" variant="h5" sx={{ paddingBottom: 3 }}>R$</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><BlankPieChart series={[1000, 700, 800, 1200, 3000]} labels={['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5']} currency={'R$'} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BlankPieChart series={[300, 200, 500]} labels={['Cat6', 'Cat7', 'Cat8']} currency={'R$'} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BlankBarChart series={[{ data: [1000, 700, 800, 1200, 3000]}]} categories={['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5']} currency={'R$'} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BlankBarChart series={[{ data: [300, 200, 500]}]} categories={['Cat6', 'Cat7', 'Cat8']} currency={'R$'} /></Grid>
        </Grid>
      </BlankCard>
    </PageContainer>
  );
};

export default Dashboard;
          // <Typography component="div" variant="h5" sx={{ paddingBottom: 3 }}>R$ - {`${intl.formatMessage({ id: "TRANSACTION.TABLE.DIRECTION.VALUE.OUT" })}`}</Typography>
