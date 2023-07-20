const knex = require('./knex');//connection

module.exports = {
	getAll(){
		return knex('entry_shot');
	},
	getOne(id){
		return knex('entry_shot').where('id', id).first();
	},
	create(data){
		return knex('entry_shot').insert(data, '*');
	},
	update(id, data){
		return knex('entry_shot').where('id', id).update(data, '*');
	},
	delete(id){
		return knex('entry_shot').where('id', id).del();
	}
}
