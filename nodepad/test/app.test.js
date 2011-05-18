
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app')
  , assert = require('assert');


module.exports = {
  'test that we get a 200 response from nodepad path': function(){
    assert.response(app,
      { url: '/' },
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res){
      });
  }
};
