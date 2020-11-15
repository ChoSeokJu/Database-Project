/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EVALUATE', {
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
    tableName: 'EVALUATE'
    });
};
