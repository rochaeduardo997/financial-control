"use client";
import {
  Box,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DayJS from "dayjs";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import CustomTextField from "../../forms/theme-elements/CustomTextField";

const DialogFields = () => {
  const intl = useIntl();

  const [name, setName] = useState("");
  const [value, setValue] = useState<number>();
  const [direction, setDirection] = useState<string>("in");
  const [when, setWhen] = useState(new Date());

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box mt="15px">
            <FormControl fullWidth>
              <InputLabel id="direction_input_label">
                {intl.formatMessage({
                  id: "TRANSACTION.TABLE.DIRECTION.HEADER",
                })}
              </InputLabel>
              <Select
                labelId="direction_input_label"
                id="direction_input"
                value={direction}
                required
                label="Age"
                onChange={(e) => setDirection(e.target.value as string)}
              >
                <MenuItem value={"in"}>
                  {intl.formatMessage({
                    id: "TRANSACTION.TABLE.DIRECTION.VALUE.IN",
                  })}
                </MenuItem>
                <MenuItem value={"out"}>
                  {intl.formatMessage({
                    id: "TRANSACTION.TABLE.DIRECTION.VALUE.OUT",
                  })}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box mt="15px">
            <CustomTextField
              required
              id="name_input"
              label={intl.formatMessage({
                id: "TRANSACTION.TABLE.NAME.HEADER",
              })}
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box mt="15px">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ width: "100% " }}
                label={intl.formatMessage({
                  id: "TRANSACTION.TABLE.WHEN.HEADER",
                })}
                defaultValue={DayJS(when)}
                value={DayJS(when)}
                onChange={(x: any) => setWhen(x.toDate())}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box mt="15px">
            <TextField
              required
              id="value_input"
              label={intl.formatMessage({
                id: "TRANSACTION.TABLE.VALUE.HEADER",
              })}
              variant="outlined"
              fullWidth
              value={value}
              onChange={(e: any) => {
                if (/[a-zA-Z]/gi.test(e.target?.value)) return;
                setValue(e.target.value);
              }}
            />
          </Box>
        </Grid>
      </Grid>
      {/* <Box mt="15px">
        <Divider textAlign="left">
          {intl.formatMessage({
            id: "GENERAL.CATEGORIES",
          })}
        </Divider>
      </Box> */}
    </Fragment>
  );
};

export default DialogFields;
