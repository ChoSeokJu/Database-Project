/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
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
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import GetAppIcon from '@material-ui/icons/GetApp';
import download from 'downloadjs';
import { useDispatch } from 'react-redux';
import TaskUserTable from './TaskUserListTable';
import { getAdmin, downloadAdmin } from '../../services/user.service';
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
  info: {
    width: '50%',
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  ellipsis: {
    maxHeight: theme.spacing(10),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordWrap: 'break-word',
  },
}));

export default function TaskInfo({ open, handleClose, taskName }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [taskInfos, setTaskInfos] = useState({});

  useEffect(() => {
    if (open) {
      getAdmin('/task/info', { taskName }).then((response) => {
        const {
          TaskName,
          Desc,
          MinTerm,
          TableName,
          TableSchema,
          TimeStamp,
          PassCriteria,
        } = response.data.task;
        console.log(response.data.task);
        setTaskInfos({
          TaskName,
          Desc,
          MinTerm,
          TableName,
          TableSchema: Object.entries(TableSchema[0])
            .map(([key, value]) => `${key}: ${value}`)
            .join(', '),
          TimeStamp: TimeStamp.match(/\d{4}-\d{2}-\d{2}/g)[0],
          PassCriteria,
        });
      });
    } else {
      setTaskInfos({});
    }
  }, [open]);

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
            PNP: row.PNP === null ? '평가 대기중' : row.PNP ? 'P' : 'NP',
            date: row.date.match(/\d{4}-\d{2}-\d{2}/g)[0],
            Pid: row.Pid,
          }));
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
    downloadAdmin('/task/download', { taskName });
  };

  const handleParsedDataDownload = (event, rowData) => {
    // TODO: 완료! 파싱된 데이터 다운로드
    downloadAdmin('/task/parsed-data/download', {
      Pid: rowData.Pid,
    });
  };

  const ListInfo = ({ key, value }) => (
    <ListItem>
      <ListItemText
        secondaryTypographyProps={{
          style: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        }}
        primary={key}
        secondary={value}
      />
    </ListItem>
  );

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
        <Box display="flex" flexDirection="row">
          <List className={classes.info}>
            {[
              ['태스크 이름', taskInfos.TaskName],
              ['최소 업로드 주기', taskInfos.MinTerm],
              ['패스 기준', `${taskInfos.PassCriteria}점`],
              ['설명', taskInfos.Desc],
            ].map(([key, value]) => (
              <ListItem>
                <ListItemText
                  secondaryTypographyProps={{
                    className: classes.ellipsis,
                  }}
                  primary={key}
                  secondary={value}
                />
              </ListItem>
            ))}
          </List>
          <List className={classes.info}>
            {[
              ['생성된 날짜', taskInfos.TimeStamp],
              ['테이블 이름', taskInfos.TableName],
              ['테이블 칼럼', taskInfos.TableSchema],
            ].map(([key, value]) => (
              <ListItem>
                <ListItemText
                  secondaryTypographyProps={{
                    className: classes.ellipsis,
                  }}
                  primary={key}
                  secondary={value}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider className={classes.divider} />
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
