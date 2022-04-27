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

            /*reply.response({
                "name": payload.name,
                "surname": payload.surname,
            }).code(200)*/
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
            }).catch((err) =>{
                console.log(err)
            })


        },
        //validation with Joi
        options: {
            validate: {
                payload: Joi.object ({
                    state: Joi.string().default('INCOMPLETE') ,
                    description: Joi.string().required(),
                })
            },
            response:{
                
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
            
        }
    }
)

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
});

const init = async () => {
    await app.start()
    console.log('App running on %s', app.info.uri)
};

init()