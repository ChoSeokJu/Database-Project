/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import AppendOGDataType from './AppendOGDataType';
import { setOriginalData, clearOriginalData } from '../../actions/originalData';
import {
  openAlert,
  openDialog,
  setAlertType,
  setMessage,
} from '../../actions/message';

export default function AppendOGDataTypeDialog({
  open,
  handleClose,
  taskName,
}) {
  const dispatch = useDispatch();
  const { data, name } = useSelector((state) => state.originalData);

  useEffect(() => {
    if (open) {
      dispatch(clearOriginalData());
      /* TODO: task에 대한 scheme 다운로드해서 setTaskData에 넣음. */
      dispatch(
        setOriginalData([
          { columnName: '스키마1', originalColumnName: '' },
          { columnName: '스키마2', originalColumnName: '' },
          { columnName: '스키마3', originalColumnName: '' },
        ]),
      );
    }
  }, [open]);

  const isNullExist = () => data.some((entry) => !entry.originalColumnName);

  const handleSubmit = () => {
    if (!name) {
      dispatch(setAlertType('error'));
      dispatch(setMessage('스키마 이름을 입력해주세요'));
      dispatch(openAlert());
      return;
    }
    if (isNullExist()) {
      dispatch(setMessage('비어있는 데이터 스키마는 전부 NULL로 들어갑니다'));
      dispatch(openDialog());
    }
    // TODO: 원본 데이터 스키마 제출하기
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {taskName}
        에 원본 데이터 스키마 추가
      </DialogTitle>
      <DialogContent>
        <AppendOGDataType />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          취소
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
