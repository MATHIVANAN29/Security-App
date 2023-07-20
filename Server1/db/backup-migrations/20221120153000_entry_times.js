
exports.up = function(knex, Promise) {
    return knex.schema.createTable('entry_times',function (table){
        table.increments('id').unsigned().primary();

        //table.integer('entry_photo_id');
        //table.foreign('entry_photo_id').references('entry_shot.id').onDelete('CASCADE');


        table.integer('user_id');
        table.foreign('user_id').references('user.id').onDelete('CASCADE');


	table.varchar('status').notNullable()

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
}; 

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('entry_times');
};
