/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assign_to', {
    Eid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'Uid'
      }
    },
    Pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'parsing_data',
        key: 'Pid'
      }
    }
  }, {
    sequelize,
    tableName: 'assign_to'
    });
};
