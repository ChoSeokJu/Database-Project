/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OG_DATA_TYPE', {
    Did: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
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
    tableName: 'OG_DATA_TYPE'
    });
};
