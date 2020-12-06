const db = require('../models');
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const {
  nowDate,
  typeCheck,
  permitState,
  returnPass,
} = require('../utils/generalUtils');

const {
  user,
  parsing_data,
  evaluate,
  works_on,
  AVG_SCORE,
  og_data_type,
  task,
} = db;
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
});

const { Op } = db.Sequelize;

user.hasMany(works_on, { foreignKey: 'Sid' });
works_on.belongsTo(user, { foreignKey: 'Sid' });

task.hasMany(works_on, { foreignKey: 'TaskName' });
works_on.belongsTo(task, { foreignKey: 'TaskName' });

og_data_type.hasMany(parsing_data, { foreignKey: 'Did' });
parsing_data.belongsTo(og_data_type, { foreignKey: 'Did' });

parsing_data.hasMany(evaluate, { foreignKey: 'Pid' });
evaluate.belongsTo(parsing_data, { foreignKey: 'Pid' });

exports.submitContent = (req, res, next) => {
  console.log(`Submit user ${req.body.username} submitted data`);
  if (!req.file) {
    return res.status(405).json({
      message:
        '파일 업로드 형식이 잘 못 되었습니다. CSV 파일로 업로드 부탁드립니다',
    });
  }
  console.log(req.body);

  og_data_type
    .findOne({
      where: {
        TaskName: req.body.taskName,
        Name: req.body.ogDataType,
      },
    })
    .then((og_data_type) => {
      if (og_data_type) {
        task
          .findOne({
            where: {
              TaskName: req.body.taskName,
            },
          })
          .then((task) => {
            req.body.taskDataTableRef = task.TableRef;
            req.body.taskTableName = task.TableName;
            req.body.taskSchema = task.TableSchema[0];
            req.body.Mapping = og_data_type.Mapping;
            req.body.ogSchema = og_data_type.Schema;
            req.body.taskMinTerm = task.MinTerm;
            next();
          });
      } else {
        return res.status(400).json({
          message: 'og_data_type이 존재하지 않습니다',
        });
      }
    });
};

exports.quantAssess = async function (req, res, next) {
  const {
    Mapping,
    ogSchema,
    taskDataTableRef,
    taskTableName,
    taskSchema,
    taskMinTerm,
  } = req.body;
  console.log(req.file.path);
  const data = await csv({ noheader: false }).fromFile(req.file.path);
  const taskCol = Object.values(
    (await csv({ noheader: true }).fromFile(taskDataTableRef))[0]
  );
  taskCol.pop(); // pop "Sid" from task data columns

  const dataHeader = Object.keys(data[0]);

  if (JSON.stringify(dataHeader.sort()) != JSON.stringify(ogSchema.sort())) {
    // reject if ogSchema keys do not match submitted data columns (order does not matter)
    return res.status(404).json({
      message:
        'submitted csv file does not match the schema defined in original data type',
    });
  }

  let dupCount = (rowCount = 0);
  const counts = {};
  let parsedData = [];
  const nullCount = {};
  taskCol.forEach((col) => {
    nullCount[col] = 0;
  });
  console.log(taskCol);
  data.forEach((row) => {
    rowCount++;
    const parsedRows = {};
    taskCol.forEach((col) => {
      if (!typeCheck(taskSchema[col], row[Mapping[col]])) {
        // reject if data contains wrong datatype
        return res.status(404).json({
          message: 'submitted csv file has wrong data type',
        });
      }
      nullCount[col] +=
        row[Mapping[col]] == 'null' ||
        row[Mapping[col]] == undefined ||
        row[Mapping[col]] == '';
      parsedRows[col] = row[Mapping[col]];
    });
    counts[Object.values(row)] = (counts[Object.values(row)] || 0) + 1;
    parsedData.push(parsedRows);
  });

  Object.values(counts).forEach((count) => {
    if (count > 1) {
      dupCount += count - 1;
    }
  });

  // divide each raw null counts to get ratio
  Object.keys(nullCount).forEach((col) => {
    nullCount[col] /= rowCount * taskCol.length;
  });
  req.body.NullRatio = nullCount;
  req.body.TotalTupleCnt = rowCount;
  req.body.DuplicatedTupleCnt = dupCount;

  console.log(parsedData);
  parsedData = json2csv(parsedData, { header: true });
  console.log(`parsed${req.file.path}`);
  await fs.writeFileSync(`parsed${req.file.path}`, parsedData);
  next();
};

