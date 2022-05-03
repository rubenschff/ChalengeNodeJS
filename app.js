'use strict'
import Hapi from '@hapi/hapi'
import Joi from 'joi'
import db from './db/db.js'
import  Boom  from '@hapi/boom'
const app = Hapi.server({ port: 3000, host: 'localhost' })
const sleep = ms => new Promise(r => setTimeout(r, ms))
const e404 = Boom.notFound('ToDo not Found')
const e400 = Boom.badRequest()

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


//route todos PUT => FINISHED
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

            sleep(3000)
            const view = db('todos').where({description: payload.description})

            return view

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


//route todos GET with filters => FINISHED
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

//route todos DELETE => FINISHED
app.route({
        method: 'DELETE',
        path: '/todos',
        handler: (request,h) =>{
            const id = request.query.id

            const result = db('todos').where({id: id}).then(data =>{
                if(data.length === 0){
                    return e404
                }else{
                    db('todos').del().where({id:id}).then()
                    return{}
                }
            }) 

           return result
            
        

        },
        options:{
            validate: {
                query: Joi.object({
                    id: Joi.number().required()
                })
            }
        }
})

//route todos PATCH
app.route({
    method:'PATCH',
    path:'/todos',
    handler: (request,h) => {
        const query = request.query
        const payload = request.payload
        const database = db('todos').where({id:query.id})

        /*const result = payload.then(data =>{
           if(database.state === 'COMPLETE'){
               console.log(1)
               //return e400
           }else if((database.status === 'INCOMPLETE') & (payload.length > 0)){
               console.log(2)
           }
            
        })

        return result*/
        return 10


    },
    options:{
        validate:{
            query: Joi.object({
                id: Joi.number().required()
            }),
            payload: Joi.object({
                description: Joi.string(),
                state: Joi.string().valid('COMPLETE').uppercase()
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