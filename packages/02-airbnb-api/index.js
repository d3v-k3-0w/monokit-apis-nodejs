const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const imgDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/UserModel');
const PlaceModel = require('./models/PlaceModel');
const BookingModel = require('./models/BookingModel');
require('dotenv').config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const SECRET_MAGIC = 'sfAWsfssf34sd2';

//++ middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(`${__dirname}/uploads`));

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:5173',
	})
);

mongoose.connect(process.env.MONGO_URI);

const getUserDataFromToken = (req) => {
	return new Promise((resolve, reject) => {
		jwt.verify(req.cookies.token, SECRET_MAGIC, {}, async (err, userTokenData) => {
			if (err) throw err;

			resolve(userTokenData);
		});
	});
};

app.get('/test', (req, res) => {
	res.json('test ok');
});

app.post('/registrar', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const userDoc = await UserModel.create({
			name,
			email,
			password: bcrypt.hashSync(password, bcryptSalt),
		});
		res.json(userDoc);
	} catch (err) {
		res.status(422).json(err);
	}
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const userDoc = await UserModel.findOne({ email });

		if (userDoc) {
			const passOk = bcrypt.compareSync(password, userDoc.password);

			if (passOk) {
				jwt.sign({ email: userDoc.email, id: userDoc._id }, SECRET_MAGIC, {}, (err, token) => {
					if (err) throw err;
					res.cookie('token', token).json(userDoc);
				});
			} else {
				res.status(422).json('pass not ok');
			}
		} else {
			res.json('not found');
		}
	} catch (err) {
		res.status(422).json(err);
	}
});

app.get('/profile', async (req, res) => {
	const { token } = req.cookies;

	if (token) {
		jwt.verify(token, SECRET_MAGIC, {}, async (err, userTokenData) => {
			if (err) throw err;

			const { name, email, _id } = await UserModel.findById(userTokenData.id);
			res.json({ name, email, _id });
		});
	} else {
		res.json(null);
	}
});

// console.log({ __dirname });

app.post('/upload-by-link', async (req, res) => {
	const { link } = req.body;
	const newName = `photo${Date.now()}.jpg`;

	await imgDownloader.image({
		url: link,
		dest: `${__dirname}/uploads/${newName}`,
	});

	res.json(newName);
});

const cargarPhotosMiddle = multer({ dest: 'uploads/' });

app.post('/upload', cargarPhotosMiddle.array('photos', 100), async (req, res) => {
	const uploadedFiles = [];

	for (let i = 0; i < req.files.length; i++) {
		const { path } = req.files[i];

		console.log(req.files);

		//++ cambiar la extensión del archivo a .jpg
		const newPath = `${path}.jpg`;

		//++ renombrar el archivo
		fs.renameSync(path, newPath);

		//++ normalizar la ruta de archivo usando regex
		const normalizedPath = newPath.replace(/\\/g, '/');

		//++ agregar la ruta de archivo normalizada a la lista de archivos subidos
		uploadedFiles.push(normalizedPath.replace('uploads/', ''));
	}

	res.json(uploadedFiles);
});

app.post('/add-places', (req, res) => {
	const { token } = req.cookies;

	const {
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuest,
		price,
	} = req.body;

	jwt.verify(token, SECRET_MAGIC, {}, async (err, userTokenData) => {
		if (err) throw err;

		const placeDoc = await PlaceModel.create({
			owner: userTokenData.id,
			title,
			address,
			photos: addedPhotos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuest,
			price,
		});
		res.json(placeDoc);
	});
});

app.get('/all-places', async (req, res) => {
	res.json(await PlaceModel.find());
});

app.get('/all-places-user', (req, res) => {
	const { token } = req.cookies;

	jwt.verify(token, SECRET_MAGIC, {}, async (err, userTokenData) => {
		const { id } = userTokenData;
		res.json(await PlaceModel.find({ owner: id }));
	});
});

app.get('/find-place/:id', async (req, res) => {
	const { id } = req.params;

	res.json(await PlaceModel.findById(id));

	// console.log(id);
});

app.put('/update-place', async (req, res) => {
	const { token } = req.cookies;

	const {
		id,
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuest,
		price,
	} = req.body;

	jwt.verify(token, SECRET_MAGIC, {}, async (err, userTokenData) => {
		const placeDoc = await PlaceModel.findById(id);

		if (userTokenData.id === placeDoc.owner.toString()) {
			placeDoc.set({
				title,
				address,
				photos: addedPhotos,
				description,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuest,
				price,
			});

			await placeDoc.save();
			res.json('ok');
		}
	});
});

app.post('/bookings', async (req, res) => {
	const userData = await getUserDataFromToken(req);

	const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

	BookingModel.create({
		place,
		checkIn,
		checkOut,
		numberOfGuests,
		name,
		phone,
		price,
		user: userData.id,
	})
		.then((doc) => {
			res.json(doc);
		})
		.catch((err) => {
			throw err;
		});
});

app.get('/all-bookings-user', async (req, res) => {
	const userData = await getUserDataFromToken(req);
	res.json(await BookingModel.find({ user: userData.id }).populate('place'));
});

app.post('/logout', (req, res) => {
	res.cookie('token', '').json(true);
});

app.listen(3000);
