/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gather', {
    TaskName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'task',
        key: 'TaskName'
      }
    },
    Did: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'og_data_type',
        key: 'Did'
      }
    }
  }, {
    sequelize,
    tableName: 'gather'
    });
};
