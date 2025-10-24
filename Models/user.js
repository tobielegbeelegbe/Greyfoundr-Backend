const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updateWalletBalance(id, amount) {
        await pool.execute(
            'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
            [amount, id]
        );
    }
}

module.exports = User;