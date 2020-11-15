/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WORKS_ON', {
    Sid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'USER',
        key: 'sID'
      }
    },
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'TASK',
        key: 'TaskName'
      }
    },
    Permit: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'WORKS_ON'
    });
};
