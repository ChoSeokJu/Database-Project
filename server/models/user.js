/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    Uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "ID_UNIQUE"
    },
    Gender: {
      type: DataTypes.ENUM,
      allowNull: false,
      comment: "0: undeclared, 1: male, 2: female"
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Addr: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PhoneNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Bdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UType: {
      type: DataTypes.ENUM,
      allowNull: false,
      comment: "eval: 0, submit: 1, admin: 2"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Uid" },
        ]
      },
      {
        name: "ID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
