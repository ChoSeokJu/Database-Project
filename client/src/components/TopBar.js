/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Link from '@material-ui/core/Link';

import { logout } from '../actions/authentication';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  inputRoot: {
    color: 'inherit',
  },
  menuBar: {
    paddingBottom: theme.spacing(3),
  },
}));

export default function TopBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showEvalBoard, setShowEvalBoard] = useState(false);
  const [showSubmitBoard, setShowSubmitBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (currentUser) {
      setShowAdminBoard(currentUser.role === 'admin');
      setShowEvalBoard(currentUser.role === 'eval');
      setShowSubmitBoard(currentUser.role === 'submit');
    }
  }, [currentUser]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onMypageClick = () => {
    setAnchorEl(null);
    props.history.push('/profile');
  };

  const onLogoutClick = () => {
    setAnchorEl(null);
    dispatch(logout());
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem name="mypage" onClick={onMypageClick}>
        마이페이지
      </MenuItem>
      <MenuItem name="logout" onClick={onLogoutClick}>
        로그아웃
      </MenuItem>
    </Menu>
  );

  const adminBoard = (
    <p>Admin</p>
  );

  const evalBoard = (
    <p>Eval</p>
  );

  const submitBoard = (
    <p>Submit</p>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Link
            component="button"
            variant="h6"
            color="inherit"
            onClick={props.onLogoClick}
          >
            FREESWOT
          </Link>
          <div className={classes.grow} />
          <div>
            {showAdminBoard && adminBoard}
            {showEvalBoard && evalBoard}
            {showSubmitBoard && submitBoard}
          </div>
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.menuBar} />
      {renderMenu}
    </div>
  );
}
