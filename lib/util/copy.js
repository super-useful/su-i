import { isPlainObject, type, typeOf } from './type';

export function copy( target, source, no_overwrite = false ) {
    if ( !source ) {
        source = target;
        target = {};
    }

    source = Object( source );

    for ( var key in source ) {
        if ( Object.prototype.hasOwnProperty.call( source, key ) && ( no_overwrite !== true || !Object.prototype.hasOwnProperty.call( target, key ) ) ) {
            target[key] = source[key];
        }
    }

    return target;
}

export function merge( target, source ) {
    if ( source === UNDEF ) {
        if ( target === UNDEF ) {
            return target;
        }

        if ( Array.isArray( target ) ) {
            return target.reduce( merge_array, [] );
        }
        else if ( isPlainObject( target ) ) {
            return Object.keys( target ).reduce( merge_object, {
                source : target,
                target : {}
            } ).target;
        }

        return target;
    }

    if ( Array.isArray( source ) ) {
        if ( !Array.isArray( target ) ) {
            target = [];
        }
        else {
            target.length = source.length; // remove any extra items on the merged Array
        }

        return source.reduce( merge_array, target );
    }
    else if ( isPlainObject( source ) ) {
        return Object.keys( source ).reduce( merge_object, {
            source : source,
            target : type.typeOf( target ) === 'object' ? target : {}
        } ).target;
    }

    return source;
}

export function update( target, source ) {
    if ( source === UNDEF ) {
        return merge( target );
    }

    if ( target === UNDEF || target === null ) {
        return merge( source );
    }

    if ( Array.isArray( source ) ) {
        return source.reduce( update_array, target );
    }

    else if ( isPlainObject( source ) ) {
        if ( !isPlainObject( target ) ) {
            return target;
        }

        return Object.keys( source ).reduce( update_object, { source : source, target : target } ).target;
    }

    return target;
}

var UNDEF;

function merge_array( target, source, i ) {
    target[i] = merge( target[i], source );

    return target;
}

function merge_object( o, key ) {
    o.target[key] = merge( o.target[key], o.source[key] );

    return o;
}

function update_array( target, source, i ) {
    target[i] = update( target[i], source );

    return target;
}

function update_object( o, key ) {
    o.target[key] = update( o.target[key], o.source[key] );

    return o;
}
