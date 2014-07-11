export function capitalize( item ) {
    return item.charAt( 0 ).toUpperCase() + item.substring( 1 ).toLowerCase();
}

export function format( item ) {
    return interpolate( item, Array.prototype.slice.call( arguments, 1 ) );
}

export function guid() { // credit for guid goes here: gist.github.com/2295777
    return tpl_guid.replace( re_guid, guid_replace );
}

export function hyphenate( item ) {
    return splitString( item ).join( '-' ).toLowerCase();
}

export function id( item, prefix ) {
    return item ? 'id' in Object( item ) && item.id ? item.id : ( item.id = id_create( prefix ) ) : id_create( prefix );
}

export function interpolate( str, o, pattern ) {
    return String( str ).replace( ( pattern || re_interpolate ), function ( m, p ) {
        return p in o ? o[p] : '';
    } );
}

export function pad( num, len, radix ) {
    var s = Number( num ).toString( radix || 10 );
    var i = -1;
    var l = len - s.length;

    while ( ++i < l ) {
        s = '0' + s;
    }

    return s;
}
export function splitString( s ) {
    s = s.trim();

    var s0 = s.charAt( 0 ), s1 = s.charAt( 1 );
    var i = s0.toLowerCase() == s0 && s1 != ' ' && s1.toUpperCase() == s1 ? 2 : 1;
    var o = s.substring( i ).replace( re_caps, _splitString ).split( re_split_string );

    o[0] = s.substring( 0, i ) + o[0];

    return o;
}

export function space( item ) {
    return splitString( item ).join( ' ' );
}

export function toCamelCase( item ) {
    var parts = splitString( item );

    return parts.reduce( function ( res, val ) {
        res.push( capitalize( val ) );
        return res;
    }, [parts.shift()] ).join( '' );
}

export function underscore( item ) {
    return splitString( item ).join( '_' ).toLowerCase();
}

var uid_count = 999;
var uid_prefix = 'anon';
var re_caps = /([A-Z])/g;
var re_guid = /[xy]/g;
var re_interpolate = /\$?\{([^\}'"]+)\}/g;
var re_split_string = /[\sA-Z_-]+/g;
var tpl_guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

function guid_replace( match ) {
    var num = ( Math.random() * 16 ) | 0;
    return ( match == 'x' ? num : ( num & 0x3 | 0x8 ) ).toString( 16 );
}

function id_create( prefix ) {
    return ( prefix || uid_prefix ) + '-' + ( ++uid_count );
}

// so we don't lose any chars on split
function _splitString( m, p ) { return p + p.toLowerCase(); }

