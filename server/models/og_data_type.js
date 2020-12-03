/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('og_data_type', {
    Did: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Schema: {
      type: DataTypes.JSON,
      allowNull: false
    },
    Mapping: {
      type: DataTypes.JSON,
      allowNull: false
    },
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'task',
        key: 'TaskName'
      }
    }
  }, {
    sequelize,
    tableName: 'og_data_type',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Did" },
          { name: "TaskName" },
        ]
      },
      {
        name: "fk_OG_DATA_TYPE_TASK1_idx",
        using: "BTREE",
        fields: [
          { name: "TaskName" },
        ]
      },
    ]
  });
};
