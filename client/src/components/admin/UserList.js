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
import { useDispatch } from 'react-redux';
import TaskUserList from './TaskUserList';
import TaskInfo from './TaskInfo';
import { setTaskData } from '../../actions/taskData';
import AppendOGDataTypeDialog from './AppendOGDataTypeDialog';
import UserInfo from './UserInfo';
import { openAlert, setAlertType, setMessage } from '../../actions/message';
import UserEvalTask from './UserEvalTask';
import UserSubmitTask from './UserSubmitTask';
import { getAdmin } from '../../services/user.service';

const parseUType = { admin: '관리자', eval: '평가자', submit: '제출자' };

const parseGender = { undefined: '성별', male: '남성', female: '여성' };

const searchCriteria = [
  { label: '전체', value: 'all' },
  { label: '아이디', value: 'ID' },
  { label: '참여중인 태스크', value: 'task' },
  { label: '나이대', value: 'age' },
  { label: '성별', value: 'Gender' },
];

const parseUser = ({ Uid, ID, UType, Bdate, Gender }) => ({
  Uid,
  ID,
  UType,
  UserType: parseUType[UType],
  Bdate,
  Gender: parseGender[Gender],
});

const parseUserList = (data) => data.map((user) => parseUser(user));

export default function TaskTableAdmin(props) {
  const dispatch = useDispatch();

  const [openUserInfo, setOpenUserInfo] = useState({
    open: false,
    Uid: '',
  });
  const [openEvalTask, setOpenEvalTask] = useState({
    open: false,
    Uid: '',
    ID: '',
  });
  const [openSubmitTask, setOpenSubmitTask] = useState({
    open: false,
    Uid: '',
    ID: '',
  });
  const [searchCriterion, setSearchCriterion] = useState(
    searchCriteria[0].value
  );

  const handleUserInfo = (rowData) => () => {
    setOpenUserInfo({ open: true, Uid: rowData.Uid });
  };

  const handleUserTask = (rowData) => () => {
    switch (rowData.UType) {
      case 'admin':
        dispatch(setAlertType('error'));
        dispatch(setMessage('관리자는 관련 태스크가 없습니다'));
        dispatch(openAlert());
        break;
      case 'eval':
        setOpenEvalTask({ open: true, Uid: rowData.Uid, ID: rowData.ID });
        break;
      case 'submit':
        setOpenSubmitTask({ open: true, Uid: rowData.Uid, ID: rowData.ID });
        break;
      default:
    }
  };

  const handleCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
  };

  const handleClose = () => {
    setOpenUserInfo({ open: false, Uid: '', ID: '' });
    setOpenEvalTask({ open: false, Uid: '', ID: '' });
    setOpenSubmitTask({ open: false, Uid: '', ID: '' });
  };

  // TODO: 완료! 유저 목록 불러오기
  const getUsers = (query) =>
    new Promise((resolve, reject) => {
      if (!query.search) {
        // TODO: 완료! 검색 문구가 없을 경우
        getAdmin('/user-info/all', {
          per_page: query.pageSize,
          page: query.page + 1,
        }).then(
          (response) => {
            const { data, page, totalCount } = response.data;
            resolve({
              data: parseUserList(data),
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
      } else {
        // TODO: 완료! 검색 문구가 있을 경우. searchCriterion까지 같이 보내야 한다
        getAdmin('/user-info/search', {
          search: query.search,
          searchCriterion,
          per_page: query.pageSize,
          page: query.page + 1,
        }).then(
          (response) => {
            const { data, page, totalCount } = response.data;
            resolve({
              data: parseUserList(data),
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
      }
    });

  return (
    <>
      <Container maxWidth="md">
        <MaterialTable
          title="회원 관리"
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
              field: 'UserType',
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
      <UserEvalTask
        open={openEvalTask.open}
        handleClose={handleClose}
        Uid={openEvalTask.Uid}
        ID={openEvalTask.ID}
      />
      <UserSubmitTask
        open={openSubmitTask.open}
        handleClose={handleClose}
        Uid={openSubmitTask.Uid}
        ID={openSubmitTask.ID}
      />
    </>
  );
}
