"use client";
import TransactionService from "@/infra/service/Transaction.service";
import { IconButton } from "@mui/material";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Transaction from "../../../../../../../server/src/core/entity/Transaction";
import TransactionDialog from "../overview/TransactionDialog";

type Props = { id: string };

const MoreInformations = ({ id }: Props) => {
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
          title={intl.formatMessage({ id: "GENERAL.VIEWING" })}
          transaction={transaction}
          open={open}
          onClose={() => setOpen(false)}
          onlyRead
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
        color="primary"
      >
        <IconEye />
      </IconButton>
    </Fragment>
  );
};

export default MoreInformations;
