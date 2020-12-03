/* eslint-disable react/jsx-filename-extension */
import React, { createRef, useState } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

export default function UserEvalTask({
  open, handleClose, Uid, ID,
}) {
  const [openInfo, setOpenInfo] = useState({ open: false, taskName: '', Uid: '' });
  // TODO: 유저가 제출한 파싱 데이터 목록을 가져오기.
  const getParsedData = (query) => new Promise((resolve, reject) => {
    setTimeout(
      () => resolve({
        data: [
          {
            taskName: 'task1',
            date: '2020-01-01',
            OGDataType: '데이터타입1',
            score: 10,
            PNP: 'P',
          },
          {
            taskName: 'task2',
            date: '2020-01-01',
            OGDataType: '데이터타입2',
            score: 10,
            PNP: 'P',
          },
          {
            taskName: 'task3',
            date: '2020-01-01',
            OGDataType: '데이터타입3',
            score: 10,
            PNP: 'P',
          },
        ],
        page: query.page,
        totalCount: 100,
      }),
      500,
    );
  });

  const handleInfo = (rowData) => () => {
    setOpenInfo({ open: true, taskName: rowData.taskName, Uid });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {ID}
          {' '}
          회원이 참여중인 태스크
        </DialogTitle>
        <DialogContent>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              pageSize: 6,
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
              { title: '태스크 이름', field: 'taskName' },
              { title: '제출 횟수', field: 'date' },
              { title: '평균 평가 점수', field: 'avgScore' },
              { title: '마지막 제출 날짜', field: 'lastDate' },
              {
                title: '상세정보',
                field: 'info',
                align: 'center',
                render: (rowData) => (
                  <IconButton onClick={handleInfo(rowData)} size="small">
                    <InfoIcon />
                  </IconButton>
                ),
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
    </>
  );
}
