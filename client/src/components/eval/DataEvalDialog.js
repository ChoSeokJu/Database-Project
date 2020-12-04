/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from 'react-redux';
import GetAppIcon from '@material-ui/icons/GetApp';
import Grid from '@material-ui/core/Grid';
import {
  Container,
  TextField,
  MenuItem,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { green, red, grey } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';
import { postEval, getEval } from '../../services/user.service';

const useStyle = makeStyles((theme) => ({
  downloadButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  finalSubmitText: {
    marginTop: 5,
    marginLeft: theme.spacing(1),
  },
  opinion: {
    paddingBottom: theme.spacing(1),
  },
  pnp: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function AppendOGDataTypeDialog({ open, handleClose, Pid }) {
  const dispatch = useDispatch();
  const classes = useStyle();
  const [score, setScore] = useState(10);
  const [PNP, setPNP] = useState(true);
  const [opinion, setOpinion] = useState('');

  const handlePNPChange = (e) => {
    setPNP(e.target.value);
  };

  const handleScoreChange = (e, newValue) => {
    setScore(newValue);
  };

  const handleOpinionChange = (e) => {
    setOpinion(e.target.value);
  };

  const handleSubmit = () => {
    // TODO: 완료! 평가 제출하기
    postEval('/', {
      Pid,
      Score: score,
      Desc: opinion,
      PNP: PNP ? 'P' : 'NP',
    }).then(
      () => {
        handleClose();
      },
      (error) => {
        const message = (error.response
            && error.response.data
            && error.response.data.message)
          || error.message
          || error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
      },
    );
  };

  const handleDownload = () => {
    getEval('/parsed-data/download', { Pid });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        데이터 평가
        <Button
          color="primary"
          variant="contained"
          endIcon={<GetAppIcon />}
          className={classes.downloadButton}
          onClick={handleDownload}
        >
          데이터 다운로드
        </Button>
      </DialogTitle>
      <DialogContent>
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">Pass/Non-Pass</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.pnp}>
              <Tooltip title="Pass" placement="right">
                <IconButton onClick={() => setPNP(true)}>
                  <CheckIcon
                    style={{
                      fontSize: 100,
                      color: PNP ? green[500] : grey[500],
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.pnp}>
              <Tooltip title="Non-Pass" placement="right">
                <IconButton onClick={() => setPNP(false)}>
                  <CloseIcon
                    style={{
                      fontSize: 100,
                      color: PNP ? grey[500] : red[500],
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} className={classes.opinion}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                onChange={handleOpinionChange}
                value={opinion}
                placeholder="상세 의견을 적어주세요"
                multiline
                rows={10}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Box
                component="fieldset"
                borderColor="transparent"
                display="flex"
                justifyContent="space-between"
              >
                <Typography className={classes.finalSubmitText}>
                  최종 점수
                </Typography>
                <Rating
                  name="pristine"
                  value={score}
                  onChange={handleScoreChange}
                  precision={0.5}
                  size="large"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          align="right"
          Icon={<CheckIcon />}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          Icon={<CloseIcon />}
        >
          평가 완료
        </Button>
      </DialogActions>
    </Dialog>
  );
}
