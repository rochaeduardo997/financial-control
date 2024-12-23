import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useIntl } from "react-intl";
import UserService from "@/infra/service/User.service";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: loginType) => {
  const intl = useIntl();
  const userService = new UserService();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = async () => {
    try {
      await userService.create(name, username, email, password);
      window.location.href = "/authentication/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box>
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
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          onClick={async () => registerHandler()}
        >
          {intl.formatMessage({ id: "REGISTER.REGISTER" })}
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
