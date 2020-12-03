/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AVG_SCORE', {
    Sid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'Uid'
      },
      primaryKey: true
    },
    Score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'AVG_SCORE',
    timestamps: false
  });
};
