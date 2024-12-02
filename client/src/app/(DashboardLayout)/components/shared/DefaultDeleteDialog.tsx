"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Fragment } from "react";
import { useIntl } from "react-intl";

type Props = {
  title: string;
  content?: JSX.Element;
  open: boolean;
  onClose: Function;
  onSubmit: Function;
};

const DefaultDeleteDialog = ({
  title,
  content,
  open,
  onClose,
  onSubmit,
}: Props) => {
  const intl = useIntl();

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
        <DialogContent>{content}</DialogContent>

        <DialogActions>
          <Button
            startIcon={<IconCheck />}
            onClick={() => onSubmit()}
            color="success"
          >
            {intl.formatMessage({ id: "GENERAL.DELETE" })}
          </Button>
          <Button startIcon={<IconX />} onClick={() => onClose()} color="error">
            {intl.formatMessage({ id: "GENERAL.CANCEL" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DefaultDeleteDialog;
