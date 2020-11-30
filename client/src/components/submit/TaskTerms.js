import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

export default function TaskTerms({
  open,
  handleClose,
  handleConfirm,
  taskName,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {taskName}
        {' '}
        참가 신청
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          태스크에 참가하기 위해서는 [개인정보 이용 동의]가 필요하며, 동의하지
          않을 경우 해당 태스크에 참여할 수 없습니다.
          {' '}
        </Typography>
        <Typography variant="body2">
          참가 신청 후 신청 취소는 불가능하며, 관리자의 신청 확인 절차가
          진행됩니다. 신청 확인이 지연될 수 있으니 양해 부탁드립니다.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default" variant="contained">
          취소
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          동의 및 참가 신청
        </Button>
      </DialogActions>
    </Dialog>
  );
}
