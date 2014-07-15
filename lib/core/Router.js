import { __global__ } from '../globals';

import { API, Hash } from '../ua/history';

import { copy } from '../util/copy';
import { typeOf } from '../util/type';
import { pathToRegExp, toQueryParams, toQueryString } from '../util/url';
import { empty } from '../util/value';

import './Interactive';

export class Router extends Interactive {
    constructor( config ) {
        super( config );

        var routes = this.routes;

        this.routes = [];

        if ( Array.isArray( routes ) ) {
            routes.forEach( this.add, this );
        }

        $( __global__ ).on( API.event, this.onStateChange_ );
    }

// public methods
    add( route ) {
        if ( !Array.isArray( route.keys ) ) {
            route.keys = [];
        }

        if ( typeof route.regexp === 'string' ) {
            route.regexp = new RegExp( route.regexp, 'i' );
        }

        if ( typeof route.path === 'string' ) {
            if ( !route.regexp || type.typeOf( route.regexp ) !== 'regexp' ) {
                route.regexp = pathToRegExp( route.path, route.keys );
            }

            this.routes.push( route );

            this.broadcast( 'add' );
        }
    }

    back( replace ) {
        if ( this.history.length ) {
            if ( replace === true ) {
                alert( 'replace with: ' + this.history[0] );
                __global__.location.replace( this.history.shift() );
            }
            else {
                __global__.location.href = this.history.shift();
            }
        }
        else {
            __global__.history.back();
        }
    }

    basePathAdd( path ) {
        return path.indexOf( this.basePath ) === 0 ? path : this.basePath + path;
    }

    basePathRemove( path ) {
        if ( this.basePath !== '/' && path.indexOf( this.basePath ) === 0 ) {
            path = path.substring( this.basePath.length );
        }

        return path;
    }

    current() {
        var path = this.basePathRemove( API.path() || this.defaultRoute );
        var query = API.query() || null;

        return {
            path : ( !path || path === '/' ? this.defaultRoute : path ),
            query : query ? toQueryParams( query ) : query
        };
    }

    currentState() {
        var state = this.current(), tid;

        this.routes.some( function ( route ) {
            var match = state.path.match( route.regexp );

            if ( match ) {
                state.params = this.resolveState( state, route.keys, match );

                for ( var prop in route ) {
                    if ( !( prop in exclude_props ) && Object.prototype.hasOwnProperty.call( route, prop ) ) {
                        state[prop] = route[prop];
                    }
                }

                state._matched = true;

                return true;
            }

            return false;

        }, this );

        if ( !state._matched ) {
            state.path = '/';

            tid = setTimeout( function () {
                clearTimeout( tid );

                tid = null;

                this.replace( '/' );
            }.bind( this ), 10 );
        }

        delete state._matched;

        return state;
    }

    replace( route, title, data ) {
        API.replace.call( this, data, title, this.resolveUrl( route ) );

        this.broadcast( 'replace', route, title, data );

        var evt = new $.Event( {
            type : 'popstate',
            state : data
        } );

        this.onStateChange( evt );
    }

    resolveState( current, keys, parts ) {
        var params = {};

        if ( Array.isArray( parts ) ) {
            //	we aren't interested in the first one
            parts.shift();

            keys.reduce( function ( val, key ) {
                val[key.name] = parts.shift();

                return val;
            }, params );

            return params;
        }

        return empty( params ) ? null : params;
    }

    resolveUrl( uri, relative ) {
        var path = relative === true ? API.path() : this.defaultRoute;

        if ( !uri ) {
            uri = path;
        }

        if ( typeof uri === 'object' ) {
            uri = ( uri.path || path )
                + ( uri.query
                    ? API.queryMarker + toQueryString( uri.query )
                    : '' );
        }

        uri = this.basePathAdd( String( uri ) );

        return uri.replace( re_double_slash, '/' );
    }

    update( route, title, data ) {
        var url = this.resolveUrl( route );

        this.history.unshift( __global__.location.href );

        if ( this.history > 3 ) {
            this.history.pop();
        }

        API.push.call( this, data, title, url );

        this.broadcast( 'update', route, title, data );

        var evt = new $.Event( {
            type : 'popstate',
            state : data
        } );

        this.onStateChange( evt );
    }
// internal methods
    initDefaults() {
        super.initDefaults();

        this.basePath = '/';
        this.defaultRoute = '/';
        this.ready = false;
        this.suspendChange = 0;

        if ( API === Hash ) {
            this.basePath = '/';
        }

        this.history = [];

        this.onStateChange_ = this.onStateChange.bind( this );
    }

    handleWeirdPopState() {
        if ( this.ready !== true ) {
            this.ready = true;

            return true;
        }

        if ( $.isReady !== true ) {
            this.skipNext = true;
        }
        else if ( this.skipNext === true ) {
            delete this.skipNext;

            return true;
        }

        return false;
    }

    onStateChange( evt ) {
        if ( this.handleWeirdPopState() || this.suspendChange ) {
            return;
        }

        var current = this.currentState();

        this.broadcast( 'change:state', current );
    }
}

var exclude_props = {
    cb : true,
    ctx : true,
    keys : true,
    path : true,
    regexp : true
};
var re_double_slash = /\/\//g;
var re_route_path = /\/:[^\/\?]+\??/g;
