export function clone( date ) {
    return moment( date ).clone().toDate();
}

export function coerce( date_str, format, tz ) {
    return tz
         ? moment.tz( date_str, format, true, tz ).toDate()
         : moment( date_str, format, true ).toDate();
}

export function format( date, format, tz ) {
    return tz
         ? moment( date, tz ).format( format )
         : moment( date ).format( format );
}

export var formats = {
    ISO_8601       : 'YYYY-MM-DDTHH:mm:ssZ',
    ISO_8601_SHORT : 'YYYY-MM-DD',
    sortable       : 'YYYY-MM-DD HH:mm:ssZZ'
};

var moment = require( 'moment-timezone' );
