"use client";
import CategoryService from "@/infra/service/Category.service";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
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

type Props = {
  onFilter: (filters: TFilters) => void;
};

const TableCustomToolbar = ({ onFilter }: Props) => {
  const intl = useIntl();
  const categoryService = new CategoryService();

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [categoriesId, setCategoriesId] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
            onFilter({ start, end, categoriesId });
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
                          multiline
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
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableCustomToolbar;
