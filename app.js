'use strict'
import Hapi from '@hapi/hapi'
import Joi from 'joi'
import db from './db/db.js'
const app = Hapi.server({ port: 3000, host: 'localhost' })


app.route(
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => { return 'Welcome toDo API!' },
    }

);

//route users
app.route({
    method: ['POST','PUT'],
        path: '/users',
        handler: (request, reply) => {
            const payload = request.payload

           db('users').insert({
                name: payload.name,
                surname: payload.surname,
                password: payload.password
            }).catch((err) =>{
                console.log(err)
            })

           return payload
        },
        //validation with Joi
        options: {
            validate: {
                payload: Joi.object ({
                    name: Joi.string().min(3).required(),
                    surname: Joi.string().min(3).required(),
                    password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
                })
            }
        }
})


//route todos put
app.route(
    {
        method: ['POST','PUT'],
        path: '/todos',
        handler: (request, h) => {
            const payload = request.payload

            db('todos').insert({
                state: payload.state,
                description: payload.description
            }).catch(err =>{
                console.log(err)
            })

            return payload

        },
        //validation with Joi
        options: {
            validate: {
                payload: Joi.object ({
                    state: Joi.string().default('INCOMPLETE') ,
                    description: Joi.string().required(),
                })
            }
        }
    }
)



//route todos get
app.route(
    {
        method: 'GET',
        path: '/todos',
        handler: (request,h) =>{
            const query = request.query
            

            if (query.filter == 'ALL'){
                if (query.orderBy=='DESCRIPTION'){
                    const payload = db('todos').orderBy('description')
                    return payload
                }else{
                    const payload = db('todos').orderBy('dateadded')
                    return payload
                }
            }else if(query.filter == 'COMPLETE'){
                if (query.orderBy=='DESCRIPTION'){
                    const payload = db('todos').where('state', 'COMPLETE').orderBy('description')
                    return payload
                }else{
                    const payload = db('todos').where('state', 'COMPLETE').orderBy('dateadded')
                    return payload
                }
            }else if(query.filter == 'INCOMPLETE'){
                if (query.orderBy=='DESCRIPTION'){
                    const payload = db('todos').where('state', 'INCOMPLETE').orderBy('description')
                    return payload
                }else{
                    const payload = db('todos').where('state', 'INCOMPLETE').orderBy('dateadded')
                    return payload
                }
            }
            
        },
        options:{
            validate: {
                query: Joi.object({
                    filter: Joi.string().uppercase().default('ALL'),
                    orderBy: Joi.string().uppercase().default('DATE_ADDED')
                })
            }
        }
    }
)

app.route({
        method: 'DELETE',
        path: '/todos',
        handler: (request,h) =>{
            const id = request.query.id
            const database = db('todos').where({id: id}) 
            

            database.then(data=>{
                const flag = data.length > 0 ? true : false 
                
                if(flag){
                   const deleteSQL = db('todos').del().where({id:id}).then()
                }
            })
            
            //validar e trazer resposta

        

        },
        options:{
            validate: {
                query: Joi.object({
                    id: Joi.number().required()
                })
            }
        }
})

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
});

const init = async () => {
    await app.start()
    console.log('App running on %s', app.info.uri)
};

init()