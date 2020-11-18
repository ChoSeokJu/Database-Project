import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { TaskTableAdmin } from '../../components';

class Admin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box>
        <Container component="main" maxWidth="md">
          <TaskTableAdmin />
        </Container>
      </Box>
    );
  }
}

export default Admin;
