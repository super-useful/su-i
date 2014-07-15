import { __global__ } from '../globals';

import { copy } from '../util/copy';
import { typeOf } from '../util/type';
import { toQueryParams, toQueryString } from '../util/url';

import { AjaxProxy } from './Ajax';

class EndpointProxy extends AjaxProxy {
    constructor( config ) {
        super( config );
    }

    doRequest( url, method, target, data ) {
        method = String( target.method ).toUpperCase();

        if ( method !== 'POST' && method !== 'PUT' ) {
            data = null;
        }

        this.lastOptions = this.initTransport( url, method, data, [target] );

        return this.send( this.lastOptions );
    }

    onLoadStart( params, target, coerce ) {
        var method = this.resolveMethod( target.method );
        var url = target.createURL( params, coerce === true );

        this.doRequest( this.endpoint.basePath + url, method, target, params );
    }
}
