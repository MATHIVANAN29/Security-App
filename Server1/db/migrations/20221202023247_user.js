exports.up = function(knex, Promise) {
    return knex.schema.createTable('users',function (table){
        table.increments('id').unsigned().primary();
	table.varchar('username').notNullable();
	table.varchar('rfid').notNullable();

	table.varchar('image_status'); //true or false, default false till trained
	//table.integer('image_id').notNullable();


	table.varchar('profile');

	table.varchar('unit_number');

	table.varchar('phone_number').notNullable();

    /*
	table.integer('image_id');
	table.foreign('image_id').references('image.id').onDelete('CASCADE');

	table.integer('label_id');
	table.foreign('label_id').references('label.id').onDelete('CASCADE');
    */
   
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
