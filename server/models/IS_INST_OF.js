/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('IS_INST_OF', {
    Pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'PARSING_DATA',
        key: 'Pid'
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
    tableName: 'IS_INST_OF'
    });
};
