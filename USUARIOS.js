const mongoose = require("mongoose")
const db = 'mongodb://admin:admin@localhost:27017/'

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
})

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: v => v % 2 === 0,
            massage: props => `${props.value} no es un numero par`
        }
    },
    email: {
        type: String, // Especificar tipo de dato
        required: true, // Not null
        lowercase: true, // Solo minusculas
        minLength: 10,
    },
    createdAt: {
        type: Date,
        immutable: true, // No modificable
        default: () => Date.now(),
    },
    updateAt: {
        type: Date,
        default: () => Date.now(),
    },
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema,
})

module.exports = mongoose.model("User", userSchema)