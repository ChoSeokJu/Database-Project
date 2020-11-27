var DataTypes = require("sequelize").DataTypes;
var _evaluate = require("./evaluate");
var _og_data_type = require("./og_data_type");
var _parsing_data = require("./parsing_data");
var _task = require("./task");
var _user = require("./user");
var _works_on = require("./works_on");

function initModels(sequelize) {
  var evaluate = _evaluate(sequelize, DataTypes);
  var og_data_type = _og_data_type(sequelize, DataTypes);
  var parsing_data = _parsing_data(sequelize, DataTypes);
  var task = _task(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var works_on = _works_on(sequelize, DataTypes);

  evaluate.belongsTo(user, { foreignKey: "Eid"});
  user.hasMany(evaluate, { foreignKey: "Eid"});
  evaluate.belongsTo(parsing_data, { foreignKey: "Pid"});
  parsing_data.hasMany(evaluate, { foreignKey: "Pid"});
  og_data_type.belongsTo(task, { foreignKey: "TaskName"});
  task.hasMany(og_data_type, { foreignKey: "TaskName"});
  parsing_data.belongsTo(og_data_type, { foreignKey: "Did"});
  og_data_type.hasMany(parsing_data, { foreignKey: "Did"});
  parsing_data.belongsTo(user, { foreignKey: "Sid"});
  user.hasMany(parsing_data, { foreignKey: "Sid"});
  works_on.belongsTo(user, { foreignKey: "Sid"});
  user.hasMany(works_on, { foreignKey: "Sid"});
  works_on.belongsTo(task, { foreignKey: "TaskName"});
  task.hasMany(works_on, { foreignKey: "TaskName"});

  return {
    evaluate,
    og_data_type,
    parsing_data,
    task,
    user,
    works_on,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
