import React, { useState } from 'react';
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

  const ogDataTypes = [
    '원본 데이터 타입 1',
    '원본 데이터 타입 2',
    '원본 데이터 타입 3',
  ];

  const [ogDataType, setOgDataType] = useState('');
  const [submitCnt, setSubmitCnt] = useState('');
  const [submitTermStart, setSubmitTermStart] = useState('');
  const [submitTermEnd, setSubmitTermEnd] = useState('');

  const onOgDataTypeChange = (e) => {
    setOgDataType(e.target.value);
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

  const handleSubmit = (e) => {
    alert('원본 데이터를 제출하시겠습니까?');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
                  <MenuItem value={index + 1}>{type}</MenuItem>
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
                  id="ogdata"
                  multiple
                  type="file"
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
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
              <Grid container justify="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  제출하기
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
