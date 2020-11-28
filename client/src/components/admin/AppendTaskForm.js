/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';
import {
  setTaskData,
  setTaskName,
  setMinPeriod,
  setPassCriteria,
  setDescription,
} from '../../actions/taskData';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
  },
}));

const types = { int: 'INT', float: 'FLOAT', char: 'CHAR' };

export default function AppendTaskForm() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { data, taskName, minPeriod, passCriteria, description } = useSelector(
    (state) => state.taskData
  );

  const isDuplicated = (newData) =>
    data.some(({ columnName: oldName }) => {
      if (oldName === newData.columnName) {
        return true;
      }
    });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            label="태스크 이름"
            fullWidth
            value={taskName}
            onChange={(e) => dispatch(setTaskName(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="최소 주기(일)"
            type="number"
            fullWidth
            value={minPeriod}
            onChange={(e) => dispatch(setMinPeriod(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Pass 기준(0~10)"
            type="number"
            fullWidth
            value={passCriteria}
            onChange={(e) => dispatch(setPassCriteria(e.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="설명"
            fullWidth
            multiline
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <MaterialTable
        title="데이터 스키마"
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        options={{
          pageSize: 4,
          pageSizeOptions: [],
          actionsColumnIndex: -1,
          paginationType: 'stepped',
          search: false,
        }}
        localization={{
          body: {
            emptyDataSourceMessage: '칼럼을 추가해 주세요',
            addTooltip: '스키마 추가',
            editRow: {
              deleteText: '이 칼럼을 지우시겠습니까?',
            },
          },
          header: {
            actions: '',
          },
        }}
        columns={[
          { title: '칼럼', field: 'columnName' },
          { title: '타입', field: 'type', lookup: types },
        ]}
        data={data}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              console.log(newData);
              if (isDuplicated(newData)) {
                dispatch(setMessage('이미 존재하는 칼럼입니다'));
                dispatch(openDialog());
                return reject();
              }
              if (!newData.type || !newData.columnName) {
                dispatch(setMessage('값을 입력해주세요'));
                dispatch(openDialog());
                return reject();
              }
              dispatch(setTaskData([...data, newData]));
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const update = () => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                dispatch(setTaskData([...dataUpdate]));
                resolve();
              };
              if (newData.columnName === oldData.columnName) {
                update();
              } else if (isDuplicated(newData)) {
                dispatch(setMessage('이미 존재하는 칼럼입니다'));
                dispatch(openDialog());
                reject();
              } else if (!newData.columnName) {
                dispatch(setMessage('값을 입력해주세요'));
                dispatch(openDialog());
                reject();
              } else {
                update();
              }
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(setTaskData([...dataDelete]));
              resolve();
            }),
        }}
      />
    </>
  );
}
