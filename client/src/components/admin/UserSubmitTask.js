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
import { getAdmin } from '../../services/user.service';
import TaskDetail from '../submit/TaskDetail';

export default function UserEvalTask({ open, handleClose, Uid, ID }) {
  const [openTaskDetail, setOpenTaskDetail] = useState({
    open: false,
    taskName: '',
  });
  // TODO: 유저가 제출한 파싱 데이터 목록을 가져오기.
  const getTaskData = (query) =>
    new Promise((resolve, reject) => {
      getAdmin('/submitter/task-list', {
        Uid,
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          const { data, page, totalCount } = response.data;
          console.log(data);
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

  const renderButton = (rowData) => (
    <Button
      color="primary"
      variant="contained"
      onClick={handleInfo(rowData)}
      style={{ whiteSpace: 'nowrap' }}
    >
      상세정보
    </Button>
  );

  const handleCloseDetail = () => {
    setOpenTaskDetail({ open: false, taskName: '' });
  };
  const handleInfo = (rowData) => () => {
    setOpenTaskDetail({ open: true, taskName: rowData.taskName });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {ID} 회원이 참여중인 태스크
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
              {
                title: '태스크 이름',
                field: 'taskName',
                cellStyle: {
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: 100,
                  width: '20%',
                },
              },
              {
                title: '태스크 설명',
                field: 'taskDesc',
                cellStyle: {
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: 600,
                  width: '70%',
                },
              },
              {
                field: 'evaluated',
                align: 'right',
                render: (rowData) => renderButton(rowData),
              },
            ]}
            data={getTaskData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <TaskDetail
        open={openTaskDetail.open}
        handleClose={handleCloseDetail}
        taskName={openTaskDetail.taskName}
        permit="approved"
        Uid={Uid}
      />
    </>
  );
}
