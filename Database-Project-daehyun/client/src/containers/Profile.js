/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Slide from '@material-ui/core/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { ButtonBase } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { register, logout } from '../actions/authentication';
import { getUser, postUser } from '../services/user.service';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 1),
    backgroundColor: theme.palette.primary.main,
  },
  button: {
    margin: theme.spacing(1, 0, 1),
  },
  text: {
    marginTop: theme.spacing(1),
  },
}));

export default function Profile(props) {
  const genders = [
    {
      value: 'undeclared',
      label: '성별',
    },
    {
      value: 'male',
      label: '남자',
    },
    {
      value: 'female',
      label: '여자',
    },
  ];

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('undeclared');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const onClickWithdrawal = () => {
    setDialogOpen(true);
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alert, setAlert] = useState('');
  const [alertStyle, setAlertStyle] = useState(true);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const onPasswordChange = (e) => setPassword(e.target.value);
  const onAddressChange = (e) => setAddress(e.target.value);
  const onPhoneChange = (e) => setPhone(e.target.value);

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const getUserInfo = () => {
    getUser('/info').then((response) => {
      const { data } = response;

      setName(data.Name);
      setBirthday(data.Bdate && data.Bdate.split('T')[0]);
      setGender(data.Gender);
      setUsername(data.ID);
      setAddress(data.Addr);
      setPhone(data.PhoneNo);
    });
  };

  useEffect(getUserInfo, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    postUser('/modify', {
      address,
      phone,
    }).then((response) => {
      setAlert(response.data.message);
      setAlertOpen(true);
      setAlertStyle(true);
      getUserInfo();
    });
  };

  const handleWithdrawal = () => {
    getUser('/withdrawal').then(
      (response) => {
        dispatch(logout());
        history.push('/');
      },
      (error) => {
        setAlert(error.response.data.message);
        setAlertOpen(true);
        setAlertStyle(false);
      }
    );
  };

  const handlePasswordChange = () => {
    postUser('/password', {
      password,
    }).then(
      (response) => {
        setAlert(response.data.message);
        setAlertOpen(true);
        setAlertStyle(true);
        setPassword('');
      },
      (error) => {
        setAlert(error.response.data.message);
        setAlertOpen(true);
        setAlertStyle(false);
        setPassword('');
      }
    );
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="이름"
                  autoFocus
                  name="name"
                  value={name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="birthday"
                  label="생년월일"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  name="birthday"
                  value={birthday}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  required
                  label="성별"
                  fullWidth
                  variant="outlined"
                  name="gender"
                  value={gender}
                  InputProps={{
                    readOnly: true,
                  }}
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="username"
                  label="아이디"
                  autoComplete="username"
                  name="username"
                  value={username}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="패스워드"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  name="password"
                  onChange={onPasswordChange}
                  value={password}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="비밀번호 변경">
                        <IconButton
                          color="inherit"
                          position="absolute"
                          onClick={handlePasswordChange}
                        >
                          <BorderColorIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="address"
                  label="주소"
                  id="address"
                  autoComplete="address"
                  name="address"
                  onChange={onAddressChange}
                  value={address}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  label="전화번호"
                  id="phone"
                  autoComplete="phone"
                  name="phone"
                  onChange={onPhoneChange}
                  value={phone}
                />
              </Grid>
            </Grid>
            <Grid />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              회원정보 변경
            </Button>
            <Divider variant="middle" />
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={onClickWithdrawal}
            >
              회원탈퇴
            </Button>
          </form>
          <Dialog
            open={dialogOpen}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">회원탈퇴</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                회원탈퇴시 이전 태스크 참여 및 평가 기록은 모두 삭제됩니다.
                <br />
                탈퇴를 진행하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                취소
              </Button>
              <Button onClick={handleWithdrawal} color="secondary">
                탈퇴
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleAlertClose}
              severity={alertStyle ? 'success' : 'error'}
            >
              {alert}
            </MuiAlert>
          </Snackbar>
        </div>
      </Container>
      );
    </>
  );
}
