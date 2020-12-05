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
import { getAdmin, downloadAdmin } from '../../services/user.service';

export default function UserEvalTask({ open, handleClose, Uid, ID }) {
  const dispatch = useDispatch();
  // TODO: 유저가 제출한 파싱 데이터 목록을 가져오기.
  const getParsedData = (query) =>
    new Promise((resolve, reject) => {
      getAdmin('/user-info/eval', {
        Uid,
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          const { data, page, totalCount } = response.data;
          console.log(data);
          const parsedData = data.map((row) => ({
            Pid: row.Pid,
            taskName: row.parsing_datum.TaskName,
            date: row.TimeStamp.match(/\d{4}-\d{2}-\d{2}/g)[0],
            score: row.Score,
            PNP: row.Pass ? 'P' : 'NP',
          }));
          console.log(parsedData);
          resolve({
            data: parsedData,
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

  const handleParsedDataDownload = (event, rowData) => {
    // TODO: 완료! 파싱된 데이터 다운로드 Pid를 요청에 넣어야함.
    downloadAdmin('/task/parsed-data/download', {
      Pid: rowData.Pid,
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
              body: {
                emptyDataSourceMessage: '평가한 데이터가 없습니다',
              },
            }}
            columns={[
              { title: '태스크 이름', field: 'taskName' },
              { title: '제출일자', field: 'date' },
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
