const db = require('../models');
const config = require('../config/auth.config');
const { json } = require('body-parser');
const { response } = require('express');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const User = db.user;
const Task = db.task;
const ogData = db.og_data_type;
const { Op } = db.Sequelize;
const Works_on = db.works_on;
const Parsing_data = db.parsing_data;
const Evaluate = db.evaluate;
const { og_data_type } = db;
const { AVG_SCORE } = db;

Parsing_data.hasMany(Evaluate, { foreignKey: 'Pid' });
Evaluate.belongsTo(Parsing_data, { foreignKey: 'Pid' });

User.hasMany(Parsing_data, { foreignKey: 'Sid' });
Parsing_data.belongsTo(User, { foreignKey: 'Sid' });

og_data_type.hasMany(Parsing_data, { foreignKey: 'Did' });
Parsing_data.belongsTo(og_data_type, { foreignKey: 'Did' });

exports.adminContent = (req, res) => {
  console.log(`Admin user ${req.username} sent a request`);
  return res.status(200).send('Admin Content.');
};

exports.getTask = (req, res) => {
  const { per_page, page } = req.query;
  Task.count().then((count) => Task.findAll({ attributes: ['taskName'], offset: parseInt(per_page) * (parseInt(page) - 1), limit: parseInt(per_page) })
    .then((task) => {
      res.status(200).json({
        data: task,
        page: parseInt(page),
        totalCount: count,
      });
    }));
};

exports.makeTask = (req, res) => {
  // make task & csv file
  const { taskName, desc, minTerm, tableName, tableSchema, timeStamp } = req.body;
  const tableRef = "./task_data_table";
  const date = new Date();
  const dateToTimestamp = date.getTime();
  const timestampToDate = new Date(dateToTimestamp);


  Task.findOne({ where: { TaskName: taskName } }).then((task) => {
    if (!task) {
      Task.create({
        TaskName: taskName,
        Desc: desc,
        MinTerm: minTerm,
        TableName: tableName,
        TableSchema: tableSchema,
        TableRef: tableRef,
        TimeStamp: timestampToDate
      }).then((new_task) => {
        if (new_task) {
          var csvHead = []
          columns = Object.keys(tableSchema[0])
          columns.push("Sid")
          for (var i = 0; i < columns.length; i++) {
            csvHead.push({ id: columns[i], title: columns[i] })
          }
          const csvWriter = createCsvWriter({
            path: `${tableRef}/${taskName}.csv`,
            header: csvHead,
          });
          csvWriter.writeRecords([]);
          return res.status(200).json({
            message: '테스크가 생성되었습니다.',
          });
        }
      }).catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
    } else {
      return res.status(404).json({
        message: '테스크 이름이 이미 존재합니다.',
      });
    }
  });
};

exports.approveUser = (req, res) => {
  const { taskName, Uid } = req.body;
  Works_on.findOne({ where: { TaskName: taskName, Sid: Uid } }).then((result) => {
    if (result.get('Permit') === "pending") {
      result.set('Permit', "approved");
      result.save();
      return res.status(200).json({
        message: '해당 Task의 참여를 승인했습니다',
      });
    }
    if (result.get('Permit') === "approved") {
      return res.status(400).json({
        message: '해당 유저는 이미 승인 되었습니다',
      });
    }
    if (result.get('Permit') === "rejected") {
      return res.status(400).json({
        message: '해당 유저는 이미 거절 되었습니다',
      });
    }
  }).catch((err) => {
    res.status(500).json({
      message: '해당 정보는 존재하지 않습니다',
    });
  });
};

exports.rejectUser = (req, res) => {
  const { taskName, Uid } = req.body;
  Works_on.findOne({ where: { TaskName: taskName, Sid: Uid } }).then((result) => {
    if (result.get('Permit') === "pending") {
      result.set('Permit', "rejected");
      result.save();
      return res.status(200).json({
        message: '해당 Task의 참여를 거절했습니다',
      });
    }
    if (result.get('Permit') === "approved") {
      return res.status(400).json({
        message: '해당 유저는 이미 승인 되었습니다',
      });
    }
    if (result.get('Permit') === "rejected") {
      return res.status(400).json({
        message: '해당 유저는 이미 거절 되었습니다',
      });
    }
  }).catch((err) => {
    res.status(500).json({
      message: '해당 정보는 존재하지 않습니다',
    });
  });
};

exports.pendingUser = (req, res) => {
  User.hasMany(Works_on, { foreignKey: 'Sid' });
  Works_on.belongsTo(User, { foreignKey: 'Sid' });
  const arr = [];
  const { taskName, per_page, page } = req.query;
  Task.count({
    where: { TaskName: taskName }
  }).then(((count) => Works_on.findAll({
    attributes: [],
    include: [
      {
        model: User,
        attributes: ['Uid', 'ID', 'Name'],
        required: true,
      },
    ],
    where: { TaskName: taskName, Permit: "pending" },
    offset: parseInt(per_page) * (parseInt(page) - 1),
    limit: parseInt(per_page),
  }).then((result) => {
    for (let i = 0; i < result.length; i++) {
      arr.push(result[i].user);
    }
    res.json({
      data: arr,
      page: parseInt(page),
      totalCount: count,
    });
  })));
};

exports.approvedUser = (req, res) => {
  User.hasMany(Works_on, { foreignKey: 'Sid' });
  Works_on.belongsTo(User, { foreignKey: 'Sid' });
  const arr = [];
  const { taskName, per_page, page } = req.query;
  Task.count({
    where: { TaskName: taskName }
  }).then(((count) => Works_on.findAll({
    attributes: [],
    include: [
      {
        model: User,
        attributes: ['Uid', 'ID', 'Name'],
        required: true,
      },
    ],
    where: { TaskName: taskName, Permit: "approved" },
    offset: parseInt(per_page) * (parseInt(page) - 1),
    limit: parseInt(per_page),
  }).then((result) => {
    for (let i = 0; i < result.length; i++) {
      arr.push(result[i].user);
    }
    res.json({
      data: arr,
      page: parseInt(page),
      totalCount: count,
    });
  })));
};

exports.getSchema = (req, res) => {
  const { taskName } = req.query;
  const arr = [];
  Task.findAll({
    attributes: ['TableSchema'],
    where: { TaskName: taskName },
  })
    .then((columns) => {
      for (let i = 0; i < Object.keys(columns[0].TableSchema[0]).length; i++) {
        arr.push({ columnName: Object.keys(columns[0].TableSchema[0])[i] });
      }
      res.status(200).json({
        data: arr,
      });
    });
};

exports.addOgData = (req, res) => {
  const {
    taskName, OGDataType, data, desc, schema,
  } = req.body;
  Task.findOne({
    where: { TaskName: taskName },
  }).then((schema) => {
    if (schema) {
      ogData.create({
        Name: OGDataType,
        Mapping: data,
        TaskName: taskName,
        Schema: schema,
        Desc: desc,
      }).then((ogdata) => {
        res.status(200).json({
          message: '원본데이터가 생성 되었습니다',
        });
      });
    } else {
      return res.status(400).json({
        message: '해당 Task가 없습니다',
      });
    }
  });
};

exports.evaluatedData = (req, res) => {
  const { Uid, per_page, page } = req.query;
  return res.status(404).json({
    message: '평가자에게 할당된 데이터가 없습니다',
  });
  // Evaluate.findAll({
  //   include: [{
  //     model: Parsing_data,
  //     required: true,
  //   }],
  //   where: {
  //     Eid: parseInt(Uid),
  //     Pass: { [Op.ne]: null },
  //   },
  //   offset: (parseInt(per_page) * (parseInt(page) - 1)),
  //   limit: parseInt(per_page),
  // }).then((evaluate) => {
  //   if (evaluate) {
  //     return res.status(200).json({
  //       evaluatedData: evaluate,
  //     });
  //   }
  //   return res.status(404).json({
  //     message: '평가자에게 할당된 데이터가 없습니다',
  //   });
  // });
};

exports.getUserinfo = (req, res) => {
  const { per_page, page } = req.body;
  User.count().then((count) => User.findAll({ offset: per_page * (page - 1), limit: per_page })
    .then((User) => {
      res.status(200).json({
        data: User,
        page,
        totalCount: count,
      });
    }));
};

