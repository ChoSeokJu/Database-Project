/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { getSubmit, postSubmitUpload } from '../../services/user.service';
import {
  setMessage,
  openAlert,
  setAlertType,
  openDialog,
} from '../../actions/message';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '80%', // Fix IE 11 issue.
  },
  margin: {
    margin: theme.spacing(0.5, 0, 0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  upload: {
    display: 'none',
  },
}));

export default function OGDataSubmit({ open, handleClose, taskName }) {
  const classes = useStyles();

  const [dataFile, setDataFile] = useState(null);
  const [ogDataType, setOgDataType] = useState('');
  const [ogDataTypes, setOgDataTypes] = useState([]);
  const [submitCnt, setSubmitCnt] = useState('');
  const [submitTermStart, setSubmitTermStart] = useState('');
  const [submitTermEnd, setSubmitTermEnd] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    setDataFile(null);
    setOgDataType('');
    setOgDataTypes([]);
    setSubmitCnt('');
    setSubmitTermStart('');
    setSubmitTermEnd('');

    if (open) {
      getSubmit('/og-data', {
        taskName,
      }).then(
        (response) => {
          console.log(response);
          setOgDataTypes(response.data.data);
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(message);
        }
      );
    }
  }, [open]);

  const onOgDataTypeChange = (e) => {
    setOgDataType(e.target.value);
  };

  const onDataFileChange = (e) => {
    setDataFile(e.target.files[0]);
  };

  const onSubmitCntChange = (e) => {
    setSubmitCnt(e.target.value);
  };

  const onSubmitTermStartChange = (e) => {
    setSubmitTermStart(e.target.value);
  };

  const onSubmitTermEndChange = (e) => {
    setSubmitTermEnd(e.target.value);
  };

  const handleSubmit = async (e) => {
    let message = '';
    dispatch(setAlertType('error'));
    // if (!submitTermEnd) {
    //   message = '원본 데이터 기간 종료일을 입력해주세요.';
    // }
    // if (!submitTermStart) {
    //   message = '원본 데이터 기간 시작일을 선택해주세요.';
    // }
    // if (!submitCnt) {
    //   message = '원본 데이터 회차를 입력해주세요.';
    // }
    if (!dataFile) {
      message = '원본 데이터 시퀀스 파일을 제출해주세요.';
    }
    if (!ogDataType) {
      message = '원본 데이터 타입을 선택해주세요.';
    }
    if (message) {
      dispatch(setMessage(message));
      dispatch(openAlert());
    } else {
      e.preventDefault();
      // const data = new FormData();
      // data.append('file', dataFile);
      try {
        const formData = new FormData();
        formData.append('file', dataFile, dataFile.name);
        formData.append('taskName', taskName);
        formData.append('ogDataType', ogDataType);

        await postSubmitUpload('/submit-data', formData);

        dispatch(setAlertType('success'));
        dispatch(setMessage('원본 데이터를  성공적으로 제출했습니다'));
        dispatch(openAlert());
        handleClose();
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
        handleClose();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogActions>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogTitle>원본 데이터 제출</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputLabel required shrink id="ogdatatype" color="primary">
              원본 데이터 타입
            </InputLabel>
            <Select
              labelId="ogdatatype"
              id="ogdatatype"
              value={ogDataType}
              onChange={onOgDataTypeChange}
              displayEmpty
              fullWidth
              required
            >
              <MenuItem value="" disabled>
                선택
              </MenuItem>
              {ogDataTypes.map((type, index) => (
                <MenuItem value={type.Name} key={type.Did}>
                  {type.Name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <InputLabel required shrink id="ogdata">
              원본 데이터 파일 제출
            </InputLabel>
            <Button
              variant="contained"
              color="default"
              component="label"
              className={classes.margin}
              startIcon={<CloudUploadIcon />}
              size="small"
            >
              <Typography variant="body2">파일 업로드</Typography>
              <input
                accept=".csv"
                className={classes.upload}
                multiple
                hidden
                type="file"
                name="file"
                onChange={onDataFileChange}
              />
            </Button>
            <Typography variant="body2">
              파일 이름: {dataFile ? dataFile.name : null}
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              variant="standard"
              required
              fullWidth
              id="submitcnt"
              label="원본 데이터 회차"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="원본 데이터 회차를 입력해주세요."
              name="submitcnt"
              autoComplete="submitcnt"
              onChange={onSubmitCntChange}
              value={submitCnt}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  id="submittermstart"
                  label="원본 데이터 기간 시작일"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="submittermstart"
                  autoComplete="submittermstart"
                  onChange={onSubmitTermStartChange}
                  value={submitTermStart}
                  type="date"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  id="submittermend"
                  label="원본 데이터 기간 종료일"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="submittermend"
                  autoComplete="submittermend"
                  onChange={onSubmitTermEndChange}
                  value={submitTermEnd}
                  type="date"
                />
              </Grid>
            </Grid>
         </Grid> */}
          <Grid container justify="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              제출하기
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
