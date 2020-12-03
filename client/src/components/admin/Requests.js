import React, { useState } from 'react';
import MaterialTable, { MTableBodyRow } from 'material-table';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TaskRequest from '../TaskRequest';
import { getAdmin } from '../../services/user.service';

export default function Requests() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openRequest, setOpenRequest] = useState({ open: false, title: '', content: '' });

  const onRowClick = (event, rowData) => {
    setOpenRequest({ open: true, title: rowData.title, content: rowData.content });
  };

  const handleClose = () => {
    setOpenRequest({ open: false });
  };

  // TODO: 완료! Request 목록 받아오기
  const getRequests = (query) => new Promise((resolve, reject) => {
    getAdmin('/request', {
      per_page: query.pageSize,
      page: query.page + 1,
    }).then((response) => {
      const { data, page, totalCount } = response.data;
      resolve({
        data, page: page - 1, totalCount,
      });
    }, (error) => {
      const message = (error.response
        && error.response.data
        && error.response.data.message)
        || error.message
        || error.toString();
      reject(message);
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
          localization={{
            body: {
              emptyDataSourceMessage: '태스크 요청이 없습니다',
            },
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
