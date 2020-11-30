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
          { title: '제출일자', field: 'date' },
          { title: '점수', field: 'score' },
          { title: 'P/NP', field: 'PNP' },
        ]}
        data={data}
        style={{}}
      />
    </div>
  );
}
