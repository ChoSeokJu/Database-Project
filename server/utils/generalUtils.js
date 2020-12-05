const multer = require('multer');

exports.csvSanityCheck = function (data) {
  /* check if the submitted csv file has headers that fit the mapping information in og_data_type */
  console.log(data);
  return true;
};

exports.nowDate = function (x) {
  /* for current date/time/datetime to be input in db */
  /* x: "Date"|"Time"|"DateTime" */
  const date = new Date();
  const parts = date.toLocaleDateString().split('/');
  const formattedDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
  if (x == 'Date') {
    return formattedDate;
  }
  if (x.includes('Time')) {
    const unformattedTime = date.toLocaleTimeString();
    let formattedTime = unformattedTime
      .replace(/ (AM)|(PM)/i, '')
      .replace(' ', '');
    if (
      unformattedTime.substring(
        unformattedTime.length - 2,
        unformattedTime.length
      ) == 'PM'
    ) {
      const n = formattedTime.length;
      if (formattedTime.length % 2 == 0) {
        formattedTime =
          (parseInt(formattedTime.substring(0, 1)) + 12).toString() +
          formattedTime.substring(2, n);
      } else {
        formattedTime =
          (parseInt(formattedTime.charAt(0)) + 12).toString() +
          formattedTime.substring(1, n);
      }
    } else if (formattedTime.length % 2 != 0) {
      formattedTime = `0${formattedTime}`;
    }
    if (x == 'DateTime') {
      return `${formattedDate} ${formattedTime}`;
    }
    if (x == 'Time') {
      return formattedTime;
    }
  }
};

exports.upload = multer({
  dest: 'uploads/',
});

exports.finalScore = function (x) {
  const { SubmitCnt, TotalTupleCnt, DuplicatedTupleCnt, NullRatio } = x;
  const { Score, Pass } = x.evaluates[0];

  return {
    totalScore:
      SubmitCnt +
      TotalTupleCnt +
      DuplicatedTupleCnt +
      Object.values(NullRatio).reduce((a, b) => a + b, 0) +
      Score,
    Pass,
  };
};

exports.isInt = (n) => Number(n) === n && n % 1 === 0;

exports.isFloat = (n) => Number(n) === n && n % 1 !== 0;

exports.typeCheck = (type, item) => {
  if ((item == null) | (item == undefined)) {
    return true;
  }
  if (type == 'INT') {
    return this.isInt(item);
  }
  if (type == 'FLOAT') {
    return this.isFloat(item);
  }
  if (type == 'VARCHAR') {
    return typeof item === 'string';
  }
};

exports.permitState = (n) => {
  if (n == 'approved') {
    return '신청승인';
  }
  if (n == 'pending') {
    return '승인대기';
  }
  if (n == 'rejected') {
    return '신청거절';
  }
  if (n == null) {
    return '미신청';
  }
};
exports.returnPass = (n) => {
  if (n == undefined) {
    return null;
  }
  if (Object.keys(n).includes('Pass')) {
    return n.Pass;
  }
  return null;
};
