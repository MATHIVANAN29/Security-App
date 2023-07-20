
exports.up = function(knex, Promise) {
    return knex.schema.createTable('entry_shot',function (table){
        table.increments('id').unsigned().primary();

        table.varchar('path').notNullable();


 
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
}; 

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('entry_shot');
};