// Require all packages needed for the project
const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const User = require('./models/User'); // Assuming you have a User model in 'models' directory
const Job = require('./models/Jobs'); // Assuming you have a Job model in 'models'
const PORT = process.env.PORT || 5000;
// Load environment variables from a .env file
dotEnv.config();

// Establish MongoDB connection
mongoose.connect(process.env.URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

// Create a MongoDB session store
const store = new MongoDBStore({
    uri: process.env.URI,
    collection: 'mysessions'
});

// Set up middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use(flash());
// Set up session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Custom middleware to check authentication
const checkAuth = (request, response, next) => {
    if (request.session.isAuthenticated) {
        next();
    } else {
        response.redirect('/login');
    }
}

// Define routes
// Render the login page route
app.get('/login', (request, response) => {
    response.render('login', { message: [] });
});

// Render the registration page route
app.get('/register', (request, response) => {
    response.render('register', { message: request.flash('message') });
});

// Render the welcome page route with authentication check
app.get('/welcome', checkAuth, (request, response) => {
    response.render('welcome');
});

// Handle registration form submission route
app.post('/register', async (request, response) => {
    const { fullname, username, email, phonenumber, password, confirmpassword, gender } = request.body;
    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            // Set flash message for existing user
            request.flash('message', 'User with this email already exists');
            return response.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const hashedConfirmPassword = await bcrypt.hash(confirmpassword, 12);
        existingUser = new User({
            fullname,
            username,
            email,
            phonenumber,
            password: hashedPassword,
            confirmpassword: hashedConfirmPassword,
            gender
        });

        await existingUser.save();
// Set flash message for successful registration
const successMessage = 'Registration successful';
request.flash('message', successMessage);

// Render the register page with the flash message before redirecting
return response.render('register', { message: successMessage });

    } catch (error) {
        console.error('Registration error:', error);
        response.status(500).send('Internal Server Error');
    }
});



// Handle login form submission route
app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const errorMessage = 'User not found';
            return response.render('login', { message: errorMessage });
        }

        if (!user.password) {
            console.error('User has no password:', user);
            return response.status(500).send('Internal Server Error');
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            const errorMessage = 'Wrong password';
            return response.render('login', { message: errorMessage });
        }

        request.session.isAuthenticated = true;
        response.redirect('/welcome');
    } catch (error) {
        console.error('Login error:', error);
        response.status(500).send('Internal Server Error');
    }
});

// Handle job submission route
app.post('/savejobs', async (request, response) => {
    // Extract job information from the request body
    const { name, email, phone, designation, jobDescription, experience, responsibilities, requiredDate, ctc } = request.body;

    try {
        // Create a new Job document with the extracted information
        const newJob = new Job({
            name,
            email,
            phone,
            designation,
            jobDescription,
            experience,
            responsibilities,
            requiredDate,
            ctc,
        });
        // Save the job information to the database
        await newJob.save();

        // Redirect to a success page or perform any other actions
        response.redirect('/welcome');
    } catch (error) {
        console.error('Job submission error:', error);
        response.status(500).send('Internal Server Error');
    }
});

// handel the logout route
app.post('/logout', (request, response) => {
    request.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);
            response.status(500).send('Internal Server Error');
        } else {
            response.redirect('/login');
        }
    });
})

// Handle search route
app.get('/jobs', async (request, response) => {
    try {
        const searchTerm = request.query.term;
        console.log('Search Term:', searchTerm);

        const jobsFromDatabase = await Job.find({
            designation: { $regex: searchTerm, $options: 'i' }
        });
        console.log('Jobs Found:', jobsFromDatabase);

        const jobs = jobsFromDatabase.map(jobData => new Job(jobData));
        console.log('Mapped Jobs:', jobs);

        response.json({ jobs }); // Send JSON response
    } catch (error) {
        console.error('Error fetching jobs:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
