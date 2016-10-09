let chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  should = chai.should();

const fs = require('fs');

chai.use(chaiHttp);

describe('File Upload', () => {
  let server;

  //pre/post startup and teardown of server
  beforeEach(() => server = require('../server.js'));

  it('should respond to GET /api/ with hello', (done) => {
    chai.request(server)
      .get('/api/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});