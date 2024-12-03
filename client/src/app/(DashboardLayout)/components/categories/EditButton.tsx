"use client";
import CategoryService from "@/infra/service/Category.service";
import { IconButton } from "@mui/material";
import { IconPencil } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Category from "../../../../../../server/src/core/entity/Category";
import CategoryDialog from "./CategoryDialog";

type Props = {
  id: string;
  onClose: Function;
};

const EditButton = ({ id, onClose }: Props) => {
  const intl = useIntl();
  const categoryService = new CategoryService();

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>();

  const getCategory = async () => {
    try {
      const result = await categoryService.findBy(id);
      setCategory(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      {open ? (
        <CategoryDialog
          title={intl.formatMessage({ id: "GENERAL.EDIT" })}
          category={category}
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
          await getCategory();
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
