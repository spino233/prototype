export const sampleSchema = {
    title: 'sample schema',
    description: 'describes sample data for prototype purpose',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'number',
            maxLength: '100'
        },
        name: {
            type: 'string'
        },
        surname: {
            type: 'string'
        },
        age: {
           type: 'string' 
        },
        _deleted: {
            type: 'boolean'
        },
        updatedAt: {
            type: 'string'
        }
    },
    required: [
        'name',
        'surname',
        'age'
    ]
};