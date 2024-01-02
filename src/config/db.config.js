const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/pradeep', {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true
}).then(()=>{
    console.log('MongoDb Connection Successful ');
}).catch((err)=>{
    console.log('No Connection' + err)
})


mongoose.connection.on('disconnected', () => {
    console.log('MongoDb Disconnected!')
}) 