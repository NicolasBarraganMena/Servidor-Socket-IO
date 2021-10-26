const fs = require("fs")
const Model = require('./Model')

/**
 * emulates the behavior of connecting to a database. really useless and unnecessary
 *
 * @author: Manuel Villarreal
 */
const connect = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(); }, 3000);
    })
}

/**
 * emulates the behavior of an schema in moongose. can be improved to be useful
 * @author: Manuel Villarreal
 */
const Schema = (schemaObject) => {

    return schemaObject;

}
/**
 * return the new Model 
 * @author: Manuel Villarreal
 * @param {string} modelName The name of the Model. part of a collection.
 * @param {object} schema the schema object of the model. Actually useless
 */
const model = (modelName, schema) => {
    return new Model(modelName);
}







module.exports = {
    connect,
    Schema,
    model,
}