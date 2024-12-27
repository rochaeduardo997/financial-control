import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useIntl } from "react-intl";
import { IconUser } from "@tabler/icons-react";
import LogoutService from "@/infra/service/Logout.service";
import CategoryDialog from "../../components/categories/CategoryDialog";
import MyProfileDialog from "../../components/header/my_profile/MyProfileDialog";

const Profile = () => {
  const intl = useIntl();
  const logoutService = new LogoutService();

  const [myProfileDialog, setMyProfileDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutService.logout();
      localStorage.clear();
      window.location.href = "/authentication/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText onClick={() => setMyProfileDialog(true)}>
            {intl.formatMessage({ id: "GENERAL.MY_PROFILE" })}
          </ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleLogout}
          >
            {intl.formatMessage({ id: "GENERAL.LOGOUT" })}
          </Button>
        </Box>
      </Menu>

      {myProfileDialog ? (
        <MyProfileDialog
          title={intl.formatMessage({ id: "GENERAL.EDIT" })}
          open={myProfileDialog}
          onClose={() => setMyProfileDialog(false)}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Profile;
