/* eslint-disable quotes */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
});

const formatDate = (date) => {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
};

class RegisterComp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      birthday: formatDate(Date()),
      gender: 'undeclared',
      username: '',
      password: '',
      address: '',
      phone: '',
      usertype: 'eval',
    };

    this.genders = [
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

    this.months = ['월'];
    for (let i = 1; i <= 12; i++) this.months.push(i);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserType = this.handleUserType.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.gender === 'undeclared') {
      window.alert('성별을 선택해주세요');
      return;
    }

    this.props.onRegister({ ...this.state }).then((result) => {
      if (!result) {
        // to be filled.
      }
    });
  }

  handleUserType(usertype) {
    return () => {
      this.setState({
        usertype: usertype === 'eval' ? 'eval' : 'submit',
      });
    };
  }

  render() {
    const { classes } = this.props;
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
          <form className={classes.form} onSubmit={this.handleSubmit}>
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
                  onChange={this.handleChange}
                  value={this.state.name}
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
                  onChange={this.handleChange}
                  value={this.state.birthday}
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
                  onChange={this.handleChange}
                  value={this.state.gender}
                >
                  {this.genders.map((option) => (
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
                  onChange={this.handleChange}
                  value={this.state.username}
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
                  onChange={this.handleChange}
                  value={this.state.password}
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
                  onChange={this.handleChange}
                  value={this.state.address}
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
                  onChange={this.handleChange}
                  value={this.state.phone}
                />
              </Grid>

              <Grid item sm={12}>
                <Box mt={1}>유저 역할 선택</Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  raised={this.state.usertype === 'eval'}
                  onClick={this.handleUserType('eval')}
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
                  raised={this.state.usertype === 'submit'}
                  onClick={this.handleUserType('submit')}
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
                <Link href="/login" variant="body2">
                  로그인
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(RegisterComp);
