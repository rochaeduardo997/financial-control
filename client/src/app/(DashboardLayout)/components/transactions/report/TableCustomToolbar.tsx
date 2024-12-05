"use client";
import { Box, Button, Grid2 as Grid } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconCheck } from "@tabler/icons-react";
import DayJS from "dayjs";
import { useState } from "react";
import { useIntl } from "react-intl";
import { TFilters } from "../../../../../../../server/src/core/repository/ReportRepository.interface";

type Props = {
  onFilter: (filters: TFilters) => void;
};

const TableCustomToolbar = ({ onFilter }: Props) => {
  const intl = useIntl();

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<IconCheck />}
          onClick={() => {
            onFilter({ start, end });
          }}
        >
          {intl.formatMessage({ id: "GENERAL.FILTER" })}
        </Button>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box mt="20px">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ width: "100%" }}
                label={intl.formatMessage({
                  id: "TRANSACTION.REPORT.FILTER.DATE.START",
                })}
                defaultValue={DayJS(start)}
                value={DayJS(start)}
                onChange={(x: any) => setStart(x.toDate())}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box mt="20px">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ width: "100% " }}
                label={intl.formatMessage({
                  id: "TRANSACTION.REPORT.FILTER.DATE.END",
                })}
                defaultValue={DayJS(end)}
                value={DayJS(end)}
                onChange={(x: any) => setEnd(x.toDate())}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableCustomToolbar;
