import './Observer';

export class Interactive extends Observer {
    constructor( config ) {
        super( config );
    }

// public methods
    disable() {
        if ( this.disabled !== true && this.broadcast( 'before:disable' ) !== false ) {
            var p = new Promise( this.onDisable_ );

            p.then( this.afterDisable_ );
        }

        return this;
    }

    enable() {
        if ( this.disabled !== false && this.broadcast( 'before:enable' ) !== false ) {
            var p = new Promise( this.onEnable_ );

            p.then( this.afterEnable_ );
        }

        return this;
    }

    interactive() {
        return !( this.disabled || this.destroyed || this.destroying );
    }

    ready() {
        return !( this.destroyed || this.destroying );
    }

// stub methods
    afterDisable() {
        this.broadcast( 'disable' );
    }

    afterEnable() {
        this.broadcast( 'enable' );
    }

    onDisable( resolve, reject ) {
        this.disabled = true;

        resolve();
    }

    onEnable( resolve, reject ) {
        this.enabled = true;

        resolve();
    }

// internal methods
    initDefaults() {
        super.initDefaults();

        this.disabled = false;

        this.afterDisable_ = this.afterDisable.bind( this );
        this.afterEnable_ = this.afterEnable.bind( this );
        this.onDisable_ = this.onDisable.bind( this );
        this.onEnable_ = this.onEnable.bind( this );
    }
}
