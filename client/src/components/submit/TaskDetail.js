import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
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
}));

function DividedList({ items, length, direction }) {
  const classes = useStyles();

  return (
    <List className={length === 2 && classes.half}>
      {items.map(([key, value]) => (
        <ListItem>
          {direction === 'vertical'
            ? <ListItemText secondaryTopographyProps={{
              style: {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              },
            }}
              primary={key}
              secondary={value}
            />
            : <>
              <ListItemText className={classes.half} primary={key} />
              <ListItemText className={classes.half} secondary={value} />
            </>}
        </ListItem>
      ))}
    </List>
  )
}

export default function TaskDetail({
  open, handleClose, taskName, permit,
}) {
  const classes = useStyles();
  const [submittedCnt, setSubmittedCnt] = useState(null);
  const [passedCnt, setPassedCnt] = useState(null);
  const [desc, setDesc] = useState(null);
  const [avgScore, setAvgScore] = useState(null);

  useEffect(() => {
    if (open) {
      getSubmit('/submitter-list', {
        taskName: taskName,
        per_page: 8,
        page: 1,
      }).then((response) => {
        console.log(response);
        const { score, submittedDataCnt, taskDataTableTupleCnt, taskDesc } = response.data;
        setSubmittedCnt(submittedDataCnt || 0);
        setPassedCnt(taskDataTableTupleCnt || 0);
        setDesc(taskDesc || '-');
        setAvgScore(score || '-');
      }, (error) => {
        console.log(error);
        const message = (error.response
          && error.response.data
          && error.response.data.message)
          || error.message
          || error.toString();
        console.log(message);
      });
    }
  }, [open])

  const getTaskDetail = (query) => new Promise((resolve, reject) => {
    getSubmit('/submitter-list', {
      taskName: taskName,
      per_page: query.pageSize,
      page: query.page + 1,
    }).then((response) => {
      console.log(response);
      const { data, page, totalCount } = response.data;
      resolve({
        data, page: page - 1, totalCount
      });
    }, (error) => {
      console.log(error);
      const message = (error.response
        && error.response.data
        && error.response.data.message)
        || error.message
        || error.toString();
      console.log(message);
      reject(message);
    });
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>{taskName}의 태스크 상세정보</DialogTitle>
      <DialogContent>
        {permit !== 'approved'
          ? (<DividedList items={[['설명', desc]]} length={1} direction='vertical' />)
          : (
            <>
              <Box display="flex" flexDirection="row">
                <DividedList items={[['설명', desc]]} length={2} direction='vertical' />
                <DividedList items={[['평가 점수', avgScore], ['Pass된 파일 수', passedCnt], ['제출한 파일 수', submittedCnt]]} length={2} />
              </Box>
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
                    field: 'OGDataTypeName'
                  },
                  {
                    title: '제출한 파일 수', field: 'submittedCnt', align: 'right', cellStyle: { width: '20%', textAlign: 'right' }
                  },
                  {
                    title: 'Pass된 파일 수', field: 'passedCnt', align: 'right', cellStyle: { width: '20%', textAlign: 'right' }
                  },
                ]}
                data={getTaskDetail}
                onRowClick={(event, rowData, togglePanel) => togglePanel()}
                detailPanel={[
                  {
                    tooltip: '제출한 파일 현황 보기',
                    render: (rowData) => <TaskOGDataFile data={rowData.data} />,
                  },
                ]}
              />
            </>
          )}
        <DialogActions>
          <Button onClick={handleClose} color="default" variant="contained">
            닫기
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
