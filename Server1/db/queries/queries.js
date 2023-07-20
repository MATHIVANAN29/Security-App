const knex = require('./knex');//connection


module.exports = {
	getAll(query){
		const knexQuery = knex('datasource')
												.pluck('name')
												.select();

		/*
		//query.status
		if(query.status){
			///knexQuery.where('status', query.status);
			knexQuery.where('status', 'like', `%${query.status}%`);
		}

		if(query.configuration){
			knexQuery.where('configuration', 'like', `%${query.configuration}%`);
		}
	*/


		return knexQuery;
		//return knex('dsource');
	},
	getAll2(query){
		const knexQuery = knex('datasource')
												//.pluck('name')
												.select();
		return knexQuery;
		//return knex('dsource');
	},
	getLinked(id){
		const knexQuery = knex('datasource')
													//.where('id',)
												//.pluck('name')
												//.select();
												.join('configs', 'datasource.id', '=', 'ds_id')
												.join('datapoint','configs.id','=','configs_id')
												//.orderBy('datapoint.name', 'desc')
												//.orderBy('configs.ds_id', 'desc')
												.where('datasource.id', id)
												.pluck('datapoint.name')
												//.select(['datasource.name'],['datapoint.name']);
												//.select(['datasource.name',['datapoint.name']]);
												.select();
		return knexQuery;
	},
	getOne(id){
		return knex('datasource').where('id', id).first();
	},
	create(dsource){
		return knex('datasource').insert(dsource, '*');
	},
	update(id, dsource){
		return knex('datasource').where('id', id).update(dsource, '*');
	},
	delete(id){
		return knex('datasource').where('id', id).del();
	}
}
