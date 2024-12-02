"use client";
import { useIntl } from "react-intl";
import { Fragment, useState } from "react";
import {
  Grid2 as Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import DayJS from "dayjs";
import { IconCheck, IconX } from "@tabler/icons-react";
import TransactionService from "@/infra/service/Transaction.service";
import Transaction, {
  TransactionDirection,
} from "../../../../../../../server/src/core/entity/Transaction";

type Props = { title: string; open: boolean; onClose: Function };

const TransactionDialog = ({ title, open, onClose }: Props) => {
  const intl = useIntl();

  const transactionService = new TransactionService();

  const [name, setName] = useState("");
  const [nameHasError, setNameHasError] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [valueHasError, setValueHasError] = useState(false);
  const [direction, setDirection] = useState<TransactionDirection>(
    TransactionDirection.IN,
  );
  const [when, setWhen] = useState(new Date());

  const canSubmit = () => {
    const nameHas = name.length <= 0;
    const valueHas = value <= 0;

    setNameHasError(nameHas);
    setValueHasError(valueHas);

    return !nameHas && !valueHas;
  };

  const onSubmit = async () => {
    try {
      if (!canSubmit()) return;
      const transaction = new Transaction("id", name, value, direction, when);
      await transactionService.create(transaction);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const nameFieldHasError = nameHasError
    ? {
        error: true,
        helperText: intl.formatMessage({ id: "GENERAL.ERROR.REQUIRED" }),
      }
    : {};

  const valueFieldHasError = valueHasError
    ? {
        error: true,
        helperText: intl.formatMessage({ id: "GENERAL.ERROR.REQUIRED" }),
      }
    : {};

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={(_) => onClose()}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
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
                    onChange={(e) =>
                      setDirection(e.target.value as TransactionDirection)
                    }
                  >
                    <MenuItem value={TransactionDirection.IN}>
                      {intl.formatMessage({
                        id: "TRANSACTION.TABLE.DIRECTION.VALUE.IN",
                      })}
                    </MenuItem>
                    <MenuItem value={TransactionDirection.OUT}>
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
                  id="name_input"
                  required
                  label={intl.formatMessage({
                    id: "TRANSACTION.TABLE.NAME.HEADER",
                  })}
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  {...nameFieldHasError}
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
                  {...valueFieldHasError}
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
        </DialogContent>

        <DialogActions>
          <Button
            startIcon={<IconCheck />}
            onClick={() => onSubmit()}
            color="success"
          >
            {intl.formatMessage({ id: "GENERAL.SAVE" })}
          </Button>
          <Button startIcon={<IconX />} onClick={() => onClose()} color="error">
            {intl.formatMessage({ id: "GENERAL.CANCEL" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default TransactionDialog;
