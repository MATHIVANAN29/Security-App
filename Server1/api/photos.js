const express = require('express');
const router = express.Router();

const uuidv1 = require('uuidv1');
const shell = require('shelljs');
const path = require("path");
const multer = require('multer');
const mkdirp = require('mkdirp');

var fs = require('fs');


const queries = require('../db/queries/photos');


let imagesPath = "/home/securityapp/pytorchFaceRecognition/user-images/";


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



let fid = uuidv1();
let folderFlag = 0;
var storage = multer.diskStorage({
    destination: (req, file, cb) => {  

	//console.log("userid=> multer => " + req);

        let destination = path.join('./folder/images');
        const curDirPathToCreate = path.resolve('folder/images/', fid );
        // console.log("curDirPathToCreate=>",curDirPathToCreate);
        // console.log("fs.existsSync( curDirPathToCreate )=>",fs.existsSync( curDirPathToCreate ));
        
        //  shell.mkdir('-p', './api/images/' + fid);
        let foo = shell.ShellString(shell.mkdir('-p', './folder/images/' + fid));
        // console.log("foo=>",foo);
        destination = path.join(destination, fid);
        // console.log("destination=>",destination);
        cb(null, destination );
    },
    filename: (req, file, cb) => {
        // console.log("file",file);
        cb(null, file.originalname);
    }
    
});


const upload = multer({ storage: storage });

router.use('/show', express.static(path.join('./folder/','images/')));

router.post('/upload',  upload.array('file', 100), (req, res) => {

	console.log('up-loading init ...');
	//console.log(req);
	console.log(req.file);



  console.log(req.userid);
  const userId = (req.body.userid)?req.body.userid:null;



	// const userId = (req.body.userId)?req.body.userId:null;
    // const type = (req.body.type)?req.body.type:null;
    // const projectId = (req.body.projectId)?req.body.projectId:null;

	  //const userId = 4; //'1234abc';
    const type = 'test';
    const projectId = 1;




	folderFlag = 0;//reset back to zero use once per upload
    let files = req.files;
    //let send_data =[],p1;

    let destination = files[0].destination;
    destination = path.join(destination, '', fid);
    // console.log("destination=>",destination);
    // console.log("files",files);
    var JSONtopatch;
    files.forEach((ff, index) => {
        // console.log("ff",ff);
        let tmp_path = ff.path;
        var target_path = destination + '/'+ ff.originalname;


       

        var globalRoot = __dirname; //(you may have to do some substring processing if the first script you run is not in the project root, since __dirname refers to the directory that the file is in for which __dirname is called in.)
    
        //compare the last directory in the globalRoot path to the name of the project in your package.json file
        // var folders = globalRoot.split(path.sep);
        // var packageName = folders[folders.length-1];
        // var pwd = process.env.PWD;
        // console.log("path: ", pwd , " folders: ", folders );
        // console.log("Current directory:", __dirname);

         console.log("target_path=>",target_path);
        
        var target_url = '/api/image/show/' + fid + '/'+ ff.originalname;
        
        JSONtopatch= {
            "name": ff.originalname,
            "folder": fid,
            //"url": target_url,
            //"userId":userId,
            //"projectId":projectId,
            //"type":type
	    "user_id":userId
        };
    });


	queries.create(JSONtopatch).then(output => {
       // res.json({"id":output[0].id});
	   res.json(output[0]);

    }).catch(err=>{
        console.log(err);
        res.status(404).json(err);
    });






});


router.get('/', (req,res) => {
  console.log(req.query);
  // const {name,configuration} = req.query;
  // queries.getAll({name,configuration}).then(dsource => {
  //     res.json(dsource);
  // });

  
  queries.getAll().then(data => {
      res.json(data);
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


const storage2 = multer.diskStorage({

	destination: function(req,file,cb){
		//console.log(req.body.userid);
		//console.log("u.id => "+ req.userid);

		cb(null, 'uploads2/');
	},
	filename: function (req,file, cb){
		cb(null, file.originalname);
	}
});


function copyFolder(source, destination) {
  // Create destination folder if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  // Read the contents of the source folder
  const files = fs.readdirSync(source);

  // Copy each file from the source folder to the destination folder
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    // Check if the current item is a file or a directory
    if (fs.statSync(sourcePath).isDirectory()) {
      // If it's a directory, recursively call the function to copy its contents
      copyFolder(sourcePath, destPath);
    } else {
      // If it's a file, copy it to the destination folder
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function deleteFolderContents(folder) {
  // Read the contents of the folder
  const files = fs.readdirSync(folder);

  // Delete each file or subfolder within the folder
  files.forEach(file => {
    const filePath = path.join(folder, file);

    if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, recursively call the function to delete its contents
      deleteFolderContents(filePath);
      fs.rmdirSync(filePath);
    } else {
      // If it's a file, delete it
      fs.unlinkSync(filePath);
    }
  });
}


const upload2 = multer({storage: storage2});
//router.post("/test", upload2.array(), (req, res,next) => {
 
router.post("/trainingdata", upload2.array('images[]', 100), (req, res,next) => {
//router.post("/test",  (req, res,next) => {

	console.log("receiving...");


	console.log('up-loading init ...');
	//console.log(req);
	//console.log(req.file);

	console.log('moving files..');
	console.log(req.body.userid);
        let userid = req.body.userid;

	let oldPath = 'uploads2/';
	let newPath = imagesPath + userid.toString()+"/";
	//let newPath = path.join(imagesPath,userid.toString());

	console.log("new path => " + imagesPath);
	var TARGETPATH = imagesPath + userid.toString();

	copyFolder(oldPath, TARGETPATH);
	deleteFolderContents(oldPath);


	/*
	if(!fs.existsSync(TARGETPATH)){
		fs.mkdir(path.join(imagesPath, userid.toString()), (err) => {

			if(err){
				console.log('err => ' + error);

				res.json({"result":"failed"});
			}
		});

	}
	*/

	/*
	fs.mkdir(path.join(imagesPath, userid.toString()), (err) => {

		if(err){
			console.log('err => ' + error);
		}
	});
	*/



	res.json({"result":"done"});



});

router.post('/trainingdata', (req, res, next) => {


console.log("receiveing images");
console.log(req.body);
console.log(JSON.stringify(req.body));

//console.log(req.body.userid);
console.log(req.body.files);
//console.log(req.body.files)


console.log(req.query);

res.json({"result":"done"});


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
