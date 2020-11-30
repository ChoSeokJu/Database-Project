import React from 'react';

export default function UserSubmitTask({ open, handleClose, Uid }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{taskName}의 회원 목록</DialogTitle>
      <DialogContent>
        <MaterialTable
          {...props}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          options={{
            pageSize: 3,
            pageSizeOptions: [],
            actionsColumnIndex: -1,
            paginationType: 'stepped',
            search: false,
            sorting: false,
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
            {
              title: '아이디',
              field: 'ID',
              sorting: false,
            },
            {
              title: '이름',
              field: 'Name',
              sorting: false,
            },
          ]}
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
