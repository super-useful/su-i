import { copy } from '../util/copy';

import '../core/Interactive';

export class AbstractProxy extends Interactive {
    constructor( config ) {
        super( config );
    }

// public methods
    load( ...args ) {
        args.unshift( 'before:load' );

        if ( this.interactive() && this.broadcast.apply( this, args ) !== false ) {
            args.shift();

            this.onLoadStart.apply( this, args );
        }

        return this;
    }

// stub methods
    onLoad( ...args ) {
        args.unshift( 'load' );

        this.broadcast.apply( this, args );

        return this;
    }

    onLoadStart( data ) {
        return this.onLoad( this.prepareData( data ) );
    }

    prepareData( data ) {
        return copy( data || {}, this.defaults.data, true );
    }

// internal methods
    initDefaults() {
        this.disabled = false;

        var defaults = this.defaults;

        if ( !defaults ) {
            this.defaults = {};
        }
        else if ( typeof defaults !== 'object' || !( 'data' in defaults ) ) {
            this.defaults = { data : defaults };
        }
    }
}
