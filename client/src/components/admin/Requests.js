import React, { useState } from 'react';
import MaterialTable, { MTableBodyRow } from 'material-table';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TaskRequest from '../TaskRequest';

export default function Requests() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openRequest, setOpenRequest] = useState({ open: false, title: '', content: '' });

  const onRowClick = (event, rowData) => {
    setOpenRequest({ open: true, title: rowData.title, content: rowData.content });
  };

  const handleClose = () => {
    setOpenRequest({ open: false });
  };

  // TODO: Request 목록 받아오기
  const getRequests = (query) => new Promise((resolve, reject) => {
    resolve({
      data: [
        { title: 'asdf', content: 'asdfasdfasdfasdfas\ndfas\ndfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', date: '2020-12-01' },
        { title: 'asdf', content: 'asdfasdf', date: '2020-12-01' },
        { title: 'asdf', content: 'asdfasdf', date: '2020-12-01' },
        { title: 'asdf', content: 'asdfasdf', date: '2020-12-01' },
        { title: 'asdf', content: 'asdfasdf', date: '2020-12-01' },
        { title: 'asdf', content: 'asdfasdf', date: '2020-12-01' },
      ],
      page: query.page,
      totalCount: 100,
    });
  });
  return (
    <>
      <Container maxWidth="md">
        <MaterialTable
          options={{
            pageSize: 12,
            pageSizeOptions: [],
            paginationType: 'stepped',
            search: false,
            toolbar: false,
            sorting: false,
            rowStyle: (rowData) => ({
              backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF',
            }),
          }}
          columns={[
            {
              title: '제목',
              field: 'title',
              search: false,
            },
            {
              title: '내용',
              field: 'content',
              cellStyle: {
                textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 500, width: '60%',
              },
              search: false,
            },
            {
              title: '날짜',
              field: 'date',
              search: false,
            },
          ]}
          data={getRequests}
          components={{
            Row: (props) => (
              <MTableBodyRow
                {...props}
                onMouseOver={() => setSelectedRow(props.data.tableData.id)}
                onMouseOut={() => setSelectedRow(null)}
              />
            ),
          }}
          onRowClick={onRowClick}
        />
      </Container>
      <Dialog
        open={openRequest.open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <TaskRequest readOnly title={openRequest.title} content={openRequest.content} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
