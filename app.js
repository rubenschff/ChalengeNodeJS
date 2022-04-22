'use strict'
import Hapi from '@hapi/hapi'
import Joi from 'joi'
//import vision from 'vision'
//import inert from 'inert'
//import lout from 'lout'
const app = Hapi.server({ port: 3000, host: 'localhost' })

//await app.register([vision,inert,lout])

app.route(
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => { return 'Hello World!' },
    }

);

//endpoint todos for as a new task
app.route(
    {
        method: ['POST','PUT'],
        path: '/todos',
        handler: (request, h) => {
            console.log(request.payload)
            const payload = request.payload

            if (!payload) {
                return h.response('descrição obrigatoria').code(422)
            }
            return h.response(`Criado ${payload.description}`).code(200)
        }
    }
)

//endpoint GET /todos route
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