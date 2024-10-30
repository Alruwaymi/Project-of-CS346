const mongoose = require('mongoose');

const uri = ('mongodb+srv://qasemabdullah97:lBrTk9gXXd0702bW@cluster0.xb7in.mongodb.net/restaurant?retryWrites=true&w=majority')
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));