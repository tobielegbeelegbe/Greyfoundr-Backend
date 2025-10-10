// BackerController.js
// This file contains all the basic CRUD controllers for Backer management in a Node.js application using Express.js and MySQL (via mysql2 package).
// Assumptions:
// - You have a MySQL database with a 'Backers' table: id (INT, AUTO_INCREMENT, PRIMARY KEY), name (VARCHAR), email (VARCHAR, UNIQUE), password (VARCHAR).
// - Database connection is handled in '../config/database.js' exporting a mysql2 pool (e.g., const pool = mysql.createPool({...}); module.exports = pool;).
// - Install dependencies: npm install express mysql2 (and bcrypt for production password hashing).
// - In production, always hash passwords (e.g., using bcrypt) and add input validation (e.g., using Joi or express-validator).
// - These controllers handle basic operations: GET all Backers, GET by ID, POST create, PUT update, DELETE by ID.

const con = require('../dbconnect');
const crypto = require('crypto');



// Get all Backers
const getBackers = async (req, res) => {
  try {
          console.log("TEST DATA :");
          con.query("SELECT * FROM Backers", function (err, result, fields) {
                if (err) throw err;
                console.log(result); // result will contain the fetched data
                res.send(result);
              }); 
             // res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching Backers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Backer by ID
const getBackerById = async (req, res) => {
  const { id } = req.params;
  try {
    con.query("SELECT * FROM Backers where id = ? ",[id], function (err, result, fields) {
                if (err) throw err;
                console.log(result); // result will contain the fetched data
                res.send(result);
              }); 
    
  } catch (error) {
    console.error('Error fetching Backer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Backer
const createBacker  = async (req, res) => {
  const { name, email, Backername,password,phone } = req.body;
  const BackerId = crypto.randomUUID();
  const currentDate = new Date();
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    // In production: const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO `Backers`( `full_name`, `Backername`, `email`,`phone`, `password_hash`) VALUES (?,?,?,?,?)'
    con.query(sql,[name,Backername,email,phone,password], function (err, result, fields) {
      if (err) throw err;
      console.log(result); // result will contain the fetched data
      res.send('Backer registered successfully!');
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating Backer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Backer by ID
const updateBacker  = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(400).json({ error: 'At least one field (name, email, or password) must be provided' });
  }
  try {
    // In production: if (password) { const hashedPassword = await bcrypt.hash(password, 10); }
    const updateFields = [];
    const values = [];
    if (name) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (password) {
      updateFields.push('password = ?');
      values.push(password); // Use hashedPassword in production
    }
    values.push(id);

    const [result] = await db.execute(
      `UPDATE Backers SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Backer  not found' });
    }
    res.status(200).json({ message: 'Backer  updated successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error updating Backer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Backer by ID
const deleteBacker  = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM Backers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Backer  not found' });
    }
    res.status(200).json({ message: 'Backer  deleted successfully' });
  } catch (error) {
    console.error('Error deleting Backer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getBackers,
  getBackerById,
  createBacker ,
  updateBacker ,
  deleteBacker ,
};