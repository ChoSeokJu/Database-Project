/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';
import {
  setOriginalData,
  setSchemaName,
  setColumns,
} from '../../actions/originalData';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function AppendOGDataType(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, name, columns } = useSelector((state) => state.originalData);
  const [columnName, setColumnName] = useState('');

  const isDuplicated = (newData) =>
    data.some(({ originalColumnName: oldName }) => {
      if (oldName === newData.originalColumnName) {
        return true;
      }
    });

  const handleAppendColumn = () => {
    if (columnName.trim() === '') {
      dispatch(setAlertType('error'));
      dispatch(setMessage('칼럼 이름은 빈칸이 될 수 없습니다'));
      dispatch(openAlert());
      return;
    }
    if (columnName in columns && columns[columnName] !== '') {
      dispatch(setAlertType('error'));
      dispatch(setMessage('이미 있는 칼럼입니다'));
      dispatch(openAlert());
      setColumnName('');
      return;
    }

    dispatch(setColumns({ ...columns, [columnName]: columnName }));
    setColumnName('');
  };

  const handleDeleteColumn = (name) => () => {
    dispatch(setColumns({ ...columns, [name]: '' }));
    const newData = [...data];
    dispatch(
      setOriginalData(
        newData.map((row) => {
          if (row.originalColumnName === name) {
            return { ...row, originalColumnName: '' };
          }
          return row;
        })
      )
    );
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            label="원본 데이터 스키마 이름"
            fullWidth
            value={name}
            onChange={(e) => dispatch(setSchemaName(e.target.value))}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid> */}
        <Grid item xs={12}>
          <Tooltip
            open
            title="원본 데이터 칼럼을 추가하고 태스크 칼럼과 매핑해주세요"
            aria-label="add"
          >
            <TextField
              label="원본 데이터 칼럼 추가"
              fullWidth
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="칼럼 추가">
                      <IconButton
                        color="inherit"
                        position="absolute"
                        onClick={handleAppendColumn}
                        size="small"
                      >
                        <AddBoxIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Paper component="ul" className={classes.root} elevation={0}>
            {Object.keys(columns).map((name) =>
              columns[name] === '' || name === '' ? null : (
                <li key={name}>
                  <Chip
                    label={name}
                    color="primary"
                    onDelete={handleDeleteColumn(name)}
                    className={classes.chip}
                  />
                </li>
              )
            )}
          </Paper>
        </Grid>
      </Grid>
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
          sorting: false,
          toolbar: false,
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
          {
            title: '대응되는 원본 데이터 칼럼',
            field: 'originalColumnName',
            lookup: columns,
          },
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
              } else {
                update();
              }
            }),
        }}
      />
    </>
  );
}
