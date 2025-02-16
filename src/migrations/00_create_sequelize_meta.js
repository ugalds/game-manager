const { DataTypes } = require('sequelize');

module.exports = {
  up: async (context) => {
    const sequelize = context.sequelize;
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
        "name" VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY
      );
    `);
  },

  down: async (context) => {
    const sequelize = context.sequelize;
    await sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta";');
  }
}; 