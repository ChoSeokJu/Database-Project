/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ASSIGN_TO', {
    Eid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'USER',
        key: 'sID'
      }
    },
    Pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'PARSING_DATA',
        key: 'Pid'
      }
    }
  }, {
    sequelize,
    tableName: 'ASSIGN_TO'
    });
};
