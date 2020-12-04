/* eslint-disable react/jsx-filename-extension */
import React, { createRef, useState } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import { useDispatch } from 'react-redux';
import UserInfo from './UserInfo';
import { getAdmin, postAdmin } from '../../services/user.service';
import { openAlert, setAlertType, setMessage } from '../../actions/message';

export default function TaskUserListTable({ taskName }) {
  const [openUserInfo, setOpenUserInfo] = useState({ open: false, Uid: 0 });
  const dispatch = useDispatch();

  const pendingTableRef = createRef();
  const approvedTableRef = createRef();

  // TODO: 완료! 유저 승인
  const handleApproval = (event, rowData) => {
    postAdmin('/task/approve', {
      taskName,
      Uid: rowData.Uid,
    }).then(
      (response) => {
        pendingTableRef.current && pendingTableRef.current.onQueryChange();
        approvedTableRef.current && approvedTableRef.current.onQueryChange();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
      }
    );
  };
  // TODO: 완료! 유저 거절
  const handleRejection = (event, rowData) => {
    postAdmin('/task/reject', {
      taskName,
      Uid: rowData.Uid,
    }).then(
      (response) => {
        pendingTableRef.current && pendingTableRef.current.onQueryChange();
        approvedTableRef.current && approvedTableRef.current.onQueryChange();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
      }
    );
  };

  const handleUserInfo = (event, rowData) => {
    setOpenUserInfo({ open: true, Uid: rowData.Uid });
  };

  const handleClose = () => {
    setOpenUserInfo({ open: false, Uid: 0 });
  };

  // TODO: 완료! 대기중인 유저 목록 받아오기
  const getPendingUserList = (query) =>
    new Promise((resolve, reject) => {
      getAdmin('/task/pending', {
        taskName,
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          const { data, page, totalCount } = response.data;
          resolve({
            data,
            page: page - 1,
            totalCount,
          });
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

  // TODO: 완료! 승인된 유저의 목록 받아오기
  const getApprovedUserList = (query) =>
    new Promise((resolve, reject) => {
      getAdmin('/task/approved', {
        taskName,
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          const { data, page, totalCount } = response.data;
          resolve({
            data,
            page: page - 1,
            totalCount,
          });
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

  const MaterialTableFixed = (props) => (
    <MaterialTable
      {...props}
      components={{
        Container: (props) => <Paper {...props} elevation={0} />,
        OverlayLoading: (props) => null,
      }}
      options={{
        pageSize: 3,
        pageSizeOptions: [],
        actionsColumnIndex: -1,
        paginationType: 'stepped',
        search: false,
        sorting: false,
      }}
      localization={{
        body: {
          emptyDataSourceMessage: '',
        },
        header: {
          actions: '',
        },
      }}
      columns={[
        {
          title: '아이디',
          field: 'ID',
          sorting: false,
        },
        {
          title: '이름',
          field: 'Name',
          sorting: false,
        },
      ]}
    />
  );

  return (
    <>
      <MaterialTableFixed
        tableRef={pendingTableRef}
        title="대기중인 회원 목록"
        actions={[
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
            onClick: handleUserInfo,
          },
        ]}
        data={getPendingUserList}
      />
      <MaterialTableFixed
        tableRef={approvedTableRef}
        title="참여 중인 회원 목록"
        actions={[
          {
            icon: 'info',
            tooltip: '회원 정보',
            onClick: handleUserInfo,
          },
        ]}
        data={getApprovedUserList}
      />
      <UserInfo
        open={openUserInfo.open}
        handleClose={handleClose}
        Uid={openUserInfo.Uid}
      />
    </>
  );
}
