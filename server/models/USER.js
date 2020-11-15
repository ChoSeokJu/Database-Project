/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER', {
    sID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    ID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "ID_UNIQUE"
    },
    Gender: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "'0: undeclared, 1: male, 2: female'"
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
      type: DataTypes.DATE,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "eval, submit, admin"
    }
  }, {
    sequelize,
    tableName: 'USER'
    });
};
