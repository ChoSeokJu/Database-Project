/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('task', {
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    Desc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    MinTerm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    TableName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "수집하는 테이블 이름"
    },
    TableSchema: {
      type: DataTypes.TEXT,
      get() {
        try {
          return JSON.parse(this.getDataValue('TableSchema'));
        } catch (e) {
          return null;
        }
      },
      set(TableSchema) {
        if (!(TableSchema instanceof Object)) {
          throw Error('`TableSchema` should be an instance of Object');
        }
        this.setDataValue('TableSchema', JSON.stringify(TableSchema));
      },
      allowNull: false,
      comment: "수집할 테이블의 스키마"
    },
    TableRef: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "물리적 저장장소"
    },
    TimeStamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    PassCriteria: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'task',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TaskName" },
        ]
      }
    ]
  });
};
