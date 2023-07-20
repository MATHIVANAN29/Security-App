exports.up = function(knex, Promise) {
    return knex.schema.createTable('label',function (table){
        table.increments('id').unsigned().primary();
	table.varchar('path').notNullable();

        table.integer('user_id');
        table.foreign('user_id').references('users.id').onDelete('CASCADE');



    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('label');
};
