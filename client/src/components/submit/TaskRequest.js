import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function TaskRequest() {
  const classes = useStyles();

  const [tasktitle, setTasktitle] = useState('');
  const [taskcontent, setTaskcontent] = useState('');

  const onTasktitleChange = (e) => {
    setTasktitle(e.target.value);
  };

  const onTaskcontentChange = (e) => {
    setTaskcontent(e.target.value);
  };

  const handleSubmit = (e) => {
    alert('태스크를 요청하시겠습니까?');
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4" align="left">
            태스크 요청
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="tasktitle"
              placeholder="태스크 제목"
              name="tasktitle"
              autoComplete="tasktitle"
              autoFocus
              onChange={onTasktitleChange}
              value={tasktitle}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="taskcontent"
              name="taskcontent"
              autoComplete="taskcontent"
              onChange={onTaskcontentChange}
              value={taskcontent}
              placeholder={`태스크 설명을 입력해주세요.${'\n\n'}- 데이터 개요${'\n'}- 데이터 제출 최소 주기${'\n'}- 데이터 스키마${'\n'}- 기타`}
              multiline
              rows={7}
            />
            <Grid container justify="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                확인
              </Button>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
}
