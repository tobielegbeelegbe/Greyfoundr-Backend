    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
 
    const userRoute = require('./Routes/endpoints/user');
    const authRoute = require('./Routes/endpoints/auth');
    const adminRoute = require('./Routes/endpoints/admin');
    const backerRoute = require('./Routes/endpoints/backer');
    const campaignRoute = require('./Routes/endpoints/campaigns');
    const championRoute = require('./Routes/endpoints/champion');
    const followerRoute = require('./Routes/endpoints/follower');
    const influencerRoute = require('./Routes/endpoints/influencer');
    const walletRoute = require('./Routes/endpoints/wallets');
    
    const path = require('path');

    app.use('/users', userRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/auth', authRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/users', walletRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/auth', influencerRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/users', followerRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/auth', championRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/users', campaignRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/auth', adminRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/users', backerRoute);
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'main.html'));
    });

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'register.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    });





    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });