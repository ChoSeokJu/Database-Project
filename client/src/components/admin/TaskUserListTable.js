/* eslint-disable react/jsx-filename-extension */
import React, { createRef } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

export default function TaskTableAdmin({ taskName }) {
  const pendingTableRef = createRef();
  const approvedTableRef = createRef();

  const handleApproval = (event, rowData) => {
    alert(`회원 ${rowData.name} Uid ${rowData.Uid} 를 승인`);
    pendingTableRef.current && pendingTableRef.current.onQueryChange();
    approvedTableRef.current && approvedTableRef.current.onQueryChange();
    // 리콜 마지막에 호출해야한다
  };
  const handleRejection = (event, rowData) => {
    alert(`회원 ${rowData.name} Uid ${rowData.Uid} 를 거절`);
    pendingTableRef.current && pendingTableRef.current.onQueryChange();
    approvedTableRef.current && approvedTableRef.current.onQueryChange();
    // 리콜 마지막에 호출해야한다
  };
  const handleInfo = (event, rowData) => {
    alert(`회원 ${rowData.name}의 정보`);
  };

  const getPendingUserList = (query) => new Promise((resolve, reject) => {
    setTimeout(() => resolve({
      data: [
        { ID: 'username1', Name: '회원1', Uid: 1 },
        { ID: 'username2', Name: '회원2', Uid: 2 },
        { ID: 'username3', Name: '회원3', Uid: 3 },
      ],
      page: query.page,
      totalCount: 100,
    }), 500);
  });

  const getApprovedUserList = (query) => new Promise((resolve, reject) => {
    setTimeout(() => resolve({
      data: [
        { ID: 'username1', Name: '회원1', Uid: 1 },
        { ID: 'username2', Name: '회원2', Uid: 2 },
        { ID: 'username3', Name: '회원3', Uid: 3 },
      ],
      page: query.page,
      totalCount: 100,
    }), 500);
  });

  const MaterialTableFixed = (props) => (
    <MaterialTable
      {...props}
      components={{
        Container: (props) => <Paper {...props} elevation={0} />,
      }}
      options={{
        pageSize: 3,
        pageSizeOptions: [],
        actionsColumnIndex: -1,
        paginationType: 'stepped',
        search: false,
      }}
      localization={{
        header: {
          actions: '',
        },
      }}
      columns={[
        { title: '아이디', field: 'ID' },
        { title: '이름', field: 'Name' }]}
    />
  );

  return (
    <>
      <MaterialTableFixed
        tableRef={pendingTableRef}
        title="대기중인 회원 목록"
        actions={
          [
            {
              icon: 'check',
              tooltip: '승인',
              onClick: handleApproval,
            },
            {
              icon: 'clear',
              tooltip: '거절',
              onClick: handleRejection,
            },
            {
              icon: 'info',
              tooltip: '회원 정보',
              onClick: handleInfo,
            },
          ]
        }
        data={getPendingUserList}
      />
      <MaterialTableFixed
        tableRef={approvedTableRef}
        title="참여 중인 회원 목록"
        actions={
          [
            {
              icon: 'info',
              tooltip: '회원 정보',
              onClick: handleInfo,
            },
          ]
        }
        data={getApprovedUserList}
      />
    </>
  );
}