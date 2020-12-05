import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Typography } from '@material-ui/core';
import TaskDetail from './TaskDetail';
import OGDataSubmit from './OGDataSubmit';
import TaskTerms from './TaskTerms';
import { getSubmit } from '../../services/user.service';

export default function TaskTableSubmit() {
  const [totalCnt, setTotalCnt] = useState(null);
  const tableRef = React.createRef();
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
  };

  const handleTermClose = () => {
    setOpenTaskTerm({ open: false, taskName: '' });
    tableRef.current && tableRef.current.onQueryChange();
  };

  const handleTaskDetail = (rowData) => () => {
    setOpenTaskDetail({
      open: true,
      taskName: rowData.taskName,
      permit: rowData.permit,
    });
  };

  const handleDataSubmit = (rowData) => () => {
    setOpenDataSubmit({ open: true, taskName: rowData.taskName });
  };

  const handleApplyTask = (rowData) => () => {
    setOpenTaskTerm({ open: true, taskName: rowData.taskName });
  };

  const renderPermit = (rowData) => {
    const permitKorean = {
      approved: '승인 완료',
      rejected: '승인 거절',
      pending: '승인 대기',
      null: '신청 가능',
    };
    switch (rowData.permit) {
      case null:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyTask(rowData)}
          >
            {permitKorean[rowData.permit]}
          </Button>
        );
      default:
        return (
          <Button variant="contained" disabled>
            {permitKorean[rowData.permit]}
          </Button>
        );
    }
  };

  const getTask = (query) =>
    new Promise((resolve, reject) => {
      getSubmit('/task-list', {
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          console.log(response);
          const {
            data,
            page,
            totalCount,
            score,
            submittedDataCnt,
            taskDataTableTupleCnt,
          } = response.data;
          resolve({
            data,
            page: page - 1,
            totalCount,
            score,
            submittedDataCnt,
            taskDataTableTupleCnt,
          });
          setTotalCnt(totalCount);
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

  return (
    <>
      <Container component="main" maxWidth="md">
        <Typography variant="body1">총 태스크 수: {totalCnt}</Typography>
        <MaterialTable
          tableRef={tableRef}
          title="태스크 목록"
          data={getTask}
          options={{
            pageSize: 8,
            pageSizeOptions: [],
            actionsColumnIndex: -1,
            paginationType: 'stepped',
          }}
          localization={{
            header: {
              actions: '',
            },
            body: {
              emptyDataSourceMessage: '태스크가 없습니다',
            },
          }}
          columns={[
            { title: '이름', field: 'taskName' },
            {
              title: '참가 상태',
              cellStyle: { width: '15%' },
              field: 'status',
              render: (rowData) => renderPermit(rowData),
            },
            {
              title: '정보',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton onClick={handleTaskDetail(rowData)} size="small">
                  <DescriptionIcon />
                </IconButton>
              ),
            },
            {
              title: '제출',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton
                  onClick={handleDataSubmit(rowData)}
                  size="small"
                  disabled={rowData.permit !== 'approved'}
                >
                  <CloudUploadIcon />
                </IconButton>
              ),
            },
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
          handleClose={handleTermClose}
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
