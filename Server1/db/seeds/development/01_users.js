
const user = require('../../../seeders/user');

exports.seed = function(knex, Promise) {
  return knex('users').del()
            .then( function () {
              return knex('users').insert(user);
            });
};
