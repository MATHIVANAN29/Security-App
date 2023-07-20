const knex = require('./knex');//connection

module.exports = {
	getAll(){
		return knex('entry_times');
	},
	getOne(id){
		return knex('entry_times').where('id', id).first();
	},
	create(data){
		return knex('entry_times').insert(dsource, '*');
	},
	update(id, data){
		return knex('entry_times').where('id', id).update(data, '*');
	},
	delete(id){
		return knex('entry_times').where('id', id).del();
	}
}
