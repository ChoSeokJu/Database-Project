import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { green, red, grey } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import DataEvalDialog from './DataEvalDialog';
import { getEval } from '../../services/user.service';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';

const useStyles = makeStyles((theme) => ({
  button: {
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(2),
  },
  check: {
    color: green[500],
    fontSize: 35,
    marginRight: theme.spacing(1),
  },
  close: {
    color: red[500],
    fontSize: 35,
    marginRight: theme.spacing(1),
  },
}));

export default function TaskTableSubmit() {
  const tableRef = React.createRef();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openEvalDialog, setOpenEvalDialog] = useState({
    open: false,
    Pid: null,
  });

  const handleClose = () => {
    tableRef.current && tableRef.current.onQueryChange();
    setOpenEvalDialog({ open: false, Pid: null });
  };

  const handleEvalDialog = (Pid) => () => {
    setOpenEvalDialog({
      open: true,
      Pid,
    });
  };

  const handleDialog = (message) => () => {
    dispatch(setMessage(message));
    dispatch(openDialog());
  };

  const renderButton = (rowData) => {
    if (!rowData.isEvaluated) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleEvalDialog(rowData.Pid)}
        >
          평가하기
        </Button>
      );
    }
    return (
      <>
        <Box display="flex" flexDirection="row" alignItems="center">
          {rowData.evalContent.Pass ? (
            <Tooltip title="Pass">
              <CheckIcon className={classes.check} />
            </Tooltip>
          ) : (
            <Tooltip title="Non-Pass">
              <CloseIcon className={classes.close} />
            </Tooltip>
          )}
          <Rating value={rowData.evalContent.Score} readOnly />
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleDialog(rowData.evalContent.Desc)}
          >
            상세의견
          </Button>
        </Box>
      </>
    );
  };

  // TODO: 완료! 평가자 데이터 목록 불러오기
  const getTask = (query) =>
    new Promise((resolve, reject) => {
      getEval('/', {
        per_page: query.pageSize,
        page: query.page + 1,
      }).then(
        (response) => {
          const { data, page, totalCount } = response.data;
          console.log(data);
          const dataParsed = data.map((row) => ({
            taskName: row.TaskName,
            OGDataType: row.OGDataTypeName,
            submitID: row.ID,
            submitDate: row.TimeStamp.match(/\d{4}-\d{2}-\d{2}/g)[0],
            Pid: row.Pid,
            isEvaluated: row.isEvaluated,
            evalContent: row.evalContent,
          }));
          resolve({
            data: dataParsed,
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

  return (
    <>
      <Container component="main" maxWidth="md">
        <MaterialTable
          tableRef={tableRef}
          title="태스크 목록"
          data={getTask}
          options={{
            pageSize: 8,
            pageSizeOptions: [],
            actionsColumnIndex: -1,
            paginationType: 'stepped',
            search: false,
            sorting: false,
          }}
          localization={{
            header: {
              actions: '',
            },
            body: {
              emptyDataSourceMessage: '할당받은 데이터가 없습니다',
            },
          }}
          columns={[
            { title: '태스크', field: 'taskName' },
            { title: '데이터 스키마', field: 'OGDataType' },
            { title: '제출자ID', field: 'submitID' },
            { title: '제출 일자', field: 'submitDate' },
            {
              field: 'evaluated',
              align: 'right',
              render: (rowData) => renderButton(rowData),
            },
          ]}
        />
      </Container>
      <DataEvalDialog
        open={openEvalDialog.open}
        handleClose={handleClose}
        Pid={openEvalDialog.Pid}
      />
    </>
  );
}
