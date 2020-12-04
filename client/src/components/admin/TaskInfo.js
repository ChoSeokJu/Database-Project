/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import GetAppIcon from '@material-ui/icons/GetApp';
import download from 'downloadjs';
import { useDispatch } from 'react-redux';
import TaskUserTable from './TaskUserListTable';
import { getAdmin, getAdminBlob } from '../../services/user.service';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  downloadButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function TaskInfo({ open, handleClose, taskName }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // TODO: 파싱된 데이터 목록 얻어오기
  const getParsedData = (query) =>
    new Promise((resolve, reject) => {
      getAdmin('/task/parsed-data', {
        taskName,
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          const { data, page, totalCount } = response.data;
          const parsedData = data.map((row) => ({
            ID: row.ID,
            OGDataType: row.OGDataType,
            PNP: row.PNP === null ? null : row.PNP ? 'P' : 'NP',
            date: row.date.match(/\d{4}-\d{2}-\d{2}/g)[0],
            Pid: row.Pid,
          }));
          console.log(parsedData);
          resolve({
            data: parsedData,
            page: page - 1,
            totalCount,
          });
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          reject(message);
        }
      );
    });

  const handleTableDownload = () => {
    // TODO: 완료! 태스크의 테이블 다운로드
    getAdminBlob('/task/download', {
      taskName,
    })
      .then((blob) => download(blob))
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
      });
  };

  const handleParsedDataDownload = (event, rowData) => {
    // TODO: 완료! 파싱된 데이터 다운로드
    getAdminBlob('/task/parsed-data/download', {
      Pid: rowData.Pid,
    })
      .then((blob) => download(blob))
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {taskName}의 태스크 상세정보
        <Button
          variant="contained"
          color="primary"
          className={classes.downloadButton}
          endIcon={<GetAppIcon />}
          onClick={handleTableDownload}
        >
          데이터 테이블 다운로드
        </Button>
      </DialogTitle>
      <DialogContent>
        <MaterialTable
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          options={{
            pageSize: 3,
            pageSizeOptions: [],
            actionsColumnIndex: -1,
            paginationType: 'stepped',
            search: false,
            toolbar: false,
            sorting: false,
          }}
          localization={{
            header: {
              actions: '',
            },
          }}
          columns={[
            { title: '제출자 ID', field: 'ID' },
            { title: '제출일자', field: 'date' },
            { title: '원본 데이터 타입', field: 'OGDataType' },
            { title: 'P/NP', field: 'PNP' },
          ]}
          actions={[
            {
              icon: 'download',
              tooltip: '다운로드',
              onClick: handleParsedDataDownload,
            },
          ]}
          data={getParsedData}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
