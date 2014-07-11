import { __global__, __document__ } from '../globals';

export var isPlainObject = typeof Object.getPrototypeOf !== 'function' && typeof jQuery !== 'undefined'
                         ? $.isPlainObject
                         : function ( item ) {
                             if ( item === UNDEF || item === null || typeof item !== 'object' ) {
                                 return false;
                             }

                             var proto = Object.getPrototypeOf( item );

                             return !!( proto === null || proto.constructor === Object );
                         };

export function type( item ) {
    if ( !item ) {
        return typeOf( item );
    }

    if ( item === __global__ ) {
        return 'global'; // this fixes various issues with msie and android
    }

    var ctor = item.constructor, ctype;
    var ntype = typeOf( item );
    var dtype = ntype === 'object' && use_old_dom
              ? dom_type_old( item )
              : dom_type( ntype );

    if ( dtype ) {
        return dtype;
    }

    if ( ntype == 'object' ) {
        if ( ctor && ctor !== Object ) {
            ctype = object_type( ctor );

            return ctype;
        }
    }

    return ntype;
}

export function typeOf( item ) {
    var typeOf = Object.prototype.toString.call( item );

// these two added in for older MSIEs :(
    if ( item === null ) {
        return 'null';
    }
    if ( item === UNDEF ) {
        return 'undefined';
    }

    return ntype_cache[typeOf]
        || ( ntype_cache[typeOf] = typeOf.replace( re_tostr, '$1' ).toLowerCase() );
}

var UNDEF;
var ntype_cache = [
    'Array', 'Boolean', 'Date', 'Function',
    'Number', 'Object', 'RegExp', 'String',
    'Null', 'Undefined'].reduce( function ( cache, type ) {
        cache['[object ' + type + ']'] = type.toLowerCase();

        return cache;
    }, Object.create( null ) );
var re_name = /[\s\(]*function([^\(]+).*/;
var re_tostr = /^\[object (?:[Ww]eb[Kk]it|[Mm]oz|[Mm]s|[Kk]html){0,1}([^\]]+)\]$/;
var use_old_dom = Object.prototype.toString.call( __document__.createElement( 'div' ) ).toLowerCase() !== '[object htmldivelement]';

function dom_type( dtype ) {
    if ( !!~dtype.indexOf( 'document' ) ) {
        return 'htmldocument';
    }
    if ( dtype == 'htmlcollection' || dtype == 'nodelist' ) {
        return 'htmlcollection';
    }
    if ( !dtype.indexOf( 'htm' ) && ( dtype.lastIndexOf( 'element' ) + 7 === dtype.length ) ) {
        return 'htmlelement';
    }
    if ( !dtype.indexOf( 'svg' ) && ( dtype.lastIndexOf( 'element' ) + 7 === dtype.length ) ) {
        return 'svgelement';
    }
}

function dom_type_old( item ) {
    switch ( item.nodeType ) {
        case 1 :
            return 'htmlelement';
        case 3 :
            return 'text';
        case 9 :
            return 'htmldocument';
    }

    return 'length' in item && typeof item.item === 'function'
        ? 'htmlcollection'
        : null;
}

function function_name( fn ) {
    return fn.name || fn.displayName || ( String( fn ).match( re_name ) || ['', ''] )[1].trim();
}

function object_type( fn ) {
    var func = fn.valueOf();
    var type = fn.__classname__ || func.__classname__ || String( function_name( fn === func ? fn : func ) ).toLowerCase();

    return !type || type == 'anonymous' || type == 'function' ? 'object' : type;
}
