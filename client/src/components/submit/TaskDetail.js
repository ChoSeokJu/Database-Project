import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import TaskOGDataFile from './TaskOGDataFile';
import { getSubmit } from '../../services/user.service';

export default function TaskDetail({
  open, handleClose, taskName, permit,
}) {
  const [submittedCnt, setSubmittedCnt] = useState(null);
  const [passedCnt, setPassedCnt] = useState(null);
  const [desc, setDesc] = useState(null);

  const getTaskDetail = (query) => new Promise((resolve, reject) => {
    getSubmit('/submitter-list', {
      taskName: taskName,
      per_page: query.pageSize,
      page: query.page + 1,
    }).then((response) => {
      console.log(response);
      const { data, score, submittedDataCnt, taskDataTableTupleCnt, taskDesc, page, totalCount } = response.data;
      resolve({
        data, page: page - 1, totalCount
      });
      setSubmittedCnt(submittedDataCnt);
      setPassedCnt(taskDataTableTupleCnt);
      setDesc(taskDesc);
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
      <DialogTitle>{taskName}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {desc}
        </Typography>
        {permit === 'approved' && (
          <>
            <Typography variant="body2" align='right' gutterBottom={true}>
              Pass된 파일 수: {passedCnt} / 제출한 파일 수: {submittedCnt} / 평가 점수: { }
            </Typography>
            <MaterialTable
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
