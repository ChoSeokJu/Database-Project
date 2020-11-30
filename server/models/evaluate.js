/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evaluate', {
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
    },
    Score: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Pass: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'evaluate'
    });
};
