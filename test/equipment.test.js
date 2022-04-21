import chai from 'chai'
import chaiHttp from 'chai-http'
import AWS from 'aws-sdk'
import sinon from 'sinon'
import express from 'express'
import server from '../server.js'

let should = chai.should();
const expect = chai.expect
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
const assert = chai.assert
let fakeData;

const sandbox = sinon.createSandbox();
let dynamoSpy ;
const app = express();

describe('Equipments', () => {
   dynamoSpy = sinon.spy();

  before(() => {
    fakeData = {
      Item: {
        EquipmentNumber: '1232',
        Address: "test",
        contractStartDate: "Tue Apr 19 2022 13:20:00 GMT+0530",
        contractEndDate: "Tue Apr 19 2023 13:20:00 GMT+0530",
        status: "Running"
      }}

    sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({promise: () => {fakeData} });

  });

  after(() => {
    // restore normal function
    //AWSMock.restore('DynamoDB.DocumentClient');
    sandbox.restore();

  });

  
  
  describe('/GET eqipments', () => {
    it('it should GET all the equipments', (done) => {
      chai.request(server)
          .get('/equipment/1232')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            done();
          });
    });
});



})