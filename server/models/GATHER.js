/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GATHER', {
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'TASK',
        key: 'TaskName'
      }
    },
    Did: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'OG_DATA_TYPE',
        key: 'Did'
      }
    }
  }, {
    sequelize,
    tableName: 'GATHER'
    });
};
