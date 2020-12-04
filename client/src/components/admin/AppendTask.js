/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AppendTaskForm from './AppendTaskForm';
import AppendOGDataType from './AppendOGDataType';
import { clearTaskData } from '../../actions/taskData';
import { postAdmin } from '../../services/user.service';
import {
  setMessage,
  openAlert,
  setAlertType,
  openDialog,
} from '../../actions/message';
import { setOriginalData, clearOriginalData } from '../../actions/originalData';

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AppendTaskForm />;
    case 1:
      return <AppendOGDataType />;
    default:
      throw new Error('Unknown step');
  }
}

const steps = ['태스크 정보 입력', '원본 데이터 스키마 추가'];

export default function AppendTask(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    data,
    taskName,
    tableName,
    minPeriod,
    passCriteria,
    description,
  } = useSelector((state) => state.taskData);

  const { name } = useSelector((state) => state.originalData);
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    dispatch(clearTaskData());
    dispatch(clearOriginalData());
  }, []);

  const handleNext = () => {
    if (activeStep === 0) {
      /* 여기서는 최소한의 validty check만 한다.
        최종 제출시 태스크 정보 먼저 보내 유효한 입력인지 체크한다.
      */
      let message = '';
      const tableNameRegex = /^[\w\d\s\-_.]+$/;
      dispatch(setAlertType('error'));
      if (data.length === 0) {
        message = '최소한 하나의 칼럼을 추가해주세요';
      }
      if (passCriteria === '' || passCriteria < 0 || passCriteria > 10) {
        message = 'Pass 기준은 0부터 10 사이여야 합니다';
      }
      if (minPeriod === '' || minPeriod < 0) {
        message = '유효한 최소 주기를 입력해주세요';
      }
      if (!tableNameRegex.test(tableName)) {
        message = '테이블 제목은 영문 및 숫자만 가능합니다';
      }
      if (taskName === '') {
        message = '태스크 이름을 입력하세요';
      }
      if (message !== '') {
        dispatch(setMessage(message));
        dispatch(openAlert());
        return;
      }
      dispatch(clearOriginalData());
      dispatch(setOriginalData(data.map(({ columnName }) => ({ columnName }))));
      setActiveStep(activeStep + 1);
    } else {
      if (!name) {
        dispatch(setAlertType('error'));
        dispatch(setMessage('스키마 이름을 입력해주세요'));
        dispatch(openAlert());
        return;
      }
      // TODO: 완료! 최종 제출. 제출할 때 Number로 바꿔야 함에 유의하자.
      const tableSchema = {};
      data.forEach((row) => {
        tableSchema[row.columnName] = row.type;
      });

      postAdmin('/task/make', {
        taskName,
        desc: description,
        minTerm: Number(minPeriod),
        tableSchema: [tableSchema],
        passCriteria: Number(passCriteria),
        tableName,
      }).then(
        (response) => {
          dispatch(setAlertType('success'));
          dispatch(setMessage('태스크 추가가 성공했습니다'));
          dispatch(openDialog());
          history.push('/');
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch(setAlertType('success'));
          dispatch(setMessage(message));
          dispatch(openDialog());
        }
      );
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            태스크 추가
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            <>
              {getStepContent(activeStep)}
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === 0 ? '다음' : '태스크 추가'}
                </Button>
              </div>
            </>
          </>
        </Paper>
      </main>
    </>
  );
}
