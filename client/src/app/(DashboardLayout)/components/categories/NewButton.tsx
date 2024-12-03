"use client";
import { Button } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import CategoryDialog from "./CategoryDialog";

type Props = { onClose: Function };

const NewButton = ({ onClose }: Props) => {
  const intl = useIntl();

  const [open, setOpen] = useState(false);

  return (
    <div>
      {open ? (
        <CategoryDialog
          title={intl.formatMessage({ id: "GENERAL.NEW" })}
          open={open}
          onClose={() => {
            setOpen(false);
            onClose();
          }}
        />
      ) : (
        <></>
      )}

      <Button
        variant="outlined"
        color="success"
        startIcon={<IconPlus />}
        onClick={() => setOpen(true)}
      >
        {intl.formatMessage({ id: "GENERAL.NEW" })}
      </Button>
    </div>
  );
};

export default NewButton;
