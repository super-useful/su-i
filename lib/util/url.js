import { __global__, __document__ } from '../globals';
import { coerce, empty } from './value';

import { Hash, History } from '../ua/history';

// pathToRegExp is a straight out rip off of:
// https://github.com/component/path-to-regexp
export function pathToRegExp( path, keys = [], options = {} ) {
    var sensitive = options.sensitive;
    var strict = options.strict;

    if ( path instanceof RegExp ) {
        return path;
    }
    if ( path instanceof Array ) {
        path = '(' + path.join( '|' ) + ')';
    }

    path = path.concat( strict ? '' : '/?' )
        .replace( /\/\(/g, '(?:/' )
        .replace( /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function ( _, slash, format, key, capture, optional, star ) {
            keys.push( { name : key, optional : !!optional } );

            slash = slash || '';

            return ''
                + ( optional ? '' : slash )
                + '(?:'
                + ( optional ? slash : '' )
                + ( format || '' ) + ( capture || ( format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + ( optional || '' )
                + ( star ? '(/*)?' : '' );
        } )
        .replace( /([\/.])/g, '\\$1' )
        .replace( /\*/g, '(.*)' );

    return new RegExp( '^' + path + '$', sensitive ? '' : 'i' );
}

export function resolveUrl( url ) {
    return ( '__karma__' in __global__ ? '/base' : '' ) + url;
}

export function toQueryParams( query ) {
    if ( typeof query !== 'string' ) {
        return {};
    }

    if ( query.indexOf( History.queryMarker ) === 0 || query.indexOf( Hash.queryMarker ) === 0 ) {
        query = query.substring( 1 );
    }

    return query.split( '&' ).reduce( function ( params, val ) {
        val = val.split( '=' );

        var key = decodeURI( val[0] );

        val = coerce( decodeURI( val[1] ) );

        if ( key in params ) {
            if ( !Array.isArray( params[key] ) ) {
                params[key] = [params[key]];
            }

            params[key].push( val );
        }
        else {
            params[key] = val;
        }

        return params;
    }, {} );
}

export function toQueryString( params ) {
    var type = typeof params;

    if ( !params || type !== 'object' ) {
        return type === 'string'
            ? params.indexOf( History.queryMarker ) === 0 || params.indexOf( Hash.queryMarker ) === 0
            ? params.substring( 1 )
            : params
            : '';
    }

    return Object.keys( params ).reduce( function ( qs, key ) {
        if ( empty( params[key] ) ) {
            return qs;
        }

        var qk = '&' + encodeURI( key ) + '=';

        return qs + qk + ( Array.isArray( params[key] )
            ? params[key].map( encodeURI ).join( qk )
            : encodeURI( params[key] ) );
    }, '' ).substring( 1 );
}
