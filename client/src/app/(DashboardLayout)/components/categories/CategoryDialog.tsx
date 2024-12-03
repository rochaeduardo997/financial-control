"use client";
import CategoryService from "@/infra/service/Category.service";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  TextField,
} from "@mui/material";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Category from "../../../../../../server/src/core/entity/Category";
import CustomTextField from "../forms/theme-elements/CustomTextField";

type Props = {
  title: string;
  category?: Category;
  open: boolean;
  onClose: Function;
};

const CategoryDialog = ({ title, category, open, onClose }: Props) => {
  const intl = useIntl();

  const categoryService = new CategoryService();

  const [id, _] = useState(category?.id || "");
  const [name, setName] = useState(category?.name || "");
  const [nameHasError, setNameHasError] = useState(false);
  const [description, setDescription] = useState(category?.description || "");

  const canSubmit = () => {
    const nameHas = name.length <= 0;

    setNameHasError(nameHas);

    return !nameHas;
  };

  const onSubmit = async () => {
    try {
      if (!canSubmit()) return;
      const category = new Category(id, name, description);
      id
        ? await categoryService.updateBy(id, category)
        : await categoryService.create(category);
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
            <Grid size={{ xs: 12, md: 12 }}>
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

export default CategoryDialog;