exports.systemAssessment = function (req, res, next) {
  /* automatic system assessment */
  // ! Term --> submitted by user

  let submitSid;
  let submitDid;

  /* find submitter Sid */
  user.findByPk(req.Uid).then((user) => {
    if (user) {
      submitSid = user.Uid;
      parsing_data
        .findAndCountAll({
          where: {
            Sid: user.Uid,
          },
        })
        .then((p_data) => {
          if (p_data) {
            /* find submitted Did */
            og_data_type
              .findOne({
                where: {
                  Name: req.body.ogDataType,
                  TaskName: req.body.taskName,
                },
              })
              .then((og_data_type) => {
                if (og_data_type) {
                  submitDid = og_data_type.Did;
                  parsing_data
                    .create({
                      FinalScore: null,
                      TaskName: req.body.taskName,
                      SubmitCnt: p_data.count + 1,
                      TotalTupleCnt: req.body.TotalTupleCnt,
                      DuplicatedTupleCnt: req.body.DuplicatedTupleCnt,
                      NullRatio: req.body.NullRatio,
                      Term: nowDate('DateTime'), // supposed to be sent from the user
                      DataRef: `parsed${req.file.path}`,
                      TimeStamp: nowDate('DateTime'),
                      Did: submitDid,
                      Sid: submitSid,
                    })
                    .then((parsing_data) => {
                      if (parsing_data) {
                        next();
                      } else {
                        return res.status(400).json({
                          message:
                            'parsing_data에 데이터를 삽입하는데 실패하였습니다',
                        });
                      }
                    });
                } else {
                  return res.status(400).json({
                    message: 'og_data_type이 존재하지 않습니다',
                  });
                }
              });
          } else {
            return res.status(400).json({
              message: '유저는 서브밋을 여러번 할 수 없습니다',
            });
          }
        });
    } else {
      return res.status(400).json({
        message: '유저가 존재하지 않습니다',
      });
    }
  });
};

exports.assignEvaluator = function (req, res) {
  /* assigning evaluator */
  /* if there is no evaluator, can they still upload? */
  /* the logic below does not allow that */
  // ! Pid obtained by max (most recent)
  parsing_data
    .findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('Pid')), 'Pid']],
      raw: true,
    })
    .then((parsing_data) => {
      if (parsing_data) {
        user
          .findOne({
            where: {
              UType: 'eval',
            },
            order: sequelize.random(),
          })
          .then((user) => {
            if (user) {
              console.log('hello');
              evaluate
                .create({
                  Eid: user.Uid,
                  Pid: parsing_data.Pid,
                })
                .then((evaluate) => {
                  if (evaluate) {
                    return res.status(200).json({
                      message:
                        'Parsing data에 데이터를 성공적으로 추가하고 평가자를 할당했습니다',
                    });
                  }
                });
            } else {
              return res.status(206).json({
                message:
                  'Parsing data에 데이터를 성공적으로 추가였지만 평가자를 할당 받지 못했습니다',
              });
            }
          });
      } else {
        return res.status(404).json({
          message: '데이터베이스에 Parsing data가 존재하지 않습니다',
        });
      }
    });
};

exports.submitApply = function (req, res) {
  const { taskName } = req.body;
  const Uid = req.Uid || req.query.Uid;
  user.findByPk(Uid).then((user_id) => {
    works_on
      .create({
        Sid: Uid,
        TaskName: taskName,
        Permit: 'pending',
      })
      .then((works_on) => {
        if (works_on) {
          return res.status(200).json({
            message: '요청을 성공하였습니다',
          });
        }
        return res.status(500).json({
          message: '요청을 실패했습니다',
        });
      });
  });
};

exports.getTaskList = function (req, res, next) {
  const { per_page, page } = req.query;
  const Uid = req.Uid || req.query.Uid;
  user.findByPk(Uid).then((user_id) => {
    if (user_id) {
      works_on
        .findAll({
          attributes: ['Permit'],
          include: [
            {
              model: user,
              attributes: [],
              required: true,
              where: {
                [Op.or]: [
                  {
                    Uid: { [Op.eq]: Uid },
                  },
                  {
                    Uid: { [Op.is]: null },
                  },
                ],
              },
            },
            {
              model: task,
              attributes: ['TaskName', 'Desc'],
              required: false,
              right: true,
            },
          ],
          order: [['Permit', 'DESC']],
        })
        .then((w_results) => {
          if (w_results) {
            const offset = parseInt(per_page) * parseInt(page - 1);
            const counts = w_results.length;
            const results = w_results.slice(
              offset,
              offset + parseInt(per_page)
            );
            console.log(results);
            const amendedResults = [];
            results.forEach((result) => {
              amendedResults.push({
                taskName: result.task.TaskName,
                taskDesc: result.task.Desc,
                permit: result.Permit,
              });
            });
            req.body.response = {
              data: amendedResults,
              page: parseInt(page),
              totalCount: counts,
            };
            next();
          } else {
            return res.status(404).json({
              message: '아무것도 찾을 수 없습니다',
            });
          }
        });
    } else {
      return res.status(404).json({
        message: '아무것도 찾을 수 없습니다',
      });
    }
  });
};

exports.getAvgScore = function (req, res) {
  /* get average score and total tuple cnt */
  const Uid = req.Uid || req.query.Uid;
  user.findByPk(Uid).then((user_id) => {
    if (user_id) {
      parsing_data
        .count({
          where: {
            Sid: Uid,
          },
        })
        .then((p_data) => {
          if (p_data) {
            req.body.response.submittedDataCnt = p_data;
            AVG_SCORE.findByPk(Uid).then((AVG_SCORE) => {
              if (AVG_SCORE) {
                req.body.response.score = AVG_SCORE.Score;
                parsing_data
                  .findOne({
                    attributes: [
                      [
                        sequelize.fn('SUM', sequelize.col('TotalTupleCnt')),
                        'TotalTupleCnt',
                      ],
                    ],
                    where: {
                      Sid: Uid,
                      Appended: 1,
                    },
                    raw: true,
                  })
                  .then((parsing_data) => {
                    if (parsing_data) {
                      req.body.response.taskDataTableTupleCnt =
                        parsing_data.TotalTupleCnt;
                      return res.status(200).json(req.body.response);
                    }
                    /* 데이터는 제출했고 점수는 받았지만 태스크 데이터 테이블에 추가는 안됨 */
                    req.body.response.taskDataTableTupleCnt = null;
                    return res.status(200).json(req.body.response);
                  });
              } else {
                /* 데이터는 제출했지만 점수는 안받음 */
                req.body.response.score = null;
                req.body.response.taskDataTableTupleCnt = null;
                return res.status(200).json(req.body.response);
              }
            });
          } else {
            /* 아무런 데이터를 제출 하지 않음 */
            req.body.response.submittedDataCnt = null;
            req.body.response.score = null;
            req.body.response.taskDataTableTupleCnt = null;
            return res.status(200).json(req.body.response);
          }
        });
    }
  });
};

exports.getAvgScoreAppended = function (req, res) {
  /* get average score and total tuple cnt */
  const Uid = req.Uid || req.query.Uid;
  user.findByPk(Uid).then((user_id) => {
    if (user_id) {
      parsing_data
        .count({
          where: {
            Sid: Uid,
            Appended: 1
          },
        })
        .then((p_data) => {
          if (p_data) {
            req.body.response.submittedDataCnt = p_data;
            AVG_SCORE.findByPk(Uid).then((AVG_SCORE) => {
              if (AVG_SCORE) {
                req.body.response.score = AVG_SCORE.Score;
                parsing_data
                  .findOne({
                    attributes: [
                      [
                        sequelize.fn('SUM', sequelize.col('TotalTupleCnt')),
                        'TotalTupleCnt',
                      ],
                    ],
                    where: {
                      Sid: Uid,
                      Appended: 1,
                    },
                    raw: true,
                  })
                  .then((parsing_data) => {
                    if (parsing_data) {
                      req.body.response.taskDataTableTupleCnt =
                        parsing_data.TotalTupleCnt;
                      return res.status(200).json(req.body.response);
                    }
                    /* 데이터는 제출했고 점수는 받았지만 태스크 데이터 테이블에 추가는 안됨 */
                    req.body.response.taskDataTableTupleCnt = null;
                    return res.status(200).json(req.body.response);
                  });
              } else {
                /* 데이터는 제출했지만 점수는 안받음 */
                req.body.response.score = null;
                req.body.response.taskDataTableTupleCnt = null;
                return res.status(200).json(req.body.response);
              }
            });
          } else {
            /* 아무런 데이터를 제출 하지 않음 */
            req.body.response.submittedDataCnt = null;
            req.body.response.score = null;
            req.body.response.taskDataTableTupleCnt = null;
            return res.status(200).json(req.body.response);
          }
        });
    }
  });
};

exports.getOgData = (req, res) => {
  const { taskName } = req.query;
  og_data_type
    .findAll({
      attributes: ['Did', 'Name', 'Schema', 'Mapping'],
      where: { TaskName: taskName },
    })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    });
};

exports.getSubmitterList = (req, res, next) => {
  const { taskName } = req.query;
  const Uid = req.Uid || req.query.Uid;
  user.findByPk(Uid).then((user_id) => {
    if (user_id) {
      parsing_data
        .findAll({
          attributes: ['SubmitCnt', 'TotalTupleCnt', 'FinalScore', 'TimeStamp'],
          include: [
            {
              model: og_data_type,
              required: true,
              where: {
                TaskName: taskName,
              },
              attributes: ['Name'],
            },
            {
              model: evaluate,
              required: false,
              attributes: ['Pass'],
            },
          ],
          where: {
            Sid: Uid,
          },
        })
        .then((p_data) => {
          if (p_data) {
            req.body.p_data = p_data;
            next();

            console.log(p_data);
          }
        });
    } else {
      return res.status(404).json({
        message: '유저를 찾지 못했습니다',
      });
    }
  });
};

exports.groupSubmitterList = async (req, res) => {
  const OGDataTypeList = [];
  const { p_data } = req.body;
  const { taskName, per_page, page } = req.query;
  const Uid = req.Uid || req.query.Uid;

  const { TotalSubmitCnt } = await parsing_data.findOne({
    where: {
      Sid: Uid,
    },
    attributes: [
      [sequelize.fn('MAX', sequelize.col('SubmitCnt')), 'TotalSubmitCnt'],
    ],
    raw: true,
  });

  const { score, taskDataTableTupleCnt } = await parsing_data.findOne({
    where: {
      TaskName: taskName,
      Sid: Uid,
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('FinalScore')), 'score'],
      [
        sequelize.fn('SUM', sequelize.col('TotalTupleCnt')),
        'taskDataTableTupleCnt',
      ],
    ],
    raw: true,
  });

  const count = await parsing_data.count({
    where: {
      TaskName: taskName,
      Sid: Uid,
    },
  });

  const { Desc } = await task.findOne({
    where: {
      TaskName: taskName,
    },
  });

  let newOGDataType;
  for (const x of p_data) {
    if (newOGDataType && newOGDataType.OGDataTypeName == x.og_data_type.Name) {
      newOGDataType.submitData.push({
        submitCnt: x.SubmitCnt,
        TotalTupleCnt: x.TotalTupleCnt,
        score: x.FinalScore,
        date: x.TimeStamp,
        PNP: returnPass(x.evaluates[0]),
      });
    } else {
      if (newOGDataType != undefined) {
        newOGDataType.submittedDataCnt = newOGDataType.submitData.length;
        console.log();
        OGDataTypeList.push(newOGDataType);
      }
      newOGDataType = {};
      newOGDataType.OGDataTypeName = x.og_data_type.Name;
      newOGDataType.submitData = [];
      newOGDataType.submitData.push({
        submitCnt: x.SubmitCnt,
        TotalTupleCnt: x.TotalTupleCnt,
        score: x.FinalScore,
        date: x.TimeStamp,
        PNP: returnPass(x.evaluates[0]),
      });
    }
  }

  if (newOGDataType == undefined) {
    return res.status(200).json({
      data: [],
      score: null,
      submittedDataCnt: null,
      taskDataTableTupleCnt: null,
      taskDesc: Desc,
    });
  }
  newOGDataType.submittedDataCnt = newOGDataType.submitData.length;
  OGDataTypeList.push(newOGDataType);
  const offset = parseInt(per_page) * (parseInt(page) - 1);
  return res.status(200).json({
    data: OGDataTypeList.slice(offset, offset + parseInt(per_page)),
    score,
    submittedDataCnt: count,
    taskDataTableTupleCnt,
    taskDesc: Desc,
    page: parseInt(page),
  });
};

exports.getSubmitterTaskDetails = (req, res) => {
  const { taskName } = req.query;
  const Uid = req.Uid || req.query.Uid;
  parsing_data
    .findOne({
      where: {
        TaskName: taskName,
        Sid: Uid,
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('FinalScore')), 'score'],
        [
          sequelize.fn('SUM', sequelize.col('TotalTupleCnt')),
          'taskDataTableTupleCnt',
        ],
      ],
      raw: true,
    })
    .then((p_data) => {
      if (p_data) {
        parsing_data
          .count({
            where: {
              TaskName: taskName,
              Sid: Uid,
            },
          })
          .then((parsing_count) => {
            parsing_data
              .count({
                where: {
                  TaskName: taskName,
                  Sid: Uid,
                  Appended: 1,
                },
              })
              .then((count_append) => {
                task
                  .findOne({
                    where: {
                      TaskName: taskName,
                    },
                  })
                  .then((task) => {
                    if (task) {
                      return res.status(200).json({
                        score: p_data.score,
                        submittedDataCnt: parsing_count,
                        passedDataCnt: count_append,
                        taskDesc: task.Desc,
                      });
                    }
                    return res.status(200).json({
                      message: 'no task found using the given taskname',
                    });
                  });
              });
          });
      } else {
        return res.status(200).json({
          message: 'no parsing_data found with the given taskname and Uid',
        });
      }
    });
};
