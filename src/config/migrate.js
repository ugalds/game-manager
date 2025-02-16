const { Sequelize } = require('sequelize');
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'game_manager'
});

const umzug = new Umzug({
  migrations: {
    glob: 'src/migrations/*.js',
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(sequelize.getQueryInterface(), Sequelize),
        down: async () => migration.down(sequelize.getQueryInterface(), Sequelize)
      };
    }
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});

(async () => {
  await umzug.up();
  console.log('Migrations executadas com sucesso!');
})(); 