exports.up = function(knex, Promise) {
    return knex.schema.createTable('user',function (table){
        table.increments('id').unsigned().primary();
	table.varchar('username').notNullable();
	table.varchar('rfid').notNullable();

	table.varchar('image_status'); //true or false, default false till trained
	//table.integer('image_id').notNullable();
	table.integer('image_id');
	table.foreign('image_id').references('label.id').onDelete('CASCADE');

    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user');
};
