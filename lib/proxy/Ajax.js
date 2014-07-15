import { __global__ } from '../globals';

import { copy } from '../util/copy';
import { typeOf } from '../util/type';
import { toQueryParams, toQueryString } from '../util/url';

import './AbstractProxy';

export class AjaxProxy extends AbstractProxy {
    constructor( config ) {
        super( config );

        this.init();
    }

// public methods
    abort( silent ) {
        if ( transport.abort( this.current ) ) {
            this.onAbort( silent );

            delete this.current;
        }

        return this;
    }

    reload() {
        if ( this.lastOptions && this.interactive() && this.broadcast( 'before:reload' ) !== false ) {
            var request = this.lastOptions;
            var proxy = request.proxy;

            this.doRequest( proxy.data, request.method, proxy.args );
        }

        return this;
    }

    send() {
        this.clearSlow();

        this.current = transport.send( this.lastOptions );

        this.slowId = setTimeout( this.onSlow_, this.slow );

        this.broadcast( 'load:start', this.current );

        return this.current;
    }

// stub methods
    createUrl( params, method ) {
        method = method || this.method;

        var qs = toQueryString( params );

        return this.urlBase + ( method === 'GET' && qs ? '?' + qs : '' );
    }

    onAbort( silent ) {
        this.clearSlow();

        if ( silent !== true ) {
            this.broadcast( 'abort', this.current );
        }
    }

    onBeforeLoad() {
        !this.current || this.abort( true );
    }

    onError( ...args ) {
        this.clearSlow();

        args.unshift( 'error' );

        this.broadcast.apply( this, args );

        return this;
    }

    onLoad() {
        this.clearSlow();

        super.onLoad.apply( this, arguments );
    }

    onLoadStart( data, method, args ) {
        if ( Array.isArray( method ) ) {
            args = method;
        }

        method = this.resolveMethod( method );

        this.doRequest( data, method, args );
    }

    onSlow() {
        this.broadcast( 'slow' );
    }

// internal methods

    clearSlow() {
        if ( this.slowId ) {
            clearTimeout( this.slowId );

            delete this.slowId;
        }
    }

    doRequest( data, method, args ) {
        var uri = this.createUrl( data, method );

        this.lastOptions = this.initTransport( uri, method, data, args );

        return this.send( this.lastOptions );
    }

    removeTransport() {
        !this.current || delete this.current;
    }

    resolveMethod( method ) {
        if ( !method || typeof method != 'string' ) {
            method = this.method || 'GET';
        }

        return method.toUpperCase();
    }

    init() {
        var cleanups = ['onBeforeLoad', 'removeTransport'];

        this.initHeaders();

        if ( !this.gase && this.url ) {
            this.urlBase = this.url;
        }

        this.observe( {
            abort : 'removeTransport',
            'before:load' : cleanups,
            'before:reload' : cleanups,
            error : 'removeTransport',
            load : 'removeTransport',
            ctx : this
        } );
    }

    initDefaults() {
        super.initDefaults();

        this.method = 'GET';
        this.slow = 5000;
        this.timeout = 20000;
        this.urlBase = null;

        this.current = null;
        this.lastOptions = null;
        this.slowId = null;

        this.onSlow_ = this.onSlow.bind( this );
    }

    initHeaders() {
        var defaults = this.defaults;

        if ( !defaults.headers || typeof defaults.headers !== 'object' ) {
            defaults.headers = {};
        }

        if ( type.typeOf( this.headers ) === 'object' ) {
            copy( defaults.headers, this.headers );

            delete this.headers;
        }

        if ( typeof this.CSRFToken === 'string' ) {
            defaults.headers['X-CSRF-Token'] = this.CSRFToken;

            delete this.CSRFToken;
        }
    }

    initTransport( uri, method, data, args ) {
        var request = {
            headers : this.defaults.headers,
            method : method || this.method,
            proxy : {
                args : Array.isArray( args ) ? args : [],
                ctx : this,
                data : data,
                error : this.onError,
                success : this.onLoad
            },
            timeout : this.timeout,
            url : uri
        };

// if not a put or a post your createURL over-write should turn data into query string params
        if ( method === 'POST' || method === 'PUT' ) {
            request.data = data;
        }

        return transport.init( request );
    }
}
