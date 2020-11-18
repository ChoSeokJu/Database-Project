/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    Uid: {
      autoIncrement: true,
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
      type: DataTypes.ENUM('undeclared','male','female'),
      allowNull: true,
      comment: "'0: undeclared, 1: male, 2: female'"
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Addr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PhoneNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Bdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UType: {
      type: DataTypes.ENUM('eval','submit','admin'),
      allowNull: false,
      comment: "0: eval, 1:  submit, 2: admin"
    },
    salt: {
      type: "MEDIUMTEXT",
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user'
    });
};
