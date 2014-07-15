import { merge } from '../util/copy';

export class Configurable {
    constructor( config ) {
        config = Configurable.initConfig( config );

        this.initDefaults();

        this.applyConfig( config );
    }

// internal methods
    applyConfig( config ) {
        for ( var option in config ) {
            if ( Object.prototype.hasOwnProperty.call( config, option ) ) {
                this[option] = config[option];
            }
        }

        // apply the Config configuration to the instance
        this.__config__ = config;
    }

    cloneConfig() {
        return merge( Object.create( null ), this.__config__ );
    }

    initConfig( config ) {
        if ( !config || typeof config !== 'object' ) {
            config = Object.create( null );
        }

        return config;
    }

    initDefaults() {
    }
}
