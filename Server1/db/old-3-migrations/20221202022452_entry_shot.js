
exports.up = function(knex, Promise) {
    return knex.schema.createTable('entry_shot',function (table){
        table.increments('id').unsigned().primary();

        table.varchar('path').notNullable();


 
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        //table.integer('photo_id').notNullable();
        //table.foreign('photo_id').references('photos.id').onDelete('CASCADE');

    });
}; 

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('entry_shot');
};