const databaseName = 'snap';

module.exports = {
  development: {
    client: 'postgresql',
    connection: `postgres://devel:password@localhost:5432/${databaseName}_development`,
    migrations: {
      directory: '../db/migrations'
    },
    seeds: {
      directory: '..//db/seeds'
    }
  },
  test: {
    client: 'postgresql',
    connection: `postgres://devel:password@localhost:5432/${databaseName}_test`,
    migrations: {
      directory: '../db/migrations'
    },
    seeds: {
      directory: '../db/seeds'
    }
  }
};

