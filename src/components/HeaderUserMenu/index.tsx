import { FC } from 'react';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface Props {
  user: NonNullable<Session['user']>;
}

const HeaderUserMenu: FC<Props> = (props) => {
  const { user } = props;

  const { id, name, image } = user;

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${id}_settings`,
  });
  const { isOpen, close } = popupState;

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton {...bindTrigger(popupState)}>
          <Avatar>
            {image ? (
              <Image src={image} alt={`${name} picture`} fill />
            ) : (
              <DirectionsCarIcon />
            )}
          </Avatar>
          {isOpen ? (
            <ArrowDropUpIcon color="primary" />
          ) : (
            <ArrowDropDownIcon color="primary" />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...bindMenu(popupState)}
        onClick={close}
      >
        <Link href="/account">
          <MenuItem component="a">
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Account</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Link href="/account">
          <MenuItem component="a">
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Administrator</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderUserMenu;
