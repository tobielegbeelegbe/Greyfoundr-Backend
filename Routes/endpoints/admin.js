const express = require('express');
const router = express.Router();
const con = require('../../dbconnect');
router.use(express.urlencoded({ extended: true }));
router.get('/', (req, res) => {
       
      console.log("TEST DATA :");
      con.query("SELECT * FROM user", function (err, result, fields) {
            if (err) throw err;
            console.log(result); // result will contain the fetched data
            res.send(result);
          });
    });

router.post('/create', (req, res) => {
    // Logic to create a new user
    const { name, email, password,phone } = req.body; // Extract data from the request body

        // Here, you would typically save the user data to a database
        // For demonstration, we'll just log it to the console
        console.log('New user registration:');
        console.log('Username:', name);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Phone:', phone);
        const sql = 'INSERT INTO `user`(`name`, `email`, `phone`, `password`) VALUES (?,?,?,?)'
         con.query(sql,[name,email,phone,password], function (err, result, fields) {
            if (err) throw err;
            console.log(result); // result will contain the fetched data
            res.send('User registered successfully!');
          });

        // Send a response back to the client
        
});

router.get('/getUser/:id', (req, res) => {
    // Logic to create a new user
    //res.status(201).send('User created successfully');
    res.send(` ${req.params.id}`);
});


module.exports = router;