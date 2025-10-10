// InfluencerController.js
// This file contains all the basic CRUD controllers for Influencer management in a Node.js application using Express.js and MySQL (via mysql2 package).
// Assumptions:
// - You have a MySQL database with a 'Influencers' table: id (INT, AUTO_INCREMENT, PRIMARY KEY), name (VARCHAR), email (VARCHAR, UNIQUE), password (VARCHAR).
// - Database connection is handled in '../config/database.js' exporting a mysql2 pool (e.g., const pool = mysql.createPool({...}); module.exports = pool;).
// - Install dependencies: npm install express mysql2 (and bcrypt for production password hashing).
// - In production, always hash passwords (e.g., using bcrypt) and add input validation (e.g., using Joi or express-validator).
// - These controllers handle basic operations: GET all Influencers, GET by ID, POST create, PUT update, DELETE by ID.

const con = require('../dbconnect');
const crypto = require('crypto');



// Get all Influencers
const getInfluencers = async (req, res) => {
  try {
          console.log("TEST DATA :");
          con.query("SELECT * FROM Influencers", function (err, result, fields) {
                if (err) throw err;
                console.log(result); // result will contain the fetched data
                res.send(result);
              }); 
             // res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching Influencers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Influencer by ID
const getInfluencerById = async (req, res) => {
  const { id } = req.params;
  try {
    con.query("SELECT * FROM Influencers where id = ? ",[id], function (err, result, fields) {
                if (err) throw err;
                console.log(result); // result will contain the fetched data
                res.send(result);
              }); 
    
  } catch (error) {
    console.error('Error fetching Influencer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Influencer
const createInfluencer  = async (req, res) => {
  const { name, email, Influencername,password,phone } = req.body;
  const InfluencerId = crypto.randomUUID();
  const currentDate = new Date();
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    // In production: const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO `Influencers`( `full_name`, `Influencername`, `email`,`phone`, `password_hash`) VALUES (?,?,?,?,?)'
    con.query(sql,[name,Influencername,email,phone,password], function (err, result, fields) {
      if (err) throw err;
      console.log(result); // result will contain the fetched data
      res.send('Influencer registered successfully!');
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating Influencer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Influencer by ID
const updateInfluencer  = async (req, res) => {
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
      `UPDATE Influencers SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Influencer  not found' });
    }
    res.status(200).json({ message: 'Influencer  updated successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error updating Influencer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Influencer by ID
const deleteInfluencer  = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM Influencers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Influencer  not found' });
    }
    res.status(200).json({ message: 'Influencer  deleted successfully' });
  } catch (error) {
    console.error('Error deleting Influencer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getInfluencers,
  getInfluencerById,
  createInfluencer ,
  updateInfluencer ,
  deleteInfluencer ,
};