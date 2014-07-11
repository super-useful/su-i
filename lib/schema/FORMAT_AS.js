export function DEFAULT( property, val ) {
    return property.type( val );
}

export function FUNCTION( property, val, format, raw, data ) {
    return property.type( format.call( property, val, raw, data ) );
}

export function STRING( property, val, format ) {
    return property.type( val, format );
}
