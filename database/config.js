const  mongoose  = require("mongoose")


const dbConnection = async () => {
    try {
        
        mongoose.set('strictQuery', false)
        await mongoose.connect( process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            
        })

        console.log('DB Online')

    } catch (error) {
        console.log(error)
        throw new Error('Error ala hora de inicializar la BD')
    }
}


module.exports = {
    dbConnection
};