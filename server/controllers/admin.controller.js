const db = require('../models');
const config = require('../config/auth.config');
const { json } = require('body-parser');
const csv = require('csvtojson');
const { response } = require('express');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');

const User = db.user;
const Task = db.task;
const ogData = db.og_data_type;
const { Op } = db.Sequelize;
const Works_on = db.works_on;
const Parsing_data = db.parsing_data;
const Evaluate = db.evaluate;
const { og_data_type } = db;
const { AVG_SCORE } = db;
const Requests = db.request_task;

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
  Task.count().then((count) =>
    Task.findAll({
      attributes: ['taskName'],
      offset: parseInt(per_page) * (parseInt(page) - 1),
      limit: parseInt(per_page),
    }).then((task) => {
      res.status(200).json({
        data: task,
        page: parseInt(page),
        totalCount: count,
      });
    })
  );
};

exports.makeTask = (req, res) => {
  // make task & csv file
  const {
    taskName,
    desc,
    minTerm,
    tableName,
    tableSchema,
    passCriteria,
  } = req.body;
  const date = new Date();
  const dateToTimestamp = date.getTime();
  const timestampToDate = new Date(dateToTimestamp);

  Task.findOne({ where: { TaskName: taskName } }).then((task) => {
    if (!task) {
      const tableRef = `./task_data_table/${uuidv4()}.csv`;
      Task.create({
        TaskName: taskName,
        Desc: desc,
        MinTerm: minTerm,
        TableName: tableName,
        TableSchema: tableSchema,
        TableRef: tableRef,
        TimeStamp: timestampToDate,
        PassCriteria: passCriteria,
      })
        .then((new_task) => {
          if (new_task) {
            columns = Object.keys(tableSchema[0]);
            columns.push('ID');
            fs.writeFile(tableRef, columns, 'utf8', function (err) {
              if (err) {
                return res.status(400).json({
                  message: '테스크 생성 과정에서 오류가 발생하였습니다.',
                });
              } else{
                return res.status(200).json({
                  message: '테스크가 생성되었습니다.',
                });
              }
            });         
            
          }
        })
        .catch((err) => {
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
  Works_on.findOne({ where: { TaskName: taskName, Sid: Uid } })
    .then((result) => {
      if (result.get('Permit') === 'pending') {
        result.set('Permit', 'approved');
        result.save();
        return res.status(200).json({
          message: '해당 Task의 참여를 승인했습니다',
        });
      }
      if (result.get('Permit') === 'approved') {
        return res.status(400).json({
          message: '해당 유저는 이미 승인 되었습니다',
        });
      }
      if (result.get('Permit') === 'rejected') {
        return res.status(400).json({
          message: '해당 유저는 이미 거절 되었습니다',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: '해당 정보는 존재하지 않습니다',
      });
    });
};

exports.rejectUser = (req, res) => {
  const { taskName, Uid } = req.body;
  Works_on.findOne({ where: { TaskName: taskName, Sid: Uid } })
    .then((result) => {
      if (result.get('Permit') === 'pending') {
        result.set('Permit', 'rejected');
        result.save();
        return res.status(200).json({
          message: '해당 Task의 참여를 거절했습니다',
        });
      }
      if (result.get('Permit') === 'approved') {
        return res.status(400).json({
          message: '해당 유저는 이미 승인 되었습니다',
        });
      }
      if (result.get('Permit') === 'rejected') {
        return res.status(400).json({
          message: '해당 유저는 이미 거절 되었습니다',
        });
      }
    })
    .catch((err) => {
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
  Works_on.count({
    include: [
      {
        model: User,
        attributes: ['Uid', 'ID', 'Name'],
        required: true,
      },
    ],
    where: { TaskName: taskName, Permit: 'pending' },
  }).then((count) =>
    Works_on.findAll({
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['Uid', 'ID', 'Name'],
          required: true,
        },
      ],
      where: { TaskName: taskName, Permit: 'pending' },
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
    })
  );
};

exports.approvedUser = (req, res) => {
  User.hasMany(Works_on, { foreignKey: 'Sid' });
  Works_on.belongsTo(User, { foreignKey: 'Sid' });
  const arr = [];
  const { taskName, per_page, page } = req.query;
  Works_on.count({
    include: [
      {
        model: User,
        attributes: ['Uid', 'ID', 'Name'],
        required: true,
      },
    ],
    where: { TaskName: taskName, Permit: 'approved' },
  }).then((count) =>
    Works_on.findAll({
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['Uid', 'ID', 'Name'],
          required: true,
        },
      ],
      where: { TaskName: taskName, Permit: 'approved' },
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
    })
  );
};

exports.getSchema = (req, res) => {
  const { taskName } = req.query;
  const arr = [];
  Task.findAll({
    attributes: ['TableSchema'],
    where: { TaskName: taskName },
  }).then((columns) => {
    for (let i = 0; i < Object.keys(columns[0].TableSchema[0]).length; i++) {
      arr.push({ columnName: Object.keys(columns[0].TableSchema[0])[i] });
    }
    res.status(200).json({
      data: arr,
    });
  });
};

exports.addOgData = (req, res) => {
  const { taskName, OGDataType, OGDataColumn, OGDataMapping } = req.body;
  Task.findOne({
    where: { TaskName: taskName },
  }).then((task) => {
    ogData.count({
      where : {
        TaskName: taskName,
        Name: OGDataType
      }
    }).then((duplicated_count) => {
      if (duplicated_count != 0) {
        return res.status(400).json({
          message: '동일한 데이터가 존재합니다'
        })
      }
    if (task) {
      ogData
        .create({
          Name: OGDataType,
          Schema: OGDataColumn,
          Mapping: OGDataMapping,
          TaskName: taskName,
        })
        .then((ogdata) => {
          if (ogdata) {
            res.status(200).json({
              message: '원본데이터가 생성 되었습니다',
            });
          } else {
            res.status(400).json({
              message: '원본데이터를 생성하지 못하였습니다',
            });
          }
        });
    } else {
      return res.status(400).json({
        message: '해당 Task가 없습니다',
        });
      }
    });
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

exports.evaluatedData = (req, res) => {
  // ! req.query? req.body? req?
  const { Uid, per_page, page } = req.query;

  Evaluate.count({
    include: [
      {
        model: Parsing_data,
        required: true,
      },
    ],
    where: {
      Eid: parseInt(Uid),
      Pass: { [Op.ne]: null },
    },
  }).then((count) => {
    Evaluate.findAll({
      include: [
        {
          model: Parsing_data,
          required: true,
        },
      ],
      where: {
        Eid: parseInt(Uid),
        Pass: { [Op.ne]: null },
      },
      offset: parseInt(per_page) * (parseInt(page) - 1),
      limit: parseInt(per_page),
    }).then((evaluate) => {
      if (evaluate) {
        return res.status(200).json({
          data: evaluate,
          page,
          totalCount: count,
        });
      }
      return res.status(404).json({
        message: '평가자에게 할당된 데이터가 없습니다',
      });
    });
  });
};

exports.getUserinfoAll = (req, res) => {
  User.hasMany(AVG_SCORE, { foreignKey: 'Sid' });
  AVG_SCORE.belongsTo(User, { foreignKey: 'Sid' });
  const { per_page, page } = req.query;
  const arr = [];
  User.count().then((count) => {
    User.findAll({
      attributes: [
        'Uid',
        'ID',
        'Name',
        'Gender',
        'UType',
        'Bdate',
        'PhoneNo',
        'Addr',
      ],
      include: [
        {
          model: AVG_SCORE,
          required: false,
          attributes: ['Score'],
        },
      ],
      raw: true,
      offset: parseInt(per_page) * (parseInt(page) - 1),
      limit: parseInt(per_page),
    }).then((result) => {
      for (let i = 0; i < result.length; i++) {
        arr.push({
          Uid: result[i].Uid,
          ID: result[i].ID,
          Name: result[i].Name,
          Gender: result[i].Gender,
          UType: result[i].UType,
          Bdate: result[i].Bdate,
          PhoneNo: result[i].PhoneNo,
          Addr: result[i].Addr,
          Score: result[i]['AVG_SCOREs.Score'],
        });
      }
      return res.json({
        data: arr,
        page: parseInt(page),
        totalCount: count,
      });
    });
  });
};

exports.infoSearch = (req, res) => {
  const { search, searchCriterion, per_page, page } = req.query;
  if (searchCriterion == 'all') {
    User.hasMany(Parsing_data, { foreignKey: 'Sid' });
    Parsing_data.belongsTo(User, { foreignKey: 'Sid' });
    User.findAndCountAll({
      where: {
        [Op.or]: [
          { ID: { [Op.substring]: search } },
          { Gender: { [Op.substring]: search } },
          { Name: { [Op.substring]: search } },
        ],
      },
    }).then((result1) => {
      User.findAndCountAll({
        include: [
          {
            model: Parsing_data,
            attributes: [],
            where: { TaskName: { [Op.substring]: search } },
            required: true,
          },
        ],
      }).then((result2) => {
        const total = result1.count + result2.count;
        const data2 = result1.rows
          .concat(result2.rows)
          .slice(parseInt(page) - 1, parseInt(page) - 1 + parseInt(per_page));
        if (total !== 0) {
          return res.status(200).json({
            data: data2,
            page,
            totalCount: total,
          });
        }
        return res.json({
          data: [],
          page,
          totalCount: 0,
        });
      });
    });
  } else if (searchCriterion == 'ID') {
    User.findAndCountAll({
      where: {
        ID: { [Op.substring]: search },
      },
      offset: parseInt(per_page) * parseInt(page - 1),
      limit: parseInt(per_page),
    }).then((result) => {
      User.findAndCountAll({
        where: {
          ID: { [Op.substring]: search },
        },
      }).then((count) => {
        if (result.rows.length !== 0) {
          return res.status(200).json({
            data: result.rows,
            page: parseInt(page),
            totalCount: count.rows.length,
          });
        }
        return res.json({
          data: [],
          page,
          totalCount: 0,
        });
      });
    });
  } else if (searchCriterion == 'task') {
    User.hasMany(Parsing_data, { foreignKey: 'Sid' });
    Parsing_data.belongsTo(User, { foreignKey: 'Sid' });
    User.findAndCountAll({
      include: [
        {
          model: Parsing_data,
          attributes: [],
          where: { TaskName: { [Op.substring]: search } },
          required: true,
        },
      ],
      offset: parseInt(per_page) * parseInt(page - 1),
      limit: parseInt(per_page),
    }).then((result) => {
      User.findAndCountAll({
        include: [
          {
            model: Parsing_data,
            attributes: [],
            where: { TaskName: { [Op.substring]: search } },
            required: true,
          },
        ],
      }).then((count) => {
        if (result.rows.length !== 0) {
          return res.status(200).json({
            data: result.rows,
            page,
            totalCount: count.rows.length,
          });
        }
        return res.json({
          data: [],
          page,
          totalCount: 0,
        });
      });
    });
  } else if (searchCriterion == 'Gender') {
    const male = ['남성', '남자', '남'];
    const female = ['여성', '여자', '여'];
    let value = '';
    if (male.includes(search)) {
      console.log('남자');
      value = 'male';
    } else if (female.includes(search)) {
      console.log('여자');
      value = 'female';
    } else {
      value = search;
    }
    User.findAndCountAll({
      where: {
        Gender: value ,
      },
      offset: parseInt(per_page) * parseInt(page - 1),
      limit: parseInt(per_page),
    }).then((result) => {
      User.findAndCountAll({
        where: {
          Gender: value,
        },
      }).then((count) => {
        if (result.rows.length !== 0) {
          return res.status(200).json({
            data: result.rows,
            page,
            totalCount: count.rows.length,
          });
        }
        return res.json({
          data: [],
          page,
          totalCount: 0,
        });
      });
    });
  } else if (searchCriterion == 'age') {
    if (isNaN(parseInt(search))) {
      return res.json({
        data: [],
        page,
        totalCount: 0,
      });
    }

    const today = new Date();
    User.findAll().then((result) => {
      offset = parseInt(per_page) * (parseInt(page) - 1);
      limit = parseInt(per_page);
      let len = new Number(0);
      const temp_arr = [];
      for (let i = 0; i < result.length; i++) {
        const check = new Date(result[i].Bdate);
        const age = Math.floor(today.getFullYear() - check.getFullYear() + 1);
        if (Math.floor(age / 10) * 10 != parseInt(search)) {
          continue;
        }
        len += 1;
        temp_arr.push({
          Uid: result[i].Uid,
          ID: result[i].ID,
          Name: result[i].Name,
          Gender: result[i].Gender,
          UType: result[i].UType,
          Bdate: result[i].Bdate,
          Age: age,
        });
      }
      if (temp_arr.length === 0) {
        return res.json({
          data: [],
          page,
          totalCount: 0,
        });
      }
      temp_arr.sort((a, b) => a.Age - b.Age);
      return res.json({
        data: temp_arr.slice(offset, offset + limit),
        page,
        totalCount: len,
      });
    });
  }
};

exports.requestList = (req, res) => {
  const { per_page, page } = req.query;
  Requests.count().then((count) =>
    Requests.findAll({
      attributes: ['title', 'content', 'date'],
      offset: parseInt(per_page) * (parseInt(page) - 1),
      limit: parseInt(per_page),
      order: [['date', 'DESC']],
    }).then((result) => {
      res.status(200).json({
        data: result,
        page: parseInt(page),
        totalCount: count,
      });
    })
  );
};

exports.parsedDataList = (req, res) => {
  const { taskName, per_page, page } = req.query;
  const output = [];
  Parsing_data.findAll({
    include: [
      {
        model: Evaluate,
        required: true,
      },
      {
        model: User,
        required: true,
      },
      {
        model: og_data_type,
        required: true,
      },
    ],
    where: {
      TaskName: taskName,
    },
  }).then((parsing_data) => {
    if (parsing_data) {
      parsing_data.forEach((p_data) => {
        output.push({
          Pid: p_data.Pid,
          ID: p_data.user.ID,
          date: p_data.TimeStamp,
          OGDataType: p_data.og_data_type.Name,
          PNP: p_data.Appended,
        });
      });
      offset = parseInt(per_page) * (parseInt(page) - 1);
      return res.status(200).json({
        data: output.slice(offset, offset + parseInt(per_page)),
        page: parseInt(page),
        totalCount: output.length,
      });
    }
    return res.status(400).json({
      message: '아무것도 찾을수 없습니다.',
    });
  });
};

exports.downloadParsedData = (req, res) => {
  const { Pid } = req.query;
  Parsing_data.findOne({
    where: {
      Pid,
    },
    include: [
      {
        model: og_data_type,
        attributes: ['Name'],
        required: true,
      },
    ],
  }).then((parsing_data) => {
    if (parsing_data) {
      console.log(parsing_data.og_data_type.Name);
      res.download(
        parsing_data.DataRef,
        `${parsing_data.og_data_type.Name}.csv`,
        (err) => {
          if (err) {
            res.status(404).send('잘못된 요청입니다');
          } else {
            console.log(res.headersSent);
          }
        }
      );
    } else {
      res.status(400).json({
        message: '파싱데이터를 찾을 수 없습니다',
      });
    }
  });
};

exports.downloadTaskData = (req, res) => {
  const { taskName } = req.query;
  Task.findByPk(taskName).then((Task) => {
    if (Task) {
      console.log(Task.TableName)
      res.download(Task.TableRef, `${Task.TableName}.csv`, (err) => {
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
      Uid: req.query.Uid,
    },
  }).then((User) => {
    if (User) {
      AVG_SCORE.findByPk(req.query.Uid).then((AVG_SCORE) => {
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

exports.getTaskInfo = async (req, res) => {
  const { taskName } = req.query;
  const task = await Task.findOne({
    where: {
      TaskName: taskName, // this is for deployment
    },
  });
  if (task != undefined) {
    try {
      const parsedData = await csv({ noheader: false }).fromFile(task.TableRef);
      console.log(task.tupleCount);
      return res.status(200).json({
        task,
        tupleCount: parsedData.length,
      });
    } catch (err) {
      return res.status(404).json({
        message: './task_data_table에 파일이 존재하지 않습니다',
      });
    }
  } else {
    return res.status(404).json({
      message: '해당 태스크 이름이 존재하지 않습니다',
    });
  }
};
