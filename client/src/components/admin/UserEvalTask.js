/* eslint-disable react/jsx-filename-extension */
import React, { createRef, useState } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch } from 'react-redux';
import download from 'downloadjs';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';
import { getAdmin, getAdminBlob } from '../../services/user.service';

export default function UserEvalTask({ open, handleClose, Uid, ID }) {
  const dispatch = useDispatch();
  // TODO: 유저가 제출한 파싱 데이터 목록을 가져오기.
  const getParsedData = (query) =>
    new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve({
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
        500
      );
    });

  const handleParsedDataDownload = (event, rowData) => {
    // TODO: 완료! 파싱된 데이터 다운로드 Pid를 요청에 넣어야함.
    getAdminBlob('/task/parsed-data/download', {
      Pid: rowData.Pid,
    })
      .then((blob) => {
        const fileName = blob.headers['content-disposition'].split('"')[1];
        download(blob.data, fileName);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setAlertType('error'));
        dispatch(setMessage(message));
        dispatch(openAlert());
      });
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
          {ID} 회원이 평가한 파싱 데이터 시퀀스 파일
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
              { title: '제출일자', field: 'date' },
              { title: '원본 데이터 타입', field: 'OGDataType' },
              { title: '평가 점수', field: 'score' },
              { title: 'P/NP', field: 'PNP' },
            ]}
            actions={[
              {
                icon: 'download',
                tooltip: '다운로드',
                onClick: handleParsedDataDownload,
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
