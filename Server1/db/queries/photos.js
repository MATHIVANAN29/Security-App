const knex = require('./knex');//connection

module.exports = {
  getOne(id){
    return knex('users').where('id', id).first();
  },
  getOneUser(id){
  return knex('users').where('id', id).select();
},
getAll(status){
  return knex('users').where('status',status).select();
},
getAllUsers(){
  return knex('users').where('status','Approved').pluck('username').select();
},
getId(name){
  return knex('users').where('username',name).pluck('id').select();
},
  getOneByEmail(email){
    return knex('users').where('email', email).first();
  },
  update(id, data){
    return knex('users').where('id', id).update(data, '*');
  },
  delete(id){
   return knex('users').where('id', id).del();
 },
  create(user){
    return knex('users').insert(user,'id').then(ids => {
      return ids[0];
    });
  }

}
