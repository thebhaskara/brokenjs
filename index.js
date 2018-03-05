const _ = require('lodash');
const Merge = require('./src/standalone/merge');
const Model = require('./src/model');

var Comp = Merge(Model, {
    myFunction: ['a', 'b', 'c', function(a, b, c) {
        console.log.apply(null, arguments);
    }]
})

var ins = new Comp();

ins.set('a', 'Example');
ins.set('b', 'for');
ins.set('c', 'injector');

ins.myFunction('is', 'working');

var inst2 = new Comp();

ins.forward(null, 'a', inst2, 'some.a');

inst2.watch('some.a', function(a){
	console.log(a, 'forward seems working');
});

ins.set('a', 'Ohh');