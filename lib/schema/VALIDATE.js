export function array( val ) {
    return Object.prototype.toString.call( val ) === '[object Array]' && val.length;
}

export function boolean( val ) {
    return typeof val === 'boolean';
}

export function date( val ) {
    return Object.prototype.toString.call( val ) === '[object Date]' && !isNaN( +val );
}

export function number( val ) {
    return typeof val === 'number' && !isNaN( val );
}

export function string( val ) {
    return typeof val === 'string';
}
