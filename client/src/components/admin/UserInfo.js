/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import GetAppIcon from '@material-ui/icons/GetApp';
import TaskUserTable from './TaskUserListTable';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

const fields = ({
  ID, Name, Gender, UType, Addr, Bdate, PhoneNo, Score,
}) => {
  const userTypeMap = {
    admin: '관리자',
    eval: '평가자',
    submit: '제출자',
  };
  const genderMap = {
    undeclared: '성별',
    male: '남자',
    female: '여자',
  };
  return [
    { key: '아이디', value: ID },
    { key: '이름', value: Name },
    { key: '성별', value: genderMap[Gender] },
    { key: '역할', value: userTypeMap[UType] },
    { key: '주소', value: Addr },
    { key: '생년월일', value: Bdate },
    { key: '휴대전화', value: PhoneNo },
    { key: '평균 평가 점수', value: Score },
  ];
};

export default function UserInfo({ open, handleClose, Uid }) {
  const classes = useStyles();

  // TODO: 유저 정보 받아오기
  const getUserInfo = (query) => new Promise((resolve, reject) => {
    setTimeout(
      () => resolve({
        data: fields({
          ID: 'username',
          Name: '홍길동',
          Gender: 'male',
          UType: 'submit',
          Addr: '서울특별시 서대문구 신촌동 연세로 50',
          Bdate: '2020-01-01',
          PhoneNo: '010-1234-1234',
          Score: '8점',
        }),
        page: query.page,
        totalCount: 8,
      }),
      500,
    );
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogContent>
        <MaterialTable
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          options={{
            pageSize: 8,
            paging: false,
            toolbar: false,
            sorting: false,
            header: false,
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
            { field: 'key', cellStyle: { width: '30%' } },
            { field: 'value', cellStyle: { width: '70%' } },
          ]}
          data={getUserInfo}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
