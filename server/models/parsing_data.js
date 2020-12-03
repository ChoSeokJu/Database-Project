/* jshint indent: 2 */
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('parsing_data', {
    Pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FinalScore: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SubmitCnt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "회차 정보"
    },
    TotalTupleCnt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    DuplicatedTupleCnt: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    },
    Did: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'og_data_type',
        key: 'Did'
      }
    },
    Sid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'Uid'
      }
    },
    Appended: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'null: 아직 평가 안됨, 0: 추가 안됨, 1: 추가 됨'
    }
  }, {
    sequelize,
    tableName: 'parsing_data',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Pid" },
        ]
      },
      {
        name: "fk_PARSING_DATA_OG_DATA_TYPE1_idx",
        using: "BTREE",
        fields: [
          { name: "Did" },
        ]
      },
      {
        name: "fk_PARSING_DATA_user1_idx",
        using: "BTREE",
        fields: [
          { name: "Sid" },
        ]
      },
    ]
  });
};
