"use client";
import CategoryService from "@/infra/service/Category.service";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconCheck } from "@tabler/icons-react";
import DayJS from "dayjs";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Category from "../../../../../../../server/src/core/entity/Category";
import { TFilters } from "../../../../../../../server/src/core/repository/ReportRepository.interface";
import {
  TransactionCurrency,
  TransactionDirection,
} from "../../../../../../../server/src/core/entity/Transaction";
import Throttle from "@/utils/Throttle";

type Props = {
  onFilter: (filters: TFilters, cs: Category[]) => void;
  _categories: Category[];
  filters?: TFilters;
};

const TableCustomToolbar = ({ onFilter, filters, _categories }: Props) => {
  const intl = useIntl();
  const categoryService = new CategoryService();

  const [start, setStart] = useState(filters?.start || new Date());
  const [end, setEnd] = useState(filters?.end || new Date());

  const [direction, setDirection] = useState<TransactionDirection | undefined>(
    filters?.direction,
  );
  const [names, setNames] = useState<string[]>(filters?.names || []);
  const [valueBetween, setValueBetween] = useState<number[]>(
    filters?.valueBetween || [0, 0],
  );
  const [categoriesId, setCategoriesId] = useState<string[]>(
    filters?.categoriesId || [],
  );
  const [categories, setCategories] = useState<Category[]>(_categories || []);
  const [currency, setCurrency] = useState<TransactionCurrency>(
    filters?.currency || TransactionCurrency.BRL,
  );
  const [currencies] = useState<TransactionCurrency[]>([
    TransactionCurrency.BRL,
    TransactionCurrency.EUR,
    TransactionCurrency.GPB,
    TransactionCurrency.USD,
  ]);

  useEffect(() => {
    if (categories.length) return;
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const result = await categoryService.findAll();
      const cs: Category[] = [];
      for (const c of result)
        cs.push(new Category(c.id, c.name, c.description));
      setCategories(cs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<IconCheck />}
          onClick={() => {
            const _valueBetween = valueBetween[1] ? valueBetween : undefined;
            onFilter(
              {
                start,
                end,
                categoriesId,
                names,
                valueBetween: _valueBetween,
                direction,
                currency,
              },
              categories,
            );
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
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Box mt="20px" mb="20px">
            <Accordion>
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {intl.formatMessage({
                  id: "TRANSACTION.REPORT.FILTER.MORE_FILTERS",
                })}
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={1}>
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
                          label={intl.formatMessage({
                            id: "TRANSACTION.TABLE.DIRECTION.HEADER",
                          })}
                          onChange={(e) =>
                            setDirection(e.target.value as TransactionDirection)
                          }
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "GENERAL.DOESNT_SELECTED",
                              })}
                            </em>
                          </MenuItem>
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
                    </Grid>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 4, md: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel id="currency_label_id">
                            {intl.formatMessage({
                              id: "TRANSACTION.TABLE.CURRENCY.HEADER",
                            })}
                          </InputLabel>
                          <Select
                            labelId="categories_label_id"
                            id="demo-simple-select"
                            value={currency}
                            label={intl.formatMessage({
                              id: "TRANSACTION.TABLE.CURRENCY.HEADER",
                            })}
                            onChange={(e) =>
                              setCurrency(e.target.value as TransactionCurrency)
                            }
                          >
                            {(currencies || []).map((c) => (
                              <MenuItem key={c} value={c}>
                                {c}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                          id="value_input"
                          label={intl.formatMessage({
                            id: "TRANSACTION.REPORT.FILTER.VALUE_START",
                          })}
                          required
                          variant="outlined"
                          fullWidth
                          value={valueBetween[0]}
                          type="number"
                          onChange={(e: any) => {
                            if (/[a-zA-Z]/gi.test(e.target?.value)) return;
                            setValueBetween((prev) => {
                              const cp = [...prev];
                              const newValue = +parseFloat(
                                e.target?.value,
                              ).toFixed(2);
                              cp[0] = newValue;
                              if (cp[1] < newValue) {
                                cp[1] = newValue;
                                cp[0] = newValue;
                              }
                              return cp;
                            });
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                          id="value_input"
                          label={intl.formatMessage({
                            id: "TRANSACTION.REPORT.FILTER.VALUE_END",
                          })}
                          required
                          variant="outlined"
                          fullWidth
                          value={valueBetween[1]}
                          type="number"
                          onChange={(e: any) => {
                            if (/[a-zA-Z]/gi.test(e.target?.value)) return;
                            setValueBetween((prev) => {
                              const cp = [...prev];
                              const newValue = +parseFloat(
                                e.target?.value,
                              ).toFixed(2);
                              cp[1] = newValue;
                              if (cp[0] > newValue) {
                                cp[1] = newValue;
                                cp[0] = newValue;
                              }
                              return cp;
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Box mt="20px" mb="20px">
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box>
                        <FormControl fullWidth>
                          <InputLabel id="categories_label_id">
                            {intl.formatMessage({
                              id: "GENERAL.CATEGORIES",
                            })}
                          </InputLabel>
                          <Select
                            multiple
                            labelId="categories_label_id"
                            id="demo-simple-select"
                            value={categoriesId}
                            label={intl.formatMessage({
                              id: "GENERAL.CATEGORIES",
                            })}
                            onChange={(e) =>
                              setCategoriesId(e.target.value as [])
                            }
                          >
                            {(categories || []).map((c) => (
                              <MenuItem key={c.id} value={c.id}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box>
                        <FormControl fullWidth>
                          <Autocomplete
                            multiple
                            id="tags-outlined"
                            options={[]}
                            freeSolo
                            filterSelectedOptions
                            value={names}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={intl.formatMessage({
                                  id: "GENERAL.NAMES",
                                })}
                              />
                            )}
                            onChange={(_, value) => setNames(value)}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableCustomToolbar;
