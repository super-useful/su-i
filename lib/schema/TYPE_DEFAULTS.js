import './DateParser';

export var array = {
    min : 0,
    max : Math.pow( 2, 32 ) - 1,
    toJSON : function ( v ) {
        return JSON.stringify( v );
    }
};

export var boolean = {
    "default" : false
};

export var date = {
    "default" : 'now',
    format : 'X',
    toJSON : function ( v ) {
        return v instanceof Date
            ? DateParser.format( v, this.format )
            : v;
    }
};

export var object = {
    toJSON : function ( v ) {
        return JSON.stringify( v );
    }
};

export var number = {
    "default" : NaN,
    max : Number.POSITIVE_INFINITY,
    min : Number.NEGATIVE_INFINITY
};

export var string = {
    "default" : ''
};
