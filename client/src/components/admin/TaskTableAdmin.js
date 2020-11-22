/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';
import InfoIcon from '@material-ui/icons/Info';
import TaskUserList from './TaskUserList';
import TaskInfo from './TaskInfo';

export default function TaskTableAdmin(props) {
  const [openTaskUserList, setOpenTaskUserList] = useState({ open: false, taskName: '' });
  const [openTaskInfo, setOpenTaskInfo] = useState({ open: false, taskName: '' });

  const handleClose = () => {
    setOpenTaskUserList({ open: false, taskName: '' });
    setOpenTaskInfo({ open: false, taskName: '' });
  };
  const handleUserList = (rowData) => () => {
    setOpenTaskUserList({ open: true, taskName: rowData.taskName });
  };
  const handleTaskInfo = (rowData) => () => {
    setOpenTaskInfo({ open: true, taskName: rowData.taskName });
  };

  const handleAppendTask = (event) => {
    alert('태스크 추가');
  };
  const handleAppendScheme = (event, rowData) => {
    alert(`${rowData.taskName}에 스키마를 추가`);
  };

  const getTask = (query) => new Promise((resolve, reject) => {
    setTimeout(() => resolve({
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
    }), 500);
  });

  return (
    <>
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
        columns={[{ title: '이름', field: 'taskName' },
        {
          title: '회원목록 조회',
          sorting: false,
          render: (rowData) => (
            <Button variant="primary" onClick={handleUserList(rowData)} endIcon={<GroupIcon />}>
              회원목록
            </Button>
          ),
        },
        {
          title: '정보 조회',
          sorting: false,
          render: (rowData) => (
            <Button variant="primary" onClick={handleTaskInfo(rowData)} endIcon={<InfoIcon />}>
              태스크 정보
            </Button>
          ),
        }]}
        data={getTask}
        actions={
          [
            {
              icon: 'add',
              tooltip: '원본 데이터 스키마 추가',
              onClick: handleAppendScheme,
            },
            {
              icon: 'add',
              tooltip: '태스크 추가',
              isFreeAction: true,
              onClick: handleAppendTask,
            },
          ]
        }
      />

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
    </>
  );
}
