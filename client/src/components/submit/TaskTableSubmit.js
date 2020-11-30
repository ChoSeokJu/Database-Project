import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import TaskDetail from './TaskDetail';
import OGDataSubmit from './OGDataSubmit';
import TaskTerms from './TaskTerms';

export default function TaskTableSubmit() {
  const [openTaskDetail, setOpenTaskDetail] = useState({
    open: false,
    taskName: '',
    permit: '',
  });
  const [openDataSubmit, setOpenDataSubmit] = useState({
    open: false,
    taskName: '',
  });
  const [openTaskTerm, setOpenTaskTerm] = useState({
    open: false,
    taskName: '',
  });

  const handleClose = () => {
    setOpenTaskDetail({ open: false, taskName: '', permit: '' });
    setOpenDataSubmit({ open: false, taskName: '' });
    setOpenTaskTerm({ open: false, taskName: '' });
  };

  const handleTaskDetail = (event, rowData) => {
    setOpenTaskDetail({
      open: true,
      taskName: rowData.taskName,
      permit: rowData.permit,
    });
  };

  const handleDataSubmit = (event, rowData) => {
    setOpenDataSubmit({ open: true, taskName: rowData.taskName });
  };

  const handleTaskTerm = () => {
    setOpenTaskTerm({ open: false, taskName: '' });
  };

  const handleApplyTask = (rowData) => () => {
    setOpenTaskTerm({ open: true, taskName: rowData.taskName });
  };

  const renderPermit = (rowData) => {
    switch (rowData.permit) {
      case '신청 가능':
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyTask(rowData)}
          >
            {rowData.permit}
          </Button>
        );
      default:
        return (
          <Button variant="contained" disabled>
            {rowData.permit}
          </Button>
        );
    }
  };

  const getTask = (query) => new Promise((resolve, reject) => {
    setTimeout(
      () => resolve({
        data: [
          {
            taskName: '태스크1',
            permit: '신청 가능',
          },
          {
            taskName: '태스크2',
            permit: '승인 대기',
          },
          {
            taskName: '태스크3',
            permit: '승인 완료',
          },
          {
            taskName: '태스크4',
            permit: '승인 거절',
          },
          {
            taskName: '태스크5',
            permit: '신청 가능',
          },
        ],
        page: query.page,
        totalCount: 100,
      }),
      500,
    );
  });

  return (
    <>
      <Container component="main" maxWidth="sm">
        <MaterialTable
          title="태스크 목록"
          data={getTask}
          options={{
            pageSize: 8,
            pageSizeOptions: [],
            actionsColumnIndex: -1,
            paginationType: 'stepped',
            // search: false,
          }}
          localization={{
            header: {
              actions: '',
            },
          }}
          columns={[
            { title: '이름', field: 'taskName' },
            {
              title: '참가 상태',
              cellStyle: { width: '25%' },
              field: 'status',
              render: (rowData) => renderPermit(rowData),
            },
          ]}
          actions={[
            {
              icon: 'description',
              tooltip: '정보',
              onClick: handleTaskDetail,
            },
            (rowData) => ({
              icon: 'upload',
              tooltip: '제출하기',
              onClick: (event, rowData) => handleDataSubmit(event, rowData),
              disabled: rowData.permit !== '승인 완료',
            }),
          ]}
        />
        <TaskDetail
          open={openTaskDetail.open}
          taskName={openTaskDetail.taskName}
          permit={openTaskDetail.permit}
          handleClose={handleClose}
        />
        <TaskTerms
          open={openTaskTerm.open}
          taskName={openTaskTerm.taskName}
          handleClose={handleClose}
          handleConfirm={handleTaskTerm}
        />
        <OGDataSubmit
          open={openDataSubmit.open}
          taskName={openDataSubmit.taskName}
          handleClose={handleClose}
        />
      </Container>
    </>
  );
}
