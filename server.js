const app = require("./index");
const environements = require('./environement')
const winston = require('winston')


app.listen(environements.port, () => winston.info('App Listening on URL: http://localhost:' + environements.port)
    
)