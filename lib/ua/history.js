import { __global__ } from '../globals';

export var Hash = {
    event : 'hashchange',
    prefix : '#',
    queryMarker : '‽',
    property : 'hash',
    get : function () {
        return __global__.location.hash.substring( 1 );
    },
    query : function () {
        var h = __global__.location.hash,
            i = h.indexOf( this.queryMarker );

        return i > -1 ? h.substring( i + 1 ) : '';
    },
    path : function () {
        var path = __global__.location.hash.substring( 1 );
        var index = path.indexOf( this.queryMarker );

        if ( index > -1 ) {
            path = path.substring( 0, index );
        }

        return path;
    },
    push : function ( data, title, route ) {
        __global__.location.hash = Hash.prefix + route;
    },
    replace : function ( data, title, route ) {
        __global__.location.hash = Hash.prefix + route;
    }
};

export var History = {
    event : 'popstate',
    prefix : '',
    queryMarker : '?',
    property : 'pathname',
    get : function () {
        return __global__.location.pathname;
    },
    query : function () {
        return __global__.location.search.substring( 1 );
    },
    path : function () {
        return __global__.location.pathname;
    },
    push : function ( data, title, route ) {
        __global__.history.pushState( data, title, route );
    },
    replace : function ( data, title, route ) {
        __global__.history.replaceState( data, title, route );
    }
};

export var API = typeof __global__.history.pushState == 'function'
               ? History
               : Hash;
