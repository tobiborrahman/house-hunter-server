// const express = require('express');
// const app = express();
// const port = process.env.PORT || 5000;

// const cors = require('cors');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');

// // middleware
// const corsOptions = {
// 	origin: '*',
// 	credentials: true,
// 	optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// const jwtToken = process.env.TOKEN_SECRET;

// // MongoDB database connection
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytasiev.mongodb.net/?retryWrites=true&w=majority`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
// 	serverApi: {
// 		version: ServerApiVersion.v1,
// 		strict: true,
// 		deprecationErrors: true,
// 	},
// });

// async function run() {
// 	try {
// 		// Connect the client to the server	(optional starting in v4.7)
// 		// await client.connect();

// 		const userCollection = client.db('house-hunter').collection('users');

// 		// JWT Secret Key
// 		const secretKey = 'yourSecretKey';

// 		// User Registration
// 		app.post('/register', async (req, res) => {
// 			try {
// 				const { fullName, role, phoneNumber, email, password } =
// 					req.body;

// 				// Check if the user already exists
// 				const existingUser = await userCollection.findOne({ email });
// 				if (existingUser) {
// 					return res
// 						.status(400)
// 						.json({ error: 'User already exists' });
// 				}

// 				// Create a new user
// 				await userCollection.insertOne({
// 					fullName,
// 					role,
// 					phoneNumber,
// 					email,
// 					password,
// 				});

// 				res.status(201).json({ message: 'Registration successful' });
// 			} catch (error) {
// 				console.error(error);
// 				res.status(500).json({ error: 'Internal Server Error' });
// 			}
// 		});

// 		app.get('/register', async (req, res) => {
// 			const result = await userCollection.find().toArray();
// 			res.send(result);
// 			console.log(result);
// 		});

// 		// User Login
// 		app.post('/login', async (req, res) => {
// 			try {
// 				const { email, password } = req.body;

// 				// Check if the user exists
// 				const user = await User.findOne({ email });
// 				if (!user || user.password !== password) {
// 					return res
// 						.status(401)
// 						.json({ error: 'Invalid credentials' });
// 				}

// 				// Generate JWT token
// 				const token = jwt.sign(
// 					{ userId: user._id, email: user.email },
// 					secretKey,
// 					{ expiresIn: '1h' }
// 				);

// 				res.json({ token });
// 			} catch (error) {
// 				console.error(error);
// 				res.status(500).json({ error: 'Internal Server Error' });
// 			}
// 		});

// 		// Protected route that requires a valid JWT
// 		app.get('/protected', (req, res) => {
// 			const token = req.header('Authorization');

// 			if (!token) {
// 				return res.status(401).json({ error: 'Unauthorized' });
// 			}

// 			// Verify the JWT
// 			jwt.verify(token, secretKey, (err, decoded) => {
// 				if (err) {
// 					return res.status(401).json({ error: 'Invalid token' });
// 				}

// 				// Access the user information from the decoded JWT
// 				const { userId, email } = decoded;

// 				// Your logic for handling the protected route
// 				res.json({
// 					userId,
// 					email,
// 					message: 'Access granted to protected route',
// 				});
// 			});
// 		});

// 		// Send a ping to confirm a successful connection
// 		await client.db('admin').command({ ping: 1 });
// 		console.log(
// 			'Pinged your deployment. You successfully connected to MongoDB!'
// 		);
// 	} finally {
// 		// Ensures that the client will close when you finish/error
// 		// await client.close();
// 	}
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
// 	res.send('Ore Allah! E dekhi house hunter');
// });

// app.listen(port, () => {
// 	console.log(`House hunter is running on port ${port}`);
// });

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken'); // Import jwt module

// middleware
const corsOptions = {
	origin: '*',
	credentials: true,
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytasiev.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server (optional starting in v4.7)
		// await client.connect();

		const userCollection = client.db('house-hunter').collection('users');

		// JWT Secret Key
		const secretKey = process.env.TOKEN_SECRET;

		// User Registration
		app.post('/register', async (req, res) => {
			try {
				const { fullName, role, phoneNumber, email, password } =
					req.body;

				// Check if the user already exists
				const existingUser = await userCollection.findOne({ email });
				if (existingUser) {
					return res
						.status(400)
						.json({ error: 'User already exists' });
				}

				// Create a new user
				await userCollection.insertOne({
					fullName,
					role,
					phoneNumber,
					email,
					password,
				});

				res.status(201).json({ message: 'Registration successful' });
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		});

		app.get('/register', async (req, res) => {
			const result = await userCollection.find().toArray();
			res.send(result);
			console.log(result);
		});

		// User Login
		app.post('/login', async (req, res) => {
			try {
				const { email, password } = req.body;

				// Check if the user exists
				const user = await userCollection.findOne({ email });
				if (!user || user.password !== password) {
					return res
						.status(401)
						.json({ error: 'Invalid credentials' });
				}

				// Generate JWT token
				const token = jwt.sign(
					{ userId: user._id, email: user.email },
					secretKey,
					{ expiresIn: '1h' }
				);

				res.json({ token });
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		});

		// Protected route that requires a valid JWT
		app.get('/protected', (req, res) => {
			const token = req.header('Authorization');

			if (!token) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			// Verify the JWT
			jwt.verify(token, secretKey, (err, decoded) => {
				if (err) {
					return res.status(401).json({ error: 'Invalid token' });
				}

				// Access the user information from the decoded JWT
				const { userId, email } = decoded;

				// Your logic for handling the protected route
				res.json({
					userId,
					email,
					message: 'Access granted to protected route',
				});
			});
		});

		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}

run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Ore Allah! E dekhi house hunter');
});

app.listen(port, () => {
	console.log(`House hunter is running on port ${port}`);
});
