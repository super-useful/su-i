import { copy, update } from '../util/copy';
import { invoke } from '../util/iter';
import { typeOf } from '../util/type';
import { assign, exists, value } from '../util/value';

import './DATA_TYPE';
import './FORMAT_AS';
import './TYPE_DEFAULTS';
import './VALIDATE';

export class Property {
    constructor( config ) {
        this.type = 'object';

        copy( this, config );

        this.init();

        this.initType( this.type );

        this.initFormat( this.format );
    }

    coerce( val, raw, data ) {
        return this.applyFormat( this, val, this.format, raw, data );
    }

    process( raw, data ) {
        var raw_value = this.value( raw, data );
        var val = this.coerce( raw_value, raw, data );

        return this.assign( val, data );
    }

    toJSON( val ) {
        return val;
    }

    transform( val, raw, data ) {
        return val;
    }

    valid( val ) {
        return val !== null && val !== UNDEF;
    }

    value( raw, data ) {
        var val = this.transform( value( raw, this.cite ), raw, data );

        return val === this ? UNDEF : val;
    }

// internal methods
    assign( val, data ) {
        if ( this.strict === true || this.valid( val ) ) {
            assign( data, this.id, val );
        }

        return data;
    }

// constructor methods
    init() {
        if ( !exists( this.cite ) && this.id ) {
            this.cite = this.id;
        }
        if ( !exists( this.id ) && this.cite ) {
            this.id = this.cite;
        }
    }

    initFormat( format ) {
        var format_type = typeOf( format ).toUpperCase();

        this.applyFormat = FORMAT_AS[format_type] || FORMAT_AS.DEFAULT;
    }

    initType( type ) {
        if ( type ) {
            switch ( typeof type ) {
                case 'string'   :
                    type = type.toLowerCase();

                    if ( type in DATA_TYPE ) {
                        this.type = DATA_TYPE[type];

                        if ( type in TYPE_DEFAULTS ) {
                            update( this, TYPE_DEFAULTS[type] );

                            if ( typeof TYPE_DEFAULTS[type].toJSON === 'function' ) {
                                this.toJSON = TYPE_DEFAULTS[type].toJSON;
                            }
                        }

                        if ( typeof VALIDATION[type] === 'function' ) {
                            this.valid = VALIDATION[type];
                        }
                    }

                    break;
                case 'function' :
                    this.type = type;

                    break;

            }
        }

        if ( typeof this.type != 'function' ) {
            throw new TypeError( 'schema.Property', 'Invalid `type` specified.' );
        }
    }
}

var UNDEF;
