/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';
import InfoIcon from '@material-ui/icons/Info';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import TaskUserList from './TaskUserList';
import TaskInfo from './TaskInfo';
import { setTaskData } from '../../actions/taskData';
import AppendOGDataTypeDialog from './AppendOGDataTypeDialog';

export default function TaskTableAdmin(props) {
  const [openTaskUserList, setOpenTaskUserList] = useState({
    open: false,
    taskName: '',
  });
  const [openTaskInfo, setOpenTaskInfo] = useState({
    open: false,
    taskName: '',
  });
  const [openAppendOGDataType, setOpenAppendOGDataType] = useState({
    open: false,
    taskName: '',
  });

  const history = useHistory();

  const handleClose = () => {
    setOpenTaskUserList({ open: false, taskName: '' });
    setOpenTaskInfo({ open: false, taskName: '' });
    setOpenAppendOGDataType({ open: false, taskName: '' });
  };

  const handleUserList = (rowData) => () => {
    setOpenTaskUserList({ open: true, taskName: rowData.taskName });
  };
  const handleTaskInfo = (rowData) => () => {
    setOpenTaskInfo({ open: true, taskName: rowData.taskName });
  };
  const handleAppendSchema = (rowData) => () => {
    setOpenAppendOGDataType({ open: true, taskName: rowData.taskName });
  };

  const handleAppendTask = (event) => {
    history.push('/admin/task/append');
  };

  // TODO: 태스크 목록 불러오기
  const getTask = (query) =>
    new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
            data: [
              { taskName: '카드1' },
              { taskName: '카드2' },
              { taskName: '카드3' },
              { taskName: '카드4' },
              { taskName: '카드5' },
              { taskName: '카드6' },
              { taskName: '카드7' },
              { taskName: '카드8' },
            ],
            page: query.page,
            totalCount: 100,
          }),
        500
      );
    });

  return (
    <>
      <Container maxWidth="md">
        <MaterialTable
          title="태스크 목록"
          options={{
            pageSize: 8,
            pageSizeOptions: [],
            actionsColumnIndex: -1,
            paginationType: 'stepped',
            search: false,
          }}
          localization={{
            header: {
              actions: '스키마',
            },
          }}
          columns={[
            {
              title: '이름',
              field: 'taskName',
              sorting: false,
            },
            {
              title: '회원목록',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton onClick={handleUserList(rowData)} size="small">
                  <GroupIcon />
                </IconButton>
              ),
            },
            {
              title: '정보',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton onClick={handleTaskInfo(rowData)} size="small">
                  <InfoIcon />
                </IconButton>
              ),
            },
            {
              title: '스키마',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton onClick={handleAppendSchema(rowData)} size="small">
                  <AddIcon />
                </IconButton>
              ),
            },
          ]}
          data={getTask}
          actions={[
            {
              icon: 'add',
              tooltip: '태스크 추가',
              isFreeAction: true,
              onClick: handleAppendTask,
            },
          ]}
        />
      </Container>

      <TaskUserList
        open={openTaskUserList.open}
        taskName={openTaskUserList.taskName}
        handleClose={handleClose}
      />
      <TaskInfo
        open={openTaskInfo.open}
        taskName={openTaskInfo.taskName}
        handleClose={handleClose}
      />
      <AppendOGDataTypeDialog
        open={openAppendOGDataType.open}
        taskName={openAppendOGDataType.taskName}
        handleClose={handleClose}
      />
    </>
  );
}
