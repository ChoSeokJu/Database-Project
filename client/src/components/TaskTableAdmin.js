import React from 'react';
import MaterialTable from 'material-table';

class TaskTableAdmin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MaterialTable
        title="태스크 목록"
        columns={[{ title: '이름', field: 'name' }]}
        data={[
          { name: '카드 뭐시기 데이터' },
          { name: '카드 그시기 데이터' },
          { name: '카드 뭐시기 데이터' },
          { name: '카드 그시기 데이터' },
        ]}
        actions={[
          {
            icon: 'add',
            tooltip: '태스크 추가',
            isFreeAction: true,
            onClick: (event) => alert('태스크를 추가하고 싶다구?'),
          },
        ]}
      />
    );
  }
}

export default TaskTableAdmin;
