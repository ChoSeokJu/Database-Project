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
      type: DataTypes.TEXT,
      get() {
        try {
          return JSON.parse(this.getDataValue('Schema'));
        } catch (e) {
          return null;
        }
      },
      set(Schema) {
        if (!(Schema instanceof Object)) {
          throw Error('`Schema` should be an instance of Object');
        }
        this.setDataValue('Schema', JSON.stringify(Schema));
      },
      allowNull: false
    },
    Mapping: {
      type: DataTypes.TEXT,
      get() {
        try {
          return JSON.parse(this.getDataValue('Mapping'));
        } catch (e) {
          return null;
        }
      },
      set(Mapping) {
        if (!(Mapping instanceof Object)) {
          throw Error('`Mapping` should be an instance of Object');
        }
        this.setDataValue('Mapping', JSON.stringify(Mapping));
      },
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
        ]
      },
      {
        name: "NAME_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Name" },
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
