// index.js
import serverless from 'serverless-http'
import express from 'express'
import AWS from 'aws-sdk'
import bodyParser from 'body-parser'
import _ from 'lodash'

const app = express()

const EQUIPMENT_TABLE = process.env.EQUIPMENTS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.use(bodyParser.json({ strict: false }))

app.get('/equipment', function (req, res) {
  res.send('Hello World!')
})

// Get equipments endpoint
app.get('/equipment/search', function (req, res) {
  const { numberOfRows } = req.query.limit
  const params = { TableName: EQUIPMENT_TABLE }
  const scanResults = []
  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not get equipment' })
    }
    if (result.Items) {
      result.Items.forEach((item) => scanResults.push(item))
      console.log(scanResults)
      res.json(scanResults)
    } else {
      res.status(404).json({ error: 'Equipment not found' })
    }
  })
})

// Get equipments by equipment number endpoint
app.get('/equipment/:equipmentNumber', function (req, res) {
  const params = {
    TableName: EQUIPMENT_TABLE,
    Key: {
      equipmentNumber: req.params.equipmentNumber
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not get equipment' })
    }

    if (result.Item) {
      const { equipmentNumber, address, contractStartDate, contractEndDate, status } = result.Item
      res.json({ equipmentNumber, address, contractStartDate, contractEndDate, status })
    } else {
      res.status(404).json({ error: 'Equipment not found' })
    }
  })
})

// Create User endpoint
app.post('/equipment', function (req, res) {
  const { equipmentNumber, address, contractStartDate, contractEndDate, status } = req.body
  if (typeof equipmentNumber !== 'string') {
    res.status(400).json({ error: 'equipmentNumber must be a string' })
  } else if (typeof address !== 'string') {
    res.status(400).json({ error: 'address must be a string' })
  } else if (!contractStartDate instanceof Date) {
    res.status(400).json({ error: 'contractStartDate must be a date' })
  } else if (!contractStartDate instanceof Date) {
    res.status(400).json({ error: 'contractEndDate must be a date' })
  } else if (!_.contains(['Running', 'Stopped'], status)) {
    res.status(400).json({ error: 'status must be a either Running or Stopped' })
  }

  const params = {
    TableName: EQUIPMENT_TABLE,
    Item: {
      equipmentNumber: equipmentNumber,
      address: address,
      contractStartDate: contractStartDate,
      contractEndDate: contractEndDate,
      status: status
    }
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not create equipment' })
    }
    res.json({ equipmentNumber })
  })
})

export const handler = serverless(app)
