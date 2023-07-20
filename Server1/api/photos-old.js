const express = require('express');
const router = express.Router();

const queries = require('../db/queries/photos');

function isValidId(req, res, next){
	if(!isNaN(req.params.id)) return next();
	next(new Error('invalid ID..'));

}

function validSource(source){
	//const hasName = typeof source.data_point_id == 'string' && source.data_point_id.trim() != '';
  //const hasValue = typeof source.value == 'float';// && source.value != NULL;
  //const hasValue = source.value != NULL;
	//return hasName ;//&& hasValue;
	return true;
}


router.get('/', (req,res) => {
  console.log(req.query);
  const {name,configuration} = req.query;
  queries.getAll({name,configuration}).then(dsource => {
      res.json(dsource);
  });

});


router.get('/:id', isValidId, (req,res, next) => {
	queries.getOne(req.params.id).then(dsource => {
		if(dsource){
			res.json(dsource);
		}else{
			//res.status(404);
			next();
		}

	});
});



router.post('/', (req,res, next) => {
	if(validSource(req.body)){
		queries.create(req.body).then(dsources => {
			res.json(dsources[0]);
		});
	}else{
		next(new Error('invalid data source'));

	}
});

router.put('/:id', (req, res, next) => {
  if(validSource(req.body)){
    queries.update(req.params.id, req.body ).then(dsources => {
      res.json(dsources[0]);
    });
  }else{
    next(new Error('invalid data source format'));
  }
});

router.delete('/:id', isValidId, (req, res) => {
  queries.delete(req.params.id).then( () => {
     res.json({
       deleted:true
     });
   });
});

module.exports = router;
