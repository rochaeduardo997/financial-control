"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useIntl } from "react-intl";

type Props = { title: string; children?: JSX.Element };

const BlankNewButton = ({ title, children }: Props) => {
  const intl = useIntl();

  const [open, setOpen] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={(_) => setOpen(!open)}
        aria-labelledby="modal-modal-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button color="success">
            {intl.formatMessage({ id: "GENERAL.SAVE" })}
          </Button>
          <Button color="error">
            {intl.formatMessage({ id: "GENERAL.CANCEL" })}
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="outlined"
        color="success"
        startIcon={<IconPlus />}
        onClick={(_) => setOpen(!open)}
      >
        {intl.formatMessage({ id: "GENERAL.NEW" })}
      </Button>
    </div>
  );
};

export default BlankNewButton;
