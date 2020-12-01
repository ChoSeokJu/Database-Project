const db = require('../models');
const router = require('../routes/admin');
const task = db.task;
const User = db.user;
const works_on = db.works_on;
const Parsing_data = db.parsing_data;
const {Op} = require("sequelize");
exports.adminContent = (req, res) => {
  console.log(`Admin user ${req.username} sent a request`);
  return res.status(200).send('Admin Content.');
};
// exports.showTasklist = (req, res) {
//   task.create({

//   })
// }
exports.showData = (req, res) => {
  const users = User.findAll();
  console.log(users.every(user => user instanceof User)); // true
  console.log("All users:", JSON.stringify(users, null, 2));
};
exports.wodata = (req, res) => {
  works_on.findAll({attributes:['Sid','TaskName','Permit']}).then((wos)=> {
    console.log("All wos:", JSON.stringify(wos, null, 2));
  });
}
exports.getData = (req, res) => {

  User.findAll().then((User)=> {
    console.log("All users:", JSON.stringify(User, null, 2));
    });
};
exports.getTask = (req, res) => {
  task.findAll().then((task)=>{
    console.log("All tasks:", JSON.stringify(task, null, 2));
  });
};
exports.getPdata = (req, res) => {
  parsing_data.findAll().then((data)=>{
    console.log("All tasks:", JSON.stringify(data, null, 2));
  });
};
exports.totalCount = (req,res) => {
  task.count().then(c => {
    // const{per_page, page} = req.body;
    // task.findAll({ offset: per_page*(page-1), limit: per_page }).then(task => {
    task.findAll({attributes:['TaskName'], offset: 2, limit: 2 }).then(task => {  
      res.status(200).json({
        totalCount: c,
        page: 2,
        data: task,
      })
      console.log("now task:", JSON.stringify(task,null,2));
    });
    // console.log("There are "+c+" projects")
  });
};
exports.joinTest = (req,res) => {
  Task.belongsToMany(User, {
    through: works_on,
    foreignkey: 'Uid',
    otherKey: 'TaskName'}).then(workon => {
    console.log("All loins:", JSON.stringify(workon, null, 2));
  });
};
exports.getUserinfo = (req,res) => {
  const {per_page, page} = req.body;
  User.count().then((count) => 
  User.findAll({offset: per_page*(page-1), limit: per_page})
    .then((User) => {
      res.status(200).json({
        'data': User,
        'page': page,
        'totalCount': count})
  }))
};
exports.infoSearch = (req, res) => {
  const { search, searchCriterion, per_page, page} = req.body;
  var test;
  User.count().then((count) => {
    if( searchCriterion == "all") {
      test = "a";
      return res.status(200).json({
        "test" : test
      })
    }
    else if( searchCriterion == "ID") {
      User.findAll({
        where: {
          ID: {[Op.substring]: search}
        }
      }).then((result) => {
        return res.status(200).json({
          "result": result,
          "page":page,
          "totalCount":count
        })
      }) 
    }
    else if( searchCriterion == "task") {
      User.findAll({
        include: [{
          model: Parsing_data,
          required: true
        }],
        where: {
          //  TaskName: {[Op.substring]: search},
          Uid: parseInt(Parsing_data.Sid)
        }
      }).then((result) => {
        return res.status(200).json({
          "result": result,
          "page":page,
          "totalCount":count
        })
      }) 
    }
    else if( searchCriterion == "Gender") {
      User.findAll({
        where: {
          Gender: {[Op.substring]: search}
        },
        offset: per_page*(page-1),
        limit: per_page
      }).then((result) => {
        return res.status(200).json({
          "result": result,
          "page":page,
          "totalCount":count
        })
      }) 
    }
  })
}
