/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('og_data_type', {
    Did: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Schema: {
      type: DataTypes.JSON,
      allowNull: false
    },
    Mapping: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'og_data_type'
    });
};
