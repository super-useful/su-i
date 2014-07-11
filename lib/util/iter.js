import { isPlainObject, typeOf } from './type';
import { coerce, empty, exists } from './value';

export function aggregate( items, accumulator, iterator, ctx ) {
    if ( typeof iterator !== 'function' ) {
        if ( typeof accumulator === 'function' ) {
            ctx = iterator;
            iterator = accumulator;
            accumulator = [];
        }
        else {
            iterator = k;
        }
    }

    items = Object( items );
    ctx = ctx || items;

    var i, l;

    if ( 'length' in items && !isNaN( items.length ) ) {
        i = -1;
        l = items.length;

        while ( ++i < l ) {
            accumulator = iterator.call( ctx, accumulator, items[i], i, items );
        }
    }
    else for ( i in items ) {
        if ( Object.prototype.hasOwnProperty.call( items, i ) ) {
            accumulator = iterator.call( ctx, accumulator, items[i], i, items );
        }
    }

    return accumulator;
}

export function clean( item, remove_empty = false ) {
    if ( !item ) {
        return item;
    }

    var i, l;

    if ( 'length' in item && !isNaN( item.length ) ) {
        i = -1;
        l = item.length;

        while ( ++i < l ) {
            if ( ( remove_empty === true && empty( item[i] ) ) || !exists( item[i] ) ) {
                item.splice( i, 1 );

                return clean( item, remove_empty );
            }
        }
    }
    else if ( isPlainObject( item ) ) {
        for ( i in item ) {
            if ( Object.prototype.hasOwnProperty.call( item, i ) ) {
                if ( ( remove_empty === true && empty( item[i] ) ) || !exists( item[i] ) )
                    delete item[i];
            }
        }
    }

    return item;
}

export function equal( a, b ) {
    switch ( Object.prototype.toString.call( a ) ) {
        case '[object Array]'  :
            return Array.isArray( b )
                ? equal_array( a, b )
                : false;

        case '[object Object]' :
            return Object.prototype.toString.call( b ) == '[object Object]'
                ? equal_object( a, b )
                : false;

        case '[object Date]'   :
            return +a == +b;
    }

    return a == b;
}

export function first( items, iterator, ctx ) {
    if ( typeof iterator !== 'function' ) {
        iterator = k;
    }

    items = Object( items );
    ctx = ctx || items;

    var i, l;

    if ( 'length' in items && !isNaN( items.length ) ) {
        i = -1;
        l = items.length;

        while ( ++i < l ) {
            if ( iterator.call( ctx, items[i], i, items ) ) {
                return items[i];
            }
        }
    }
    else for ( i in items ) {
        if ( Object.prototype.hasOwnProperty.call( items, i ) && iterator.call( ctx, items[i], i, items ) ) {
            return items[i];
        }
    }

    return null;
}

export function iter( item ) {
    return !!( ( item || typeof item === 'string' ) && ( 'length' in Object( item ) || typeof item === 'object' ) );
}

export function invoke( items, method ) {
    var args = Array.prototype.slice.call( arguments, 2 );
    var i = -1;
    var l = Array.isArray( items ) ? items.length : 0;
    var res = [];

    while ( ++i < l ) {
        if ( typeof items[i][method] === 'function' ) {
            res.push( items[i][method].apply( items[i], args ) );
        }
    }

    return res;
}

export function k( item ) {
    return item;
}

export function len( item ) {
    return ( 'length' in ( item = Object( item ) ) ? item : Object.keys( item ) ).length;
}

export function pluck( items, key, only_existing = false ) {
    var i = -1;
    var l = Array.isArray( items ) ? items.length : 0;
    var res = [];
    var val;

    if ( key.indexOf( '.' ) > -1 )
        return key.split( '.' ).reduce( function ( v, k ) {
            return pluck( v, k, only_existing );
        }, items );

    while ( ++i < l ) {
        val = key in Object( items[i] ) ? items[i][key] : UNDEF;

        if ( only_existing !== true || ( val !== null && val !== UNDEF ) ) {
            res.push( val );
        }
    }

    return res;
}

export function range( i, j ) {
    return isNaN( i ) ? range_str( i, j ) : range_num( i, j );
}

export function remove( item, keys ) {
    keys = Array.isArray( keys ) ? keys : Array.prototype.slice.call( arguments, 1 );

    var remove_type = Array.isArray( item ) ? remove_array : remove_object;

    if ( keys.length == 1 ) {
        remove_type.call( item, keys[0] );
    }
    else {
        keys.forEach( remove_type, item );
    }

    return item;
}

export function sum( items ) {
    return items.reduce( function ( val, n ) {
        return !isNaN( n = parseFloat( n ) ) ? val + n : val;
    }, 0 );
}

export function values( items ) {
    var id, res;

    switch ( typeOf( items ) ) {
        case 'array'  :
            return items;
        case 'object' :
            res = [];

            for ( id in items ) {
                if ( Object.prototype.hasOwnProperty.call( items, id ) ) {
                    res.push( items[id] );
                }
            }

            return res;
    }

    return [];
}

var UNDEF;

function equal_array( a, b ) {
    return a.length === b.length
        && Array.prototype.slice.call( a ).every( function ( v, i ) {
            return equal( b[i], v );
        } );
}

function equal_object( a, b ) {
    if ( len( a ) !== len( b ) || Object.getOwnPropertyNames( a ).length !== Object.getOwnPropertyNames( b ).length ) {
        return false;
    }

    for ( var k in b ) {// noinspection JSUnfilteredForInLoop
        if ( Object.prototype.hasOwnProperty.call( a, k ) !== Object.prototype.hasOwnProperty.call( b, k ) || !equal( a[k], b[k] ) ) {
            return false;
        }
    }

    return true;
}

function range_num( i, j ) {
    var a = [i];

    while ( ++i <= j ) {
        a.push( i );
    }

    return a;
}

function range_str( i, j ) {
    i = String( i ).charCodeAt( 0 );
    j = String( j ).charCodeAt( 0 );

    var a = [];
    var m = -1;
    var n = Math.abs( i - j );

    --i;

    while ( ++m <= n ) {
        a.push( String.fromCharCode( ++i ) );
    }

    return a;
}

function remove_array( val ) {
    var i = this.indexOf( val );

    i = !!~i
      ? i
      : !isNaN( val = parseInt( val, 10 ) ) && val in this
      ? val
      : i;

    if ( !!~i ) {
        this.splice( i, 1 );
    }
}

function remove_object( key ) {
    delete this[key];
}