exports.infoSearch = (req, res) => {
  const {
    search, searchCriterion, per_page, page,
  } = req.body;
  User.count().then((count) => {
    if (searchCriterion == 'ID') {
      User.findAll({
        where: {
          ID: { [Op.substring]: search },
        },
      }).then((result) => res.status(200).json({
        result,
        page,
        totalCount: count,
      }));
    } else if (searchCriterion == 'task') {
      User.hasMany(Parsing_data, { foreignKey: 'Sid' });
      Parsing_data.belongsTo(User, { foreignKey: 'Sid' });
      User.findAll({
        include: [{
          model: Parsing_data,
          attributes: [],
          where: { TaskName: { [Op.substring]: search } },
          required: true,
        }],
      }).then((result) => res.status(200).json({
        result,
        page,
        totalCount: count,
      }));
    } else if (searchCriterion == 'Gender') {
      User.findAll({
        where: {
          Gender: { [Op.substring]: search },
        },
        offset: per_page * (page - 1),
        limit: per_page,
      }).then((result) => res.status(200).json({
        result,
        page,
        totalCount: count,
      }));
    }
  });
};

exports.requestList = (req, res) => {
  const { per_page, page } = req.body;
  Task.hasMany(Works_on, { foreignKey: 'TaskName' });
  Works_on.belongsTo(Task, { foreignKey: 'TaskName' });

  Works_on.findAndCountAll({
    include: [{
      model: Task,
      required: true,
    }],
    where: {
      Permit: "pending",
    },
    offset: (per_page * (page - 1)),
    limit: per_page,
  }).then((Works_on) => {
    if (Works_on) {
      return res.status(200).json({
        data: Works_on.rows,
        page,
        totalCount: Works_on.count,
      });
    }
  });
};

exports.parsedDataList = (req, res) => {
  const { taskName, per_page, page } = req.body;
  const output = [];
  Parsing_data.findAll({
    include: [{
      model: Evaluate,
      required: true,
    }, {
      model: User,
      required: true,
    }, {
      model: og_data_type,
      required: true,
    }],
    where: {
      TaskName: taskName,
    },
    offset: per_page * (page - 1),
    limit: per_page,
  }).then((parsing_data) => {
    if (parsing_data) {
      parsing_data.forEach((p_data) => {
        output.push({
          Pid: p_data.Pid,
          ID: p_data.user.ID,
          date: p_data.TimeStamp,
          OGDataType: p_data.og_data_type.Name,
          PNP: p_data.evaluates[0].Pass,
        });
      });
      return res.status(200).json({
        output,
      });
    }
    return res.status(400).json({
      message: '아무것도 찾을수 없습니다.',
    });
  });
};

exports.downloadParsedData = (req, res) => {
  Parsing_data.findByPk(
    req.body.Pid,
  ).then((Parsing_data) => {
    if (Parsing_data) {
      res.download(Parsing_data.DataRef, 'download.csv', (err) => {
        if (err) {
          res.status(404).send('잘못된 요청입니다');
        } else {
          console.log(res.headersSent);
        }
      });
    } else {
      res.status(400).json({
        message: '파싱데이터를 찾을 수 없습니다',
      });
    }
  });
};

exports.downloadTaskData = (req, res) => {
  const { taskName } = req.query;
  Task.findByPk(
    taskName,
  ).then((Task) => {
    if (Task) {
      fileRef = `${Task.TableRef}/${taskName}.csv`;
      res.download(fileRef, `${Task.TableName}.csv`, (err) => {
        if (err) {
          return res.status(404).json({
            message: '파일을 다운로드 할 수 없습니다',
          });
        }
        console.log(res.headersSent);
      });
    } else {
      res.status(400).json({
        message: '요청하신 데이터가 존재하지 않습니다',
      });
    }
  });
};

exports.getUserInfo = (req, res) => {
  User.findOne({
    where: {
      Uid: req.body.Uid,
    },
  }).then((User) => {
    if (User) {
      AVG_SCORE.findByPk(
        req.body.Uid,
      ).then((AVG_SCORE) => {
        if (AVG_SCORE) {
          return res.status(200).json({
            ID: User.ID,
            Name: User.Name,
            Gender: User.Gender,
            UType: User.UType,
            Bdate: User.Bdate,
            PhoneNo: User.PhoneNo,
            Addr: User.Addr,
            Score: AVG_SCORE.Score,
          });
        }
        return res.status(400).json({
          message: '유저를 찾을 수 없습니다',
        });
      });
    } else {
      return res.status(400).json({
        message: '유저를 찾을 수 없습니다',
      });
    }
  });
};
