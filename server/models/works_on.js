/* jshint indent: 2 */
const db = require('../models');
const User = db.user;
const Task = db.task


const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('works_on', {
    Sid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'Uid'
      },
      primaryKey: true
    },
    TaskName: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      references: {
        model: 'task',
        key: 'TaskName'
      },
      primaryKey: true
    },
    Permit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "null: applied but rejected, 0: applied & waiting for approval, 1: applied & approved"
    }
  }, {
    sequelize,
    tableName: 'works_on',
    timestamps: false,
    indexes: [
      {
        name: "fk_USER_has_TASK_TASK1_idx",
        using: "BTREE",
        fields: [
          { name: "TaskName" },
        ]
      },
      {
        name: "fk_USER_has_TASK_USER1_idx",
        using: "BTREE",
        fields: [
          { name: "Sid" },
        ]
      },
    ]
  });
};