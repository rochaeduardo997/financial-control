"use client";
import TransactionService from "@/infra/service/Transaction.service";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconCheck, IconX } from "@tabler/icons-react";
import DayJS from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Transaction, {
  TransactionCurrency,
  TransactionDirection,
} from "../../../../../../../server/src/core/entity/Transaction";
import Category from "../../../../../../../server/src/core/entity/Category";
import CategoryService from "@/infra/service/Category.service";

type Props = {
  title: string;
  transaction?: Transaction;
  open: boolean;
  onClose: Function;
  onlyRead?: boolean;
};

const TransactionDialog = ({
  title,
  transaction,
  open,
  onClose,
  onlyRead = false,
}: Props) => {
  const intl = useIntl();

  const transactionService = new TransactionService();
  const categoryService = new CategoryService();

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
  const [categoriesId, setCategoriesId] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencies] = useState<TransactionCurrency[]>([
    TransactionCurrency.BRL,
    TransactionCurrency.EUR,
    TransactionCurrency.GPB,
    TransactionCurrency.USD,
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState<TransactionCurrency>(
    transaction?.currency || TransactionCurrency.BRL,
  );

  useEffect(() => {
    getCategories();
  }, []);

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
        selectedCurrency,
      );
      console.log(transaction);
      for (const categoryId of categoriesId) {
        transaction.associateCategory(new Category(categoryId, "name"));
      }
      id
        ? await transactionService.updateBy(id, transaction)
        : await transactionService.create(transaction);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategories = async () => {
    try {
      const result = await categoryService.findAll();
      const cs: Category[] = [];
      for (const c of result)
        cs.push(new Category(c.id, c.name, c.description));
      setCategories(cs);

      const csId = (transaction?.categories || []).map((c) => c.id);
      setCategoriesId(csId);
    } catch (err) {
      console.error(err);
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
                    disabled={onlyRead}
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
                <TextField
                  disabled={onlyRead}
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
            <Grid size={{ xs: 12, md: 5 }}>
              <Box mt="15px">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    disabled={onlyRead}
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
            <Grid size={{ xs: 4, md: 2 }}>
              <Box mt="15px">
                <FormControl fullWidth>
                  <InputLabel id="currency_label_id">
                    {intl.formatMessage({
                      id: "TRANSACTION.TABLE.CURRENCY.HEADER",
                    })}
                  </InputLabel>
                  <Select
                    disabled={onlyRead}
                    labelId="categories_label_id"
                    id="demo-simple-select"
                    value={selectedCurrency}
                    label={intl.formatMessage({
                      id: "TRANSACTION.TABLE.CURRENCY.HEADER",
                    })}
                    onChange={(e) =>
                      setSelectedCurrency(e.target.value as TransactionCurrency)
                    }
                  >
                    {(currencies || []).map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid size={{ xs: 8, md: 5 }}>
              <Box mt="15px">
                <TextField
                  disabled={onlyRead}
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
                  disabled={onlyRead}
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
          <Box mt="15px">
            <FormControl fullWidth>
              <InputLabel id="categories_label_id">
                {intl.formatMessage({
                  id: "GENERAL.CATEGORIES",
                })}
              </InputLabel>
              <Select
                disabled={onlyRead}
                multiple
                labelId="categories_label_id"
                id="demo-simple-select"
                value={categoriesId}
                label={intl.formatMessage({
                  id: "GENERAL.CATEGORIES",
                })}
                onChange={(e) => setCategoriesId(e.target.value as [])}
              >
                {(categories || []).map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          {!onlyRead ? (
            <Button
              startIcon={<IconCheck />}
              onClick={() => onSubmit()}
              color="success"
            >
              {intl.formatMessage({ id: "GENERAL.SAVE" })}
            </Button>
          ) : (
            <></>
          )}
          <Button startIcon={<IconX />} onClick={() => onClose()} color="error">
            {intl.formatMessage({ id: "GENERAL.CANCEL" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default TransactionDialog;
