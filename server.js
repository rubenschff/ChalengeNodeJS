'use strict'
import Hapi from '@hapi/hapi'
const server = Hapi.server({ port: 3000, host: 'localhost' })


server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello World!'
    }
});

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
});

const init = async () => {
    await server.start()
    console.log('Server running on %s', server.info.uri)
};

init()