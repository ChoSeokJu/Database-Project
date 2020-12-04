/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { postUser } from '../services/user.service';
import {
  setMessage,
  openAlert,
  setAlertType,
  openDialog,
} from '../actions/message';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function TaskRequest({ readOnly = false, title, content }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState('');

  useEffect(() => {
    if (readOnly) {
      setTaskTitle(title);
      setTaskContent(content);
    }
  }, [readOnly, title, content]);

  const onTasktitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const onTaskcontentChange = (e) => {
    setTaskContent(e.target.value);
  };

  // TODO: 완료! 태스크 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postUser('/request-task', {
        title: taskTitle,
        content: taskContent,
      });
      setTaskTitle('');
      setTaskContent('');
      dispatch(setAlertType('success'));
      dispatch(setMessage('태스크를 요청했습니다'));
      dispatch(openAlert());
    } catch (error) {
      dispatch(setAlertType('error'));
      dispatch(setMessage(error.message));
      dispatch(openAlert());
    }
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4" align="left">
          {!readOnly && '태스크 요청'}
        </Typography>
        <form onSubmit={handleSubmit}>
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
            value={taskTitle}
            InputProps={{
              readOnly,
            }}
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
            value={taskContent}
            placeholder={`태스크 설명을 입력해주세요.${'\n\n'}- 데이터 개요${'\n'}- 데이터 제출 최소 주기${'\n'}- 데이터 스키마${'\n'}- 기타`}
            multiline
            rows={10}
            InputProps={{
              readOnly,
            }}
          />
          {!readOnly && (
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
          )}
        </form>
      </Container>
    </>
  );
}
