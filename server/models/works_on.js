/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('works_on', {
    Sid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'Uid'
      }
    },
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'task',
        key: 'TaskName'
      }
    },
    Permit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'works_on'
    });
};
