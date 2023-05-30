import { Router } from "express";
import userManager from "../DAO/userManager.js";

const router = Router();

router.get('/login', async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

router.get('/register', async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });


router.post('/register', async (req, res) => {
const user = req.body;
console.log(user)
try {
    const newUser = await userManager.createUser(user);
    res.status(201).json(newUser);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

router.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
    const user = await userManager.authenticateUser(email, password);
    if(user) {
        req.session.user = user;
    res.redirect('/api/products');
    } else {
    res.status(401).json({ message: 'Authentication failed' });
    }
} catch (error) {
    res.status(500).json({ message: error.message });
}
});


    export default router;