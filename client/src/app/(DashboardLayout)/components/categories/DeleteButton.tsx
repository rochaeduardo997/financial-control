"use client";
import CategoryService from "@/infra/service/Category.service";
import { IconButton } from "@mui/material";
import { IconTrash } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import DefaultDeleteDialog from "../shared/DefaultDeleteDialog";

type Props = { id: string; name: string; value: number; onClose: Function };

const DeleteButton = ({ id, name, value, onClose }: Props) => {
  const intl = useIntl();
  const categoryService = new CategoryService();

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      await categoryService.deleteBy(id);
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
                {intl.formatMessage({ id: "CATEGORY.DELETE.NAME" })}:{" "}
                <strong>{name}</strong>
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
