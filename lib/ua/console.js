import { __global__, __document__ } from '../globals';

export var console = Object.create( null );

var methods = 'log debug info warn error assert clear dir dirxml trace group groupCollapsed groupEnd time timeEnd timeStamp profile profileEnd count exception table'.split();

methods.forEach( method => console[method] = noop );

if ( typeof __global__.console === 'undefined' ) {
    __global__.console = console;
}

function noop() {}
