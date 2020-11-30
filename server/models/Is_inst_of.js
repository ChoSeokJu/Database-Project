/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Is_inst_of', {
    Pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'parsing_data',
        key: 'Pid'
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
    tableName: 'Is_inst_of'
    });
};
