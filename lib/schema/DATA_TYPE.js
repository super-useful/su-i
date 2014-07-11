import { merge } from '../util/copy';
//import { format } from '../util/string';
import { typeOf } from '../util/type';
import { exists } from '../util/value';

import './DateParser';

export function array( v ) {
    if ( this.schema ) {
        return this.schema.coerce( v ).items || [];
    }

    if ( v === null || v === UNDEF ) {
        v = Array.isArray( this['default'] ) ? merge( [], this['default'] ) : [];
    }
    else if ( Array.isArray( v ) || ( typeof v == 'object' && 'length' in v ) ) {
        v = Array.prototype.slice.call( v );
    }
    else {
        v = [v];
    }

    v = Array.isArray( v ) ? v : exists( v ) ? Array.prototype.slice.call( v ) : [];

    if ( is_num( this.max ) && v.length > this.max ) {
        v.length = this.max;
    }

    return v;
}

export function boolean( v ) {
    if ( v === null || v === UNDEF ) {
        return typeof this['default'] == 'boolean' ? this['default'] : false;
    }

    if ( typeof v != 'boolean' ) {
        v = re_falsey.test( v ) ? false : typeof this['default'] == 'boolean' ? this['default'] : !!v;
    }

    return v;
}

export function date( v, format ) {
    var date = is_num( v ) ? new Date( v ) : v;
    var max = +this.max;
    var min = +this.min;

    if ( typeOf( v ) != 'date' ) {
        if ( !format ) {
            format = this.format;
        }

        if ( v === null || v === UNDEF ) {
            date = NaN;
        }
        else {
            switch ( typeof format ) {
                case 'string'   :
                    date = DateParser.coerce( v, format );
                    break;
                case 'function' :
                    date = format( v );
                    break;
                default         :
                    date = new Date( v );
            }
        }
    }

    date = !is_num( +date ) ? this['default'] == 'now' ? new Date() : new Date( +this['default'] ) : date;
    v = +date;

    if ( min && is_num( min ) && v < min )
        date = DateParser.clone( this.min );

    if ( max && is_num( max ) && v > max )
        date = DateParser.clone( this.max );

    return date;
}

export function number( v ) {
    v = Number( v ) == v ? Number( v ) : this['default'];

    var max = this.max,
        min = this.min;

    if ( is_num( min ) && v < min )
        v = +min;

    if ( is_num( max ) && v > max )
        v = +max;

    return v;
}

export function object( v ) {
    if ( this.schema )
        return this.schema.coerceItem( v );

    return v === UNDEF ? this['default'] : v;
}

export function string( v ) {
    v = String( v ) == v ? String( v ) : this['default'];

    if ( is_num( this.max ) && v.length > this.max )
        v = v.substring( 0, this.max );

    return v;
}

array.id = 'array';
boolean.id = 'boolean';
date.id = 'date';
number.id = 'number';
object.id = 'object';
string.id = 'string';

var UNDEF;
var re_falsey = /^false|0$/;

function is_num( item ) {
    return typeof item == 'number' && !isNaN( item );
}

