/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CreateIcon from '@material-ui/icons/Create';
import BackupIcon from '@material-ui/icons/Backup';
import { useHistory } from 'react-router-dom';
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
    paddingBottom: theme.spacing(4),
  },
  divider: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
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
  const history = useHistory();

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

  const onLogoClick = () => {
    history.push('/');
  };

  const onMypageClick = () => {
    setAnchorEl(null);
    history.push('/profile');
  };

  const onLogoutClick = () => {
    setAnchorEl(null);
    dispatch(logout());
    history.push('/');
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
    <>
      <SupervisorAccountIcon className={classes.icon} />
      <Typography color="inherit">관리자</Typography>
      <Divider orientation="vertical" flexItem className={classes.divider} />
      <Button size="large" color="inherit" onClick={() => history.push('/')}>
        태스크 목록
      </Button>
      <Button
        size="large"
        color="inherit"
        onClick={() => history.push('/admin/user')}
      >
        회원 관리
      </Button>

      <Button
        size="large"
        color="inherit"
        onClick={() => history.push('/admin/requests')}
      >
        태스크 요청 게시판
      </Button>
    </>
  );

  const evalBoard = (
    <>
      <CreateIcon className={classes.icon} />
      <Typography color="inherit">평가자</Typography>
      <Divider orientation="vertical" flexItem className={classes.divider} />
      <Button size="large" color="inherit" onClick={() => history.push('/')}>
        태스크 목록
      </Button>
      <Button
        size="large"
        color="inherit"
        onClick={() => history.push('/eval/task')}
      >
        태스크 요청
      </Button>
    </>
  );

  const submitBoard = (
    <>
      <BackupIcon className={classes.icon} />
      <Typography color="inherit">제출자</Typography>
      <Divider orientation="vertical" flexItem className={classes.divider} />
      <Button size="large" color="inherit" onClick={() => history.push('/')}>
        태스크 목록
      </Button>
      <Button
        size="large"
        color="inherit"
        onClick={() => history.push('/submit/task')}
      >
        태스크 요청
      </Button>
    </>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Button size="small" color="inherit" onClick={onLogoClick}>
            <Typography variant="h5">FREESWOT</Typography>
          </Button>
          <div className={classes.grow} />
          {showAdminBoard && adminBoard}
          {showEvalBoard && evalBoard}
          {showSubmitBoard && submitBoard}
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
