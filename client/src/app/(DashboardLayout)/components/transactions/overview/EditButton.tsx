"use client";
import TransactionService from "@/infra/service/Transaction.service";
import { IconButton } from "@mui/material";
import { IconPencil } from "@tabler/icons-react";
import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Transaction from "../../../../../../../server/src/core/entity/Transaction";
import TransactionDialog from "./TransactionDialog";

type Props = {
  id: string;
  onClose: Function;
};

const EditButton = ({ id, onClose }: Props) => {
  const intl = useIntl();
  const transactionService = new TransactionService();

  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState<Transaction>();

  const getTransaction = async () => {
    try {
      const result = await transactionService.findBy(id);
      setTransaction(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      {open ? (
        <TransactionDialog
          title={intl.formatMessage({ id: "GENERAL.EDIT" })}
          transaction={transaction}
          open={open}
          onClose={() => {
            setOpen(false);
            onClose();
          }}
        />
      ) : (
        <></>
      )}
      <IconButton
        onClick={async () => {
          await getTransaction();
          setOpen(!open);
        }}
        aria-label="edit"
        color="warning"
      >
        <IconPencil />
      </IconButton>
    </Fragment>
  );
};

export default EditButton;
