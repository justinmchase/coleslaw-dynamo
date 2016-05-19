var assert = require('assert')
var vogels = require('vogels')
var Joi = require('joi')

function build(context, callback) {
    assert(context)
    assert(callback)
    assert(!context.dataAccess)
    
    context.dataAccess = {}
    
    var definitions = context.definitions || []
    definitions.forEach(model => {
        var indexFields = model.fields.filter(f => f.index)
        if (!indexFields.length) throw new TypeError(`Model '${model.name}' must have at least one id field`)
        
        var schema = {}
        model.fields.forEach(field => {
            switch(field.type) {
                case 'string':
                    return schema[field.name] = Joi.string()
                case 'number':
                    return schema[field.name] = Joi.number()
                case 'boolean':
                    return schema[field.name] = Joi.boolean()
                default:
                    throw new TypeError(`Field type '${field.type}' not yet supported`)
            }
        })

        var indexes = []
        indexFields.forEach(field => {
            indexes.push({
                name: `${model.name}${field.name}Index`,
                hashKey: field.name,
                type: 'global'
            })
        })
        
        var table = vogels.define(model.name, {
            hashKey: indexFields[0].name,
            timestamps: true,
            schema: schema,
            indexes: indexes
        })
        
        context.dataAccess[model.name] = {
            table: table,
            create: null,
            retrieve: null,
            update: null,
            delete: null
        }
    })
    
    callback(null)
}

module.exports = build
