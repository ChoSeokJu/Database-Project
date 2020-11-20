/* eslint-disable quotes */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
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

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/authentication';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.primary.main,
  },
  text: {
    marginTop: theme.spacing(1),
  },
}));

const formatDate = (date) => {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
};

function Register(props) {
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

  const months = ['월'];
  for (let i = 1; i <= 12; i++) months.push(i);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(formatDate(Date()));
  const [gender, setGender] = useState('undeclared');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('eval');

  const [successful, setSuccessful] = useState(false);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const onNameChange = (e) => setName(e.target.value);
  const onBirthdayChange = (e) => setBirthday(e.target.value);
  const onGenderChange = (e) => setGender(e.target.value);
  const onUsernameChange = (e) => setUsername(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  const onAddressChange = (e) => setAddress(e.target.value);
  const onPhoneChange = (e) => setPhone(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gender === 'undeclared') {
      window.alert('성별을 선택해주세요');
    }

    const data = {
      name, birthday, gender, username, password, address, phone, userType,
    };

    setSuccessful(false);

    dispatch(register(data))
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  const handleUserType = (ut) => () => {
    setUserType(ut === 'eval' ? 'eval' : 'submit');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <GroupAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
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
                onChange={onNameChange}
                value={name}
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
                onChange={onBirthdayChange}
                value={birthday}
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
                onChange={onGenderChange}
                value={gender}
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
                required
                fullWidth
                id="username"
                label="아이디"
                autoComplete="username"
                name="username"
                onChange={onUsernameChange}
                value={username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="패스워드"
                type="password"
                id="password"
                autoComplete="current-password"
                name="password"
                onChange={onPasswordChange}
                value={password}
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

            <Grid item sm={12}>
              <Box mt={1}>유저 역할 선택</Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                raised={userType === 'eval'}
                onClick={handleUserType('eval')}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      평가자
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      다른 회원들이 제출한 파일들을 평가합니다.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                raised={userType === 'submit'}
                onClick={handleUserType('submit')}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      제출자
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      태스크에 맞는 데이터를 제출하고 평가받습니다.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            가입하기
          </Button>

          <Grid container>
            <Grid item>
              계정이 이미 있습니까?&nbsp;
              <Link to="/login">
                로그인
              </Link>
            </Grid>
          </Grid>
        </form>
        {message && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={(successful) ? "success" : "error"}>
              {message}
            </MuiAlert>
          </Snackbar>
        )}
      </div>
    </Container>
  );
}

export default Register;
