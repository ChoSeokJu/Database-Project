import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import TaskOGDataFile from './TaskOGDataFile';

export default function TaskDetail({
  open, handleClose, taskName, permit,
}) {
  const getOGDataType = (query) => new Promise((resolve, reject) => {
    setTimeout(
      () => resolve({
        data: [
          {
            submitCnt: 1,
            OGDataType: '데이터타입1',
            submitData: [
              {
                submitCnt: 1, date: '2020-11-01', score: 90, PNP: 'P',
              },
            ],
          },
          {
            submitCnt: 2,
            OGDataType: '데이터타입2',
            submitData: [
              {
                submitCnt: 1, date: '2020-11-02', score: 80, PNP: 'P',
              },
              {
                submitCnt: 2, date: '2020-11-03', score: 85, PNP: 'P',
              },
            ],
          },
          {
            submitCnt: 3,
            OGDataType: '데이터타입3',
            submitData: [
              {
                submitCnt: 1, date: '2020-11-04', score: 80, PNP: 'P',
              },
              {
                submitCnt: 2, date: '2020-11-05', score: 85, PNP: 'P',
              },
              {
                submitCnt: 3, date: '2020-11-06', score: 30, PNP: 'NP',
              },
            ],
          },
        ],
        page: query.page,
        totalCount: 100,
      }),
      500,
    );
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
          {taskName}
          에 대한 설명
        </Typography>
        {permit === '승인 완료' && (
          <>
            <Typography variant="body2">
              Pass된 파일 수/제출한 파일 수:
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
              columns={[
                {
                  title: '원본 데이터 타입',
                  field: 'OGDataType',
                },
                { title: '제출한 파일 수', field: 'submitCnt' },
              ]}
              data={getOGDataType}
              onRowClick={(event, towData, togglePanel) => togglePanel()}
              detailPanel={[
                {
                  tooltip: '제출한 파일 현황 보기',
                  render: (rowData) => <TaskOGDataFile data={rowData.submitData} />,
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
