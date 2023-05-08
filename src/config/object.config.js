import { connect } from 'mongoose';

let url = 'mongodb+srv://santimantelli:36606.regatas@ecommerce.tscroq4.mongodb.net/';

const connectDB = () => {
    connect(url);
    console.log('Base de datos conectada');
};

export default { connectDB };

