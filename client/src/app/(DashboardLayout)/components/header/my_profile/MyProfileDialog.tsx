"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import UserService from "@/infra/service/User.service";

type Props = {
  title: string;
  open: boolean;
  onClose: Function;
};

const MyProfileDialog = ({ title, open, onClose }: Props) => {
  const intl = useIntl();

  const userService = new UserService();

  const [name, setName] = useState(localStorage.getItem("name")!);
  const [username, setUsername] = useState(localStorage.getItem("username")!);
  const [email, setEmail] = useState(localStorage.getItem("email")!);
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await userService.updateByTokenId(name, username, email, password);
      localStorage.setItem("name", name);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

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
          <Box mt="15px">
            <CustomTextField
              required
              id="outlined-required"
              label={intl.formatMessage({ id: "GENERAL.NAME" })}
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </Box>
          <Box mt="25px">
            <CustomTextField
              required
              id="outlined-required"
              label={intl.formatMessage({ id: "GENERAL.USERNAME" })}
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </Box>
          <Box mt="25px">
            <CustomTextField
              required
              id="outlined-required"
              label={intl.formatMessage({ id: "GENERAL.EMAIL" })}
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </Box>
          <Box mt="25px">
            <CustomTextField
              required
              type="password"
              id="outlined-required"
              label={intl.formatMessage({ id: "GENERAL.PASSWORD" })}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          ></Stack>
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

export default MyProfileDialog;
