/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('parsing_data', {
    Pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    FinalScore: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SubmitCnt: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: "회차 정보"
    },
    TotalTupleCnt: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    DuplicatedTupleCnt: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    NullRatio: {
      type: DataTypes.JSON,
      allowNull: false
    },
    Term: {
      type: DataTypes.TIME,
      allowNull: false
    },
    DataRef: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TimeStamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'parsing_data'
    });
};
