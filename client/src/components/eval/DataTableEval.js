import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import DataEvalDialog from './DataEvalDialog';

export default function TaskTableSubmit() {
  const [openEvalDialog, setOpenEvalDialog] = useState({
    open: false,
    Pid: null,
  });

  const handleClose = () => {
    setOpenEvalDialog({ open: false, Pid: null });
  };

  const handleEvalDialog = (Pid) => () => {
    setOpenEvalDialog({
      open: true,
      Pid,
    });
  };

  const renderButton = (rowData) => {
    if (!rowData.evaluated) {
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
      <Button
        variant="contained"
        disabled
      >
        평가완료
      </Button>
    );
  };

  const getTask = (query) => new Promise((resolve, reject) => {
    setTimeout(
      () => resolve({
        data: [
          {
            Pid: 1,
            taskName: '태스크1',
            submitID: 'babo1',
            OGDataType: '스키마1',
            evaluated: false,
          },
          {
            Pid: 2,
            taskName: '태스크2',
            submitID: 'babo1',
            OGDataType: '스키마2',
            evaluated: false,
          },
          {
            Pid: 3,
            taskName: '태스크3',
            submitID: 'babo1',
            OGDataType: '스키마3',
            evaluated: false,
          },
          {
            Pid: 4,
            taskName: '태스크4',
            submitID: 'babo1',
            OGDataType: '스키마4',
            evaluated: true,
          },
          {
            Pid: 5,
            taskName: '태스크1',
            submitID: 'babo1',
            OGDataType: '스키마1',
            evaluated: true,
          },
        ],
        page: query.page,
        totalCount: 100,
      }),
      500,
    );
  });

  return (
    <>
      <Container component="main" maxWidth="md">
        <MaterialTable
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
          }}
          columns={[
            { title: '태스크', field: 'taskName' },
            { title: '제출자ID', field: 'submitID' },
            { title: '데이터 스키마', field: 'OGDataType' },
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
