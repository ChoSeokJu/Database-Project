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
import { setOriginalData, setSchemaName } from '../../actions/originalData';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
  },
}));

export default function AppendOGDataType(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, name } = useSelector((state) => state.originalData);

  const isDuplicated = (newData) =>
    data.some(({ originalColumnName: oldName }) => {
      if (oldName === newData.originalColumnName) {
        return true;
      }
    });

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            required
            label="원본 데이터 스키마 이름"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => dispatch(setSchemaName(e.target.value))}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <MaterialTable
        title="원본 데이터 스키마"
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        options={{
          pageSize: 6,
          pageSizeOptions: [],
          actionsColumnIndex: -1,
          paginationType: 'stepped',
          search: false,
        }}
        localization={{
          body: {
            emptyDataSourceMessage: '칼럼 정보가 없습니다',
          },
          header: {
            actions: '',
          },
        }}
        columns={[
          { title: '태스크 칼럼', field: 'columnName', editable: 'never' },
          { title: '원본 데이터 칼럼', field: 'originalColumnName' },
        ]}
        data={data}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const update = () => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                dispatch(setOriginalData([...dataUpdate]));
                resolve();
              };
              if (newData.originalColumnName === oldData.originalColumnName) {
                update();
              } else if (isDuplicated(newData)) {
                dispatch(setMessage('이미 존재하는 원본 칼럼 이름입니다'));
                dispatch(openDialog());
                reject();
              } else if (!newData.originalColumnName) {
                dispatch(setMessage('값을 입력해주세요'));
                dispatch(openDialog());
                reject();
              } else {
                update();
              }
            }),
        }}
      />
    </>
  );
}
