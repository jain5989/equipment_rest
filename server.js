import serverless from 'serverless-http'
import express from 'express'
import _ from 'lodash'
import equipment from './routes/equipment.js'
import bodyParser from 'body-parser'

const app = express();

app.use(express.json());

app.use(bodyParser.json({ strict: false }))

app.use('/', equipment); //to use the routes

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

 const handler = serverless(app)
export default handler;