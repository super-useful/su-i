import { __global__ } from '../globals';

export function assign( item, key, value ) {
    var prop = key;

    if ( item !== null && item !== UNDEF ) {
        key = String( key );

        if ( !!~key.indexOf( '.' ) ) {
            key = key.split( '.' );
            prop = key.pop();
            item = bless( key, item );
        }

        item[prop] = value;

// we're using == instead of ===
// because html attributes may coerce the value into a string when it is assigned, this is fine.
        if ( item[prop] != value ) {
            if ( typeof item.set == 'function' ) {
                item.set( prop, value );
            }
            else if ( typeof item.setAttribute == 'function' ) {
                item.setAttribute( prop, value );
            }
        }
    }

    return value;
}

export function bless( ns, ctx = __global__ ) {
    if ( !Array.isArray( ns ) ) {
        if ( typeof ns == 'string' ) {
            ns = ns.split( '.' );
        }
        else {
            return bless_ctx( ctx );
        }
    }

    if ( !ns.length ) {
        return bless_ctx( ctx );
    }

    ctx = bless_ctx( ctx );

    var o;

    while ( o = ns.shift() ) {
        ctx = ctx[o] || ( ctx[o] = Object.create( null ) );
    }

    return ctx;
}

export function coerce( item ) {
    var num = Number( item ), str;

    return typeof item === 'boolean'
        ? item
        : !isNaN( num )
        ? num
        : ( str = String( item ) ) in force
        ? force[str]
        : item;
}

export function empty( item ) {
    if ( !exists( item ) )
        return true;

    var len, type = typeof item;

    if ( type === 'object' ) {
        if ( 'length' in item && typeof ( len = item.length ) === 'number' ) {
            return !len;
        }

// todo: add this in when we want to support Set and Map
//			if ( 'size' in item && typeof ( len = item.size ) === 'number' )
//				return !len;

        return !Object.keys( item ).length;
    }

    if ( type === 'string' ) {
        return !item.length;
    }

    return false;
}

export function exists( item ) {
    return !( item === null || item === UNDEF || ( typeof item == 'number' && isNaN( item ) ) );
}

export function value( item, key ) {
    var val;

    if ( item === null || item === UNDEF ) {
        return UNDEF;
    }

    if ( typeof item === 'object' && key in item ) {
        return item[key];
    }

    if ( isNaN( +key ) ) {
        if ( !!~key.indexOf( '.' ) ) {
            key = key.split( '.' );

            while ( val = key.shift() ) {
                if ( ( item = value( item, val ) ) === UNDEF ) {
                    break;
                }
            }

            return item;
        }
    }

    return item[key] !== UNDEF
        ? item[key] : typeof item.get == 'function'
        ? item.get( key ) : typeof item.getAttribute == 'function'
        ? item.getAttribute( key ) : UNDEF;
}

var UNDEF;
var ENV = typeof navigator != 'undefined' ? 'browser' : typeof require == 'function' ? 'commonjs' : 'other';
var force = [false, NaN, null, true, UNDEF].reduce( function ( res, val ) {
    res[String( val )] = val;

    return res;
}, Object.create( null ) );
