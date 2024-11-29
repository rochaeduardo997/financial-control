"use client";
import { useIntl } from "react-intl";
import BlankNewButton from "../../shared/BlankNewButton";
import DialogFields from "./DialogFields";

const NewButton = () => {
  const intl = useIntl();

  return (
    <BlankNewButton title={intl.formatMessage({ id: "GENERAL.NEW" })}>
      <DialogFields />
    </BlankNewButton>
  );
};

export default NewButton;
