import React from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#EEE',
    flex: 1,
    padding: 10,
  },
}));

const renderPNP = (rowData) => {
  if (!rowData.score) {
    return '-';
  }
  return rowData.PNP && 'P' || 'NP';
}

const renderDate = (value) => {
  return value.match(/\d{4}-\d{2}-\d{2}/g)[0];
}

export default function TaskOGDataFile({ data }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MaterialTable
        options={{
          pageSize: 3,
          pageSizeOptions: [],
          paginationType: 'stepped',
          search: false,
          toolbar: false,
          sorting: false,
        }}
        columns={[
          { title: '회차', field: 'submitCnt' },
          { title: '제출일자', render: (rowData) => renderDate(rowData.date) },
          { title: '점수', render: (rowData) => rowData.score || '-' },
          { title: 'P/NP', render: (rowData) => renderPNP(rowData) },
          { title: 'Pass된 튜플 수', render: (rowData) => rowData.TotalTupleCnt || '-' },
        ]}
        data={data}
        style={{}}
      />
    </div>
  );
}
