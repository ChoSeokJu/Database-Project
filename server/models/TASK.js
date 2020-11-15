/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TASK', {
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    Desc: {
      type: "LONGTEXT",
      allowNull: false
    },
    MinTerm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    TableName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "수집하는 테이블 이름",
      unique: "TableName_UNIQUE"
    },
    TableSchema: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "수집할 테이블의 스키마"
    },
    TableRef: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "물리적 저장장소",
      unique: "TableRef_UNIQUE"
    },
    TimeStamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'TASK'
    });
};
