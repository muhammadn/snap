// setup database
var pgp = require('pg-promise')({
    // Initialization Options
});

var connectionString = 'postgres://devel:password@localhost:5432/snap_development';
var db = pgp(connectionString);

module.exports = db;
