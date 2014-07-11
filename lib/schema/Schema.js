import { copy, update } from '../util/copy';
import { invoke } from '../util/iter';
import { value } from '../util/value';

import './mappings';
import './FORMAT_AS';
import './TYPE_DEFAULTS';
import './VALIDATE';
import './Property';

export class Schema {
    constructor( config ) {
        initConfig( this, config );

        var {properties, property} = initProperties( this.properties );

        this.coerceRoot = initCoerceRoot( this.coerceRoot );
        this.properties = properties;
        this.property = property;
    }

// public methods
    coerce( raw, loose ) {
        var data = this.prepare( raw );
        var i = -1;
        var l = data.items.length;

        while ( ++i < l ) {
            data.items[i] = this.coerceItem( data.items[i], loose );
        }

        return data;
    }

    coerceItem( raw, loose ) {
        var data = this.createRootItem();
        var property;

        iter.invoke( this.properties, 'process', update( this.getItemRoot( raw ) ), data );

        if ( loose === true ) {
            for ( property in raw ) {
                if ( !( property in data ) && Object.prototype.hasOwnProperty.call( raw, property ) ) {
                    data[property] = raw[property];
                }
            }
        }

        return data;
    }

    getItemRoot( raw ) {
        var item = this.mappings.item;

        return item
            ? value( raw, item ) || raw
            : raw;
    }

    getRoot( raw = [] ) {
        var items = this.mappings.items;
        var raw_items = Array.isArray( raw )
            ? raw
            : items
            ? value( raw, items ) || raw
            : raw;

        return Array.isArray( raw_items )
            ? raw_items.slice()
            : [];
    }

    prepare( raw ) {
        var items;
        var success = false;
        var total = -1;

        if ( raw && typeof raw == 'object' ) {
            items = this.getRoot( raw );

            total = this.mappings.total in raw
                ? raw[this.mappings.total]
                : items.length;

            success = this.mappings.success in raw
                ? raw[this.mappings.success]
                : !!total;
        }
        else {
            items = [];
        }

        return {
            items : items,
            success : success,
            total : total
        };
    }

    function toJSON( data ) {
        var id;
        var prop = this.property;
        var val = {};

        for ( id in prop ) {
            if ( Object.prototype.hasOwnProperty.call( prop, id ) ) {
                val[id] = prop[id].toJSON( data[id] );
            }
        }

        return val;
    }

// internal methods
    function createRootItem() {
        return new this.coerceRoot();
    }
}

function addProperty( acc, prop ) {
    if ( !prop || typeof prop !== 'object' ) {
        return acc;
    }

    if ( !( prop instanceof Property ) ) {
        prop = new Property( prop );
    }

    if ( prop instanceof Property ) {
        prop = new Property( prop );

        acc.properties.push( acc.property[prop.id] = prop );
    }

    return acc;
}

function initCoerceRoot( Constructor ) {
    switch ( typeof Constructor ) {
        case 'function'  :
            break;
        case 'string'    :
            switch ( Constructor.toLowerCase() ) {
                case 'array' :
                    Constructor = Array;
                    break;
                default      :
                    Constructor = Object;
            }
            break;
        default          :
            Constructor = Object;
    }

    return Constructor;
}

function initConfig( instance, config ) {
    if ( instance.__processed__ ) {
        return instance;
    }

    var has_config = config && typeof config == 'object';
    var mappings = instance.constructor.__mappings__;
    var properties = instance.constructor.__properties__;

    if ( has_config && Array.isArray( config ) ) {
        config = { properties : config };
    }

    if ( mappings && typeof mappings == 'object' ) {
        instance.mappings = has_config
            ? update( config.mappings || {}, mappings )
            : update( mappings );

        !has_config || delete config.mappings;
    }

    if ( properties && typeof properties == 'object' ) {
        instance.properties = has_config
            ? update( config.properties || [], properties )
            : update( properties );

        !has_config || delete config.properties;
    }

    return copy( instance, config );
}

function initProperties( properties ) {
    if ( !Array.isArray( properties ) ) {
        throw new TypeError( 'Schema: `properties` must be an Array' );
    }

    return properties.reduce( addProperty, {
        properties : [],
        property : Object.create( null )
    } );
}
