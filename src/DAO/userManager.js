import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../DAO/models/users.model.js";

const usModel = userModel.userModel;


async function createUser(user) {
    user.password = await bcrypt.hash(user.password, 10);
    return usModel.create(user);
}

async function authenticateUser(email, password) {
    const user = await usModel.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'palabras3cr3t@',
            { expiresIn: '1h' }
        );
        return { user, token };
    }
    return null;
}

const UserManager = {
    createUser,
    authenticateUser
};

export default UserManager;
