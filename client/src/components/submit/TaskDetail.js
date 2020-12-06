import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import TaskOGDataFile from './TaskOGDataFile';
import { getSubmit } from '../../services/user.service';

const useStyles = makeStyles((theme) => ({
  half: {
    width: '50%',
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  itemName: {
    width: '80%',
  },
  desc: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  ellipsis: {
    maxHeight: 80,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  more: {
    float: 'right',
  },
}));

function DividedList({ items, direction, onlyDesc }) {
  const classes = useStyles();
  const [more, setMore] = useState(true);

  const onMoreChange = () => {
    setMore(() => !more);
  };

  if (onlyDesc) {
    return (
      <>
        <Typography variant="body1" component="span" display="block">
          {items[0][0]}
        </Typography>
        <Typography variant="body2" color="textSecondary" display="block">
          {items[0][1]}
        </Typography>
      </>
    );
  }

  return (
    <>
      {direction === 'vertical' ? (
        <>
          <Typography variant="body1" component="span" display="block">
            {items[0][0]}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            display="block"
            className={more && classes.ellipsis}
          >
            {items[0][1]}
          </Typography>
          <Button
            onClick={onMoreChange}
            color="primary"
            className={classes.more}
          >
            {more ? '더보기' : '간단히'}
          </Button>
        </>
      ) : (
        <List>
          {items.map(([key, value]) => (
            <ListItem>
              <ListItemText className={classes.itemName} primary={key} />
              <ListItemText secondary={value} />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}

export default function TaskDetail({
  open,
  handleClose,
  taskName,
  permit,
  Uid,
}) {
  const classes = useStyles();
  const [submittedCnt, setSubmittedCnt] = useState(null);
  const [passedCnt, setPassedCnt] = useState(null);
  const [desc, setDesc] = useState(null);
  const [avgScore, setAvgScore] = useState(null);

  useEffect(() => {
    if (open) {
      getSubmit('/task-details', {
        Uid,
        taskName,
        per_page: 8,
        page: 1,
      }).then(
        (response) => {
          console.log(response);
          const {
            score,
            submittedDataCnt,
            passedDataCnt,
            taskDesc,
          } = response.data;
          setSubmittedCnt(submittedDataCnt || 0);
          setPassedCnt(passedDataCnt || 0);
          setDesc(taskDesc || '-');
          setAvgScore(score || '-');
        },
        (error) => {
          console.log(error);
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

  const getTaskDetail = (query) =>
    new Promise((resolve, reject) => {
      getSubmit('/submitter-list', {
        taskName,
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          console.log(response);
          const { data, page, totalCount } = response.data;
          resolve({
            data,
            page: page - 1,
            totalCount,
          });
        },
        (error) => {
          console.log(error);
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(message);
          reject(message);
        }
      );
    });

  const onClose = () => {
    setSubmittedCnt(null);
    setPassedCnt(null);
    setDesc(null);
    setAvgScore(null);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      maxWidth="md"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>{taskName}의 태스크 상세정보</DialogTitle>
      <DialogContent>
        {permit !== 'approved' ? (
          <DividedList items={[['설명', desc]]} direction="vertical" onlyDesc />
        ) : (
          <>
            <Grid container lg={12} md={12} xs={12}>
              <Grid item lg={6} md={6} xs={12} className={classes.desc}>
                <DividedList items={[['설명', desc]]} direction="vertical" />
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <DividedList
                  items={[
                    ['평가 점수', avgScore],
                    ['Pass된 파일 수', passedCnt],
                    ['제출한 파일 수', submittedCnt],
                  ]}
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <MaterialTable
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              options={{
                pageSize: 3,
                pageSizeOptions: [],
                paginationType: 'stepped',
                search: false,
                toolbar: false,
                sorting: false,
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: '태스크가 없습니다',
                },
              }}
              columns={[
                {
                  title: '원본 데이터 타입',
                  field: 'OGDataTypeName',
                  cellStyle: { width: '50%', textAlign: 'left' },
                },
                {
                  title: '제출한 파일 수',
                  field: 'submittedDataCnt',
                  align: 'right',
                  cellStyle: { width: '20%', textAlign: 'right' },
                },
                {
                  title: 'Pass된 파일 수',
                  field: 'passedDataCnt',
                  align: 'right',
                  cellStyle: { width: '20%', textAlign: 'right' },
                },
              ]}
              data={getTaskDetail}
              onRowClick={(event, rowData, togglePanel) => togglePanel()}
              detailPanel={[
                {
                  tooltip: '제출한 파일 현황 보기',
                  render: (rowData) => (
                    <TaskOGDataFile data={rowData.submitData} />
                  ),
                },
              ]}
            />
          </>
        )}
        <DialogActions>
          <Button onClick={onClose} color="default" variant="contained">
            닫기
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
