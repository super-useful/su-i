export class Callback {
    constructor( fn, config ) {
        if ( typeof fn == 'function' ) {
            this.fn = fn;
        }
        else {
            this.fn = noop;
        }

        this.buffer = 0;
        this.delay = 0;
        this.single = false;
        this.disabled = false;
        this.fired = 0;

        if ( config && typeof config == 'object' ) {
            this.args = Array.isArray( config.args ) ? config.args : null;
            this.ctx = config.ctx || null;
            this.single = !!config.single;

            if ( config.internal === true ) {
                this.internal = true;
            }

            if ( !isNaN( config.buffer ) ) {
                this.buffer = config.buffer;
            }

            if ( !isNaN( config.delay ) ) {
                this.delay = config.delay;
            }
        }

        this.handleEvent_ = this.handleEvent.bind( this );
    }

// public methods
    handleEvent( args ) {
        if ( !Array.isArray( args ) || arguments.length > 1 )
            args = Array.prototype.slice.call( arguments );

        if ( !this.disabled ) {
            !Array.isArray( this.args ) || args.unshift.apply( args, this.args );

            if ( this.buffer > 0 ) {
                this.startBuffer( args );
            }
            else if ( this.delay > 0 ) {
                this.delayId = setTimeout( this.fire.bind( this, args ), this.delay );
            }
            else {
                return this.fire( args );
            }
        }

        return null;
    }

// internal methods
    fire( args ) {
        this.resetDelay();

        if ( this.disabled ) {
            return null;
        }

        ++this.fired;

        if ( this.single && this.fired >= 1 ) {
            this.disabled = true;
        }

        return this.fn.apply( this.ctx, args );
    }

    resetDelay() {
        clearTimeout( this.delayId );

        delete this.delayId;

        return this;
    }

    startBuffer( args ) {
        this.resetDelay().stopBuffer();

        this.bufferId = setTimeout( this.stopBuffer.bind( this, args ), this.buffer );

        return this;
    }

    stopBuffer( args ) {
        clearTimeout( this.bufferId );

        delete this.bufferId;

        if ( Array.isArray( args ) ) {
            if ( this.delay > 0 ) {
                this.delayId = setTimeout( this.fire.bind( this, args ), this.delay );
            }
            else {
                this.fire( args );
            }
        }

        return this;
    }
}

function noop() {}
