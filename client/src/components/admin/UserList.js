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
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import TextField from '@material-ui/core/TextField';
import TaskUserList from './TaskUserList';
import TaskInfo from './TaskInfo';
import { setTaskData } from '../../actions/taskData';
import AppendOGDataTypeDialog from './AppendOGDataTypeDialog';
import UserInfo from './UserInfo';

const parseUType = { admin: '관리자', eval: '평가자', submit: '제출자' };

const parseGender = { undefined: '성별', male: '남성', female: '여성' };

const searchCriteria = [
  { label: '전체', value: 'all' },
  { label: '아이디', value: 'ID' },
  { label: '참여중인 태스크', value: 'task' },
  { label: '성별', value: 'Gender' },
];

const parseUser = ({ Uid, ID, UType, Bdate, Gender }) => ({
  Uid,
  ID,
  UType: parseUType[UType],
  Bdate,
  Gender: parseGender[Gender],
});

const parseUserList = (data) => data.map((user) => parseUser(user));

export default function TaskTableAdmin(props) {
  const tableRef = React.createRef();
  const [openUserInfo, setOpenUserInfo] = useState({
    open: false,
    Uid: '',
  });
  const [openUserTask, setOpenUserTask] = useState({
    open: false,
    Uid: '',
  });
  const [searchCriterion, setSearchCriterion] = useState(
    searchCriteria[0].value
  );

  const handleUserInfo = (rowData) => () => {
    setOpenUserInfo({ open: true, Uid: rowData.Uid });
  };
  const handleUserTask = (rowData) => () => {
    setOpenUserTask({ open: true, Uid: rowData.Uid });
  };
  const handleCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
  };

  const handleClose = () => {
    setOpenUserInfo({ open: false, Uid: '' });
    setOpenUserTask({ open: false, Uid: '' });
  };

  // TODO: 유저 목록 불러오기
  const getUsers = (query) =>
    new Promise((resolve, reject) => {
      if (!query.search) {
        // TODO: 검색 문구가 없을 경우
        setTimeout(
          () =>
            resolve({
              data: parseUserList([
                {
                  Uid: '1',
                  ID: 'babo1',
                  UType: 'admin',
                  Bdate: 12,
                  Gender: 'female',
                },
                {
                  Uid: '2',
                  ID: 'babo2',
                  UType: 'eval',
                  Bdate: 12,
                  Gender: 'male',
                },
                {
                  Uid: '3',
                  ID: 'babo3',
                  UType: 'submit',
                  Bdate: 12,
                  Gender: 'female',
                },
                {
                  Uid: '4',
                  ID: 'babo4',
                  UType: 'eval',
                  Bdate: 12,
                  Gender: 'male',
                },
                {
                  Uid: '5',
                  ID: 'babo5',
                  UType: 'submit',
                  Bdate: 12,
                  Gender: 'female',
                },
                {
                  Uid: '6',
                  ID: 'babo6',
                  UType: 'submit',
                  Bdate: 12,
                  Gender: 'female',
                },
                {
                  Uid: '7',
                  ID: 'babo7',
                  UType: 'submit',
                  Bdate: 12,
                  Gender: 'male',
                },
              ]),
              page: query.page,
              totalCount: 100,
            }),

          500
        );
      } else {
        // TODO: 검색 문구가 있을 경우. searchCriterion까지 같이 보내야 한다
        setTimeout(
          () =>
            resolve({
              data: parseUserList([
                {
                  Uid: '1',
                  ID: 'babo1',
                  UType: 'admin',
                  Bdate: 12,
                  Gender: 'male',
                },
              ]),
              page: query.page,
              totalCount: 1,
            }),
          200
        );
      }
    });

  return (
    <>
      <Container maxWidth="md">
        <MaterialTable
          title="회원 관리"
          tableRef={tableRef}
          options={{
            pageSize: 8,
            pageSizeOptions: [],
            paginationType: 'stepped',
            sorting: false,
            debounceInterval: 1000,
          }}
          localization={{
            body: {
              emptyDataSourceMessage: '유저가 없습니다',
            },
          }}
          columns={[
            {
              title: '아이디',
              field: 'ID',
            },
            {
              title: '역할',
              field: 'UType',
            },
            {
              title: '생년월일',
              field: 'Bdate',
            },
            {
              title: '성별',
              field: 'Gender',
            },
            {
              title: '상세정보',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton onClick={handleUserInfo(rowData)} size="small">
                  <InfoIcon />
                </IconButton>
              ),
            },
            {
              title: '참여중인 태스크',
              cellStyle: { width: '10%' },
              sorting: false,
              align: 'center',
              render: (rowData) => (
                <IconButton onClick={handleUserTask(rowData)} size="small">
                  <FormatListBulletedIcon />
                </IconButton>
              ),
            },
          ]}
          data={getUsers}
          components={{
            Actions: () => (
              <TextField
                select
                label="검색 기준"
                value={searchCriterion}
                onChange={handleCriterionChange}
                SelectProps={{
                  native: true,
                }}
                size="small"
                style={{ marginBottom: '13px' }}
              >
                {searchCriteria.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            ),
          }}
        />
      </Container>
      <UserInfo
        open={openUserInfo.open}
        handleClose={handleClose}
        Uid={openUserInfo.Uid}
      />
    </>
  );
}
