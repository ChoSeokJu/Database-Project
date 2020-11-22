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
import TaskUserTable from './TaskUserListTable';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

export default function TaskUserList({ open, handleClose, taskName }) {
  const classes = useStyles();

  const getParsedData = (query) => new Promise((resolve, reject) => {
    setTimeout(() => resolve({
      data: [
        {
          ID: 'user1', date: '2020-01-01', OGDataType: '데이터타입1', PNP: 'P',
        },
        {
          ID: 'user2', date: '2020-01-01', OGDataType: '데이터타입2', PNP: 'P',
        },
        {
          ID: 'user3', date: '2020-01-01', OGDataType: '데이터타입3', PNP: 'P',
        },
      ],
      page: query.page,
      totalCount: 100,
    }), 500);
  });

  const handleTableDownload = () => {
    alert(`${taskName} 태스크의 테이블 다운로드`);
  };

  const handleParsedDataDownload = (event, rowData) => {
    alert(`${rowData.ID}가 올린 파싱된 데이터를 다운`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      {/* <DialogTitle id="form-dialog-title">
        태스크
        {' '}
        {taskName}
        의 데이터 테이블
      </DialogTitle> */}
      <DialogContent>
        <Typography variant="h5" component="h2" className={classes.title}>
          {taskName}
          의 데이터 테이블
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<GetAppIcon />}
          className={classes.button}
          onClick={handleTableDownload}
        >
          다운로드
        </Button>
        <Typography variant="h5" component="h2" className={classes.title}>
          파싱된 원본 데이터
        </Typography>
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
