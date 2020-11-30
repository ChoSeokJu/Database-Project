import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  text: {
    paddingTop: theme.spacing(3),
  },
}));

export default function Copyright() {
  const classes = useStyles();
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      className={classes.text}
    >
      {'Copyright © Freeswot '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
