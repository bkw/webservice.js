var vows       = require('vows'),
    assert     = require('assert'),
    request    = require('request'),
    webservice = require('../lib/webservice'),
    demoModule = require('../examples/demoModule'),
    fs         = require('fs'),
    sys        = require('sys'),
    eyes       = require('eyes');

var port = 8082,
    host  = 'http://localhost';

var ws = webservice.createServer(demoModule);
ws.listen(port);

vows.describe('webservice/').addBatch({
  "When using webservice with test configuration": {
    "a request against /": {
      topic: function() {
        var options = {
          uri: host + ':' + port
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "and should return html view representing web-service": function(error, response, body){
        assert.equal (body[0], '<');
      }
    },
    "a GET request against /echo": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/echo',
          method: 'GET'
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      }
    },
    "a GET request against /echo?msg=ohai": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/echo?msg=ohai',
          method: 'GET'
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should respond with ohai": function (error, response, body) {
        assert.equal(body, 'ohai');
      }
    },
    "a GET request against /echo?msg=1": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/echo?msg=1',
          method: 'GET'
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should respond with 1": function (error, response, body) {
        assert.equal(body, '1');
      }
    },
    "a POST request to /echo with JSON": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/echo',
          method: 'POST',
          body: JSON.stringify({msg:"ohai"})
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should respond with ohai": function (error, response, body) {
        assert.equal(body, 'ohai');
      }
    },
    "a POST request to /echo with form data": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/echo',
          method: 'POST',
          body: "msg=ohai&bar=lol"
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should respond with ohai": function (error, response, body) {
        assert.equal(body, 'ohai');
      }
    },
    "a GET request against /ping": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/ping',
          method: 'GET'
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should respond with pong": function (error, response, body) {
        assert.equal(body, 'pong');
      }
    },
    "a POST request against /ping": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/ping',
          method: 'POST'
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should respond with pong": function (error, response, body) {
        assert.equal(body, 'pong');
      }
    },
    "a GET request against /docs": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/docs',
          method: 'GET'
        };
        
        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should return html view representing web-service": function (error, response, body) {
        assert.equal(body[0], '<');
      }
    },
    "a GET request against /docs.json": {
      topic: function() {
        var options = {
          uri: host + ':' + port + '/docs.json',
          method: 'GET'
        };

        request(options, this.callback)
      },
      "should respond with 200": function (error, response, body) {
        assert.equal(response.statusCode, 200);
      },
      "should return JSON representing web-service": function (error, response, body) {
        var json = JSON.parse(body);
        assert.isObject(json);
      }
    }
  }
}).addBatch({
    "when the tests are over": {
      topic: function () {
        return 'you have to kill tests manually, sorry';
      },
      "the web-service server should be killed": function (topic) {
        assert.isTrue(true);
        // TODO : fix api so we can do this
        ws.close();
      }  
    }
}).export(module);