"use client";
import { IconButton } from "@mui/material";
import { IconTrash } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import DefaultDeleteDialog from "../../shared/DefaultDeleteDialog";
import { useIntl } from "react-intl";
import TransactionService from "@/infra/service/Transaction.service";

type Props = { id: string; name: string; value: number; onClose: Function };

const DeleteButton = ({ id, name, value, onClose }: Props) => {
  const intl = useIntl();
  const transactionService = new TransactionService();

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      await transactionService.deleteBy(id);
      setOpen(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <Fragment>
      {open ? (
        <DefaultDeleteDialog
          title={intl.formatMessage({ id: "GENERAL.DELETE" })}
          content={
            <Fragment>
              <p>
                {intl.formatMessage({ id: "TRANSACTION.DELETE.NAME" })}:{" "}
                <strong>{name}</strong>
              </p>
              <p>
                {intl.formatMessage({ id: "TRANSACTION.DELETE.VALUE" })}:{" "}
                <strong>{`R$ ${value.toFixed(2)}`}</strong>
              </p>
            </Fragment>
          }
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={() => onSubmit()}
        />
      ) : (
        <></>
      )}
      <IconButton
        onClick={() => setOpen(!open)}
        aria-label="delete"
        color="error"
      >
        <IconTrash />
      </IconButton>
    </Fragment>
  );
};

export default DeleteButton;
