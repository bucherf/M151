var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose')



var fs = require('fs');
var path = require('path');

app.use(express.static(__dirname));



mongoose.connect('mongodb://localhost/instagrammy',
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected to  mongodb://localhost/instagrammy')
	});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine", "ejs");


var multer = require('multer');


var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});


app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/welcome'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/home'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/login'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/register'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/image_create'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/image_display'));
});

var upload = multer({ storage: storage });

var modelBlog = require('./model/role').Role;
var modelImage = require('./model/image').Image;
var modelUser = require('./model/user').User;


//register
app.post('/register', upload.single('user'), (req, res) => {

	var userObj = {
		username: req.body.username,
		password: req.body.password,
        profilPicture:
        {
            data: null,
            contentType: date
        }
	}
	modelUser.create(userObj, (err) => {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect('/');
		}
	});
});

//login
app.post('/login', async (req, res) => {

	let user = await userModel.findOne({ username: req.body.username, password:req.body.password});

	if (user){
			req.session.userid = user.id;
			req.session.username = user.username;
			console.log(req.session.userid);
			console.log(req.session.username);

			let images = await modelImage.find({userID: req.session.userid}).exec();

			res.render('profile', {user: user, images: images, texts: texts});
	} else {
		res.status(200).send("Not an existing user")
	}
	}
);









//upload image
app.post('/image/create', upload.single('image') , (req, res, next) => {
    const imageValidation = ['image/gif', 'image/jgp', 'image/jpeg', 'image/png'];
    const File = req.file.mimetype;

    if(!imageValidation.includes(File)) {
        res.status(500).send('This file cannot be uploaded!', { message: 'File type is wrong' });
        return;
    }

    var obj = {
        name: req.body.title,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    modelImage.create(obj, (err, item) => {
        if(err) {
            console.error(err);
            res.status(500).send('An error occurred', err);
        } else {
            res.redirect('/');
        }
    });
});




//delete image
app.post('/image/delete', (req, res) => {
    modelImage.deleteOne({ _id: req.body.id }, (error) => {
        if(error) {
            console.error(error);
            res.status(500).send('An error occurred', error);
        } else {
            res.redirect('/image/display');
        }
    });
});

app.get('/image/display', (req, res) => {
    modelImage.find({}, (error, items) => {
        if(error) {
            console.error(error);
            res.status(500).send('An error occurred', error);
        } else {
            res.render(path.join(__dirname, 'views/image_display'), { items })
        }
    });
});

app.post('/imgage/like',(req,res) => {
	models.Image.findOneAndUpdate({_id:req.body.id},{$inc : {'likes':1} }, (error) => {
		if (error)
		{
			throw error
		}
		else
		{
			res.redirect('/display_image')
		}
	})
});








var port = process.env.PORT || '3333';
app.listen(port, err => {
    if(err)
        throw err
    console.log('Server listening on port', port);
});