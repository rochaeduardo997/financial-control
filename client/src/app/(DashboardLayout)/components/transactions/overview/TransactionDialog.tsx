"use client";
import TransactionService from "@/infra/service/Transaction.service";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconCheck, IconX } from "@tabler/icons-react";
import DayJS from "dayjs";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Transaction, {
  TransactionDirection,
} from "../../../../../../../server/src/core/entity/Transaction";
import CustomTextField from "../../forms/theme-elements/CustomTextField";

type Props = {
  title: string;
  transaction?: Transaction;
  open: boolean;
  onClose: Function;
};

const TransactionDialog = ({ title, transaction, open, onClose }: Props) => {
  const intl = useIntl();

  const transactionService = new TransactionService();

  const [id, _] = useState(transaction?.id || "");
  const [name, setName] = useState(transaction?.name || "");
  const [nameHasError, setNameHasError] = useState(false);
  const [value, setValue] = useState<number | undefined>(transaction?.value);
  const [valueHasError, setValueHasError] = useState(false);
  const [direction, setDirection] = useState<TransactionDirection>(
    transaction?.direction || TransactionDirection.IN,
  );
  const [when, setWhen] = useState(transaction?.when || new Date());
  const [description, setDescription] = useState(transaction?.description);

  const canSubmit = () => {
    const nameHas = name.length <= 0;
    const valueHas = (value || 0) <= 0;

    setNameHasError(nameHas);
    setValueHasError(valueHas);

    return !nameHas && !valueHas;
  };

  const onSubmit = async () => {
    try {
      if (!canSubmit()) return;
      const transaction = new Transaction(
        id,
        name,
        value!,
        direction,
        when,
        undefined,
        undefined,
        undefined,
        description,
      );
      id
        ? await transactionService.updateBy(id, transaction)
        : await transactionService.create(transaction);
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
            <Grid size={{ xs: 12, md: 7 }}>
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
            <Grid size={{ xs: 12, md: 5 }}>
              <Box mt="15px">
                <TextField
                  id="value_input"
                  label={intl.formatMessage({
                    id: "TRANSACTION.TABLE.VALUE.HEADER",
                  })}
                  required
                  variant="outlined"
                  fullWidth
                  value={value}
                  type="number"
                  onChange={(e: any) => {
                    if (/[a-zA-Z]/gi.test(e.target?.value)) return;
                    setValue(+parseFloat(e.target?.value).toFixed(2));
                  }}
                  {...valueFieldHasError}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box mt="15px">
                <TextField
                  id="description_input"
                  label={intl.formatMessage({
                    id: "TRANSACTION.DIALOG.DESCRIPTION",
                  })}
                  variant="outlined"
                  fullWidth
                  value={description}
                  multiline
                  rows={3}
                  onChange={(e: any) => setDescription(e.target.value)}
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
