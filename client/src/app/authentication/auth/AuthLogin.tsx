import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useIntl } from "react-intl";
import LoginService from "@/infra/service/Login.service";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const intl = useIntl();
  const loginService = new LoginService();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    try {
      const result = (await loginService.login(login, password)) as any;
      for (const field in result) localStorage.setItem(field, result[field]);
      window.location.href = "/";
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
            label={intl.formatMessage({ id: "GENERAL.LOGIN.USERNAME_EMAIL" })}
            variant="outlined"
            fullWidth
            value={login}
            onChange={(e: any) => setLogin(e.target.value)}
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
        >
          <Typography
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            {intl.formatMessage({ id: "LOGIN.FORGOT_PASSWORD" })}
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          onClick={async () => loginHandler()}
        >
          {intl.formatMessage({ id: "LOGIN.SIGN_IN" })}
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
