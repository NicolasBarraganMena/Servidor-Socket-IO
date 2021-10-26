const { model, Schema } = require('../jsonDB/jsonDB');

const UsuarioSchema = Schema({
    id: Number,
    username: String,
    estado: Boolean,
    score: Number,
    achievements: Array,
    friends:Array,
});


module.exports = model('Usuario', UsuarioSchema);