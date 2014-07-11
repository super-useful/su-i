import { __global__, __document__ } from '../globals';

if ( typeof Object.create !== 'function' ) {
    Object.create = function ( object ) {
        Empty.prototype = object;

        return new Empty;
    };
}

var _ua, fv, k;
var SPACE = ' ';
var cls = [];
var el = __document__.createElement( 'a' );
var html = __document__.documentElement;
var nav = __global__.navigator;
var fp = nav.plugins['Shockwave Flash'];
var re_orientation = /(\s*o9n-\w{1}\s*){1,}/;
var style = 'currentStyle' in html && html.currentStyle
    ? html.currentStyle
    : getComputedStyle( html, null );
var target = __document__.getElementById( 'alert-me' ) || html;
var versions = { // QUESTION: do we include Opera? ANSWER: what the fudge for!? AUDIENCE: HaHAhAhAHaH! Big, TIME!
    chrome : '\\/37~\\/36~\\/35~\\/34~\\/33~\\/32'.split( '~' ),
    ff : '\\/31\\.~\\/30\\.~\\/29\\.~\\/28\\.~\\/27\\.'.split( '~' ),
    ie : 'rv 12~rv 11~msie 10~msie 9~msie 8~msie 7'.split( '~' ),
    safari : 'version\\/8~version\\/7~version\\/6'.split( '~' )
};

export var ua = Object.create( null );

if ( !( 'ua' in ua ) || ua.ua !== nav.userAgent ) {
    fv = fp ? parseInt( fp.description.replace( /\D*(\d+)\s*/, '$1' ) ) : 0;
    ua.ua = nav.userAgent;
    _ua = ua.ua.toLowerCase();

    // 3 star generals
    ua.mspoint = !!nav.msPointerEnabled;
    ua.retina = __global__.devicePixelRatio >= 2;
    ua.secure = location.protocol.toLowerCase() == 'https:';
    ua.standalone = !!nav.standalone;
    ua.strict = __document__.compatMode == "CSS1Compat";
    ua.quirks = !ua.strict;
    ua.touch = 'ontouchstart' in html;

    // operating system
    ua.win = test( /windows|win32/ );
    ua.mac = test( /macintosh|mac os x/ );
    ua.air = test( /adobeair/ );
    ua.linux = test( /linux/ );

    // device
    ua.android = test( /android/ );
    ua.ipad = test( /ipad/ );
    ua.iphone = test( /iphone|ipod/ );
    ua.ios = ua.iphone || ua.ipad;
    ua.ios7 = ua.ios && test( /os 7/ );
    ua.msphone = test( /windows phone|ie mobile/ );
    ua.nokia = test( /nokia/ );
    ua.desktop = !ua.android && !ua.ipad && !ua.iphone && !ua.msphone && !ua.nokia;
    ua.handheld = !ua.desktop;

    // browser
    ua.webkit = test( /webkit/ );
    ua.chrome = test( /chrome/ );
    ua.safari = !ua.chrome && test( /safari/ );
    ua.ff = test( /firefox/ );
    ua.fennec = test( /fennec/ );
    ua.gobwsr = test( /gobrowser/ );
    ua.opera = test( /opera/ );
    ua.omini = test( /opera mini|opera mobile/ );
    ua.ie = !ua.opera && ( test( /trident/ ) || test( /msie/ ) || test( /\(ie[^\)]+\)\s*like gecko/ ) );

    // flash
    ua.flash = !!fp;
    ua['flash' + fv] = !!fv;

    // css
    ua.cssanimations = 'a webkitA mozA msA oA '.split( ' ' ).join( 'nimationName ' ).split( ' ' ).some( function ( n ) {
        return n in style;
    } );
    ua.csstransforms = 't webkitT mozT msT oT '.split( ' ' ).join( 'ransformOrigin ' ).split( ' ' ).some( function ( n ) {
        return n in style;
    } );
    ua.csstransitions = 't webkitT mozT msT oT '.split( ' ' ).join( 'ransitionProperty ' ).split( ' ' ).some( function ( n ) {
        return n in style;
    } );
    ua.pointerevents = 'p webkitP mozP msP oP '.split( ' ' ).join( 'ointerEvents ' ).split( ' ' ).some( function ( n ) {
        var el = document.createElement( 'x' );
        var el_style = el.style;
        var supports = false;

        if ( !( n in el_style ) ) {
            return supports;
        }

        el_style[n] = 'auto';
        el_style[n] = 'x';

        html.appendChild( el );

        supports = !!( typeof getComputedStyle === 'function' && getComputedStyle( el, null )[n] === 'auto' );

        html.removeChild( el );

        return supports;
    } );

    Object.keys( versions ).some( function ( browser ) {
        if ( ua[browser] !== true ) {
            return false;
        }

        var version;

        while ( version = this[browser].shift() ) {
            if ( test( new RegExp( version ) ) ) {
                return ua[browser + '-' + version.replace( /\D/g, '' )] = true;
            }
        }

        return ua[browser + '-X'] = true;
    }, versions );

    for ( k in ua ) {
        if ( ua[k] === false ) {
            ua['not-' + k] = true;
        }
    }

    ua.cancelAnimationFrame = function () {
        var cancel;

        'c webkitC mozC msC oC'.split( ' ' ).join( 'ancelAnimationFrame ' ).split( ' ' ).some( function ( n ) {
            return n in __global__ ? !!( cancel = n ) : false;
        } );

        return cancel;
    }();

    // webkit is the only user agent which is still prefixing the below events at our support level
    ua.event = 'AnimationEnd AnimationIteration AnimationStart TransitionEnd'.split( ' ' ).reduce( function ( event, Evt ) {
        var evt = Evt.toLowerCase();

        event[evt] = ( 'onwebkit' + evt ) in __global__ ? 'webkit' + Evt : evt;

        return event;
    }, Object.create( null ) );

    ua.classList = function () {
        var classList = null;

        'c webkitC mozC msC oC '.split( ' ' ).join( 'lassList ' ).split( ' ' ).some( function ( n ) {
            return n in el ? !!( classList = n ) : false;
        } );

        return classList;
    }();

    ua.dataset = function () {
        var dataset = null;

        'd webkitD mozD msD oD '.split( ' ' ).join( 'ataset ' ).split( ' ' ).some( function ( n ) {
            return n in el ? !!( dataset = n ) : false;
        } );

        return dataset;
    }();

    ua.matchMedia = function () {
        var match = null;

        'm webkitM mozM msM oM '.split( ' ' ).join( 'atchMedia ' ).split( ' ' ).some( function ( n ) {
            return n in __global__ ? !!( match = n ) : false;
        } );

        return match;
    }();

    ua.matches = ua.matchesSelector = function () {
        var matches = null,
            prefix = 'm webkitM mozM msM oM '.split( ' ' );

        prefix.join( 'atches ' ).split( ' ' ).some( function ( n ) {
            return n in el ? !!( matches = n ) : false;
        } );

        matches || prefix.join( 'atchesSelector ' ).split( ' ' ).some( function ( n ) {
            return n in el ? !!( matches = n ) : false;
        } );

        return matches;
    }();

    ua.requestAnimationFrame = function () {
        var anim = null;

        'r webkitR mozR msR oR '.split( ' ' ).join( 'equestAnimationFrame ' ).split( ' ' ).some( function ( n ) {
            return n in __global__ ? !!( anim = n ) : false;
        } );

        return anim;
    }();
}

if ( target !== html ) {
    DOMContentLoaded();
}
else {
    $( DOMContentLoaded );
}

$( __global__ ).on( 'orientationchange', orientationchange );

if ( typeof Object.defineProperty !== 'function' || ua['ie-8'] === true ) {
    Object.defineProperty = function ( item, property, descriptor ) {
        if ( descriptor && 'value' in Object( descriptor ) ) {
            item[property] = descriptor.value;
        }

        return item;
    };
}

if ( typeof Object.defineProperties !== 'function' ) {
    Object.defineProperties = function ( item, descriptor ) {
        for ( var property in descriptor ) {
            if ( Object.prototype.hasOwnProperty.call( descriptor, property ) ) {
                Object.defineProperty( item, property, descriptor[property] );
            }
        }

        return item;
    };
}

el = style = null;

ua.computedStyle = 'currentStyle' in html
    ? function ( el ) { return el.currentStyle; }
    : getComputedStyle.bind( __global__ );

function DOMContentLoaded() {
    orientationchange();
    ua.ready = true;
    target = __document__.getElementById( 'alert-me' ) || html;
    addclasses();

    if ( ua['ie-9'] ) {
        target.addEventListener( 'selectstart', function ( evt ) {
            evt.preventDefault();
            evt.stopPropagation();

            return false;
        }, true );
    }
}

function Empty() {}

function addclasses() {
    // we always want to assign this rather than have it in local storage
    ua.debug = !!~location.search.indexOf( 'debug' ) || !!~location.hash.indexOf( 'debug' );

    if ( ua.debug === false ) {
        ua['not-debug'] = true;
    }

    for ( k in ua ) { // we loop through the scope (this)
        if ( ua[k] === true ) { // we only want the keys of the values which equate to "true"
            cls.push( k );
        }
    }

    target.className = target.className.replace( /nojs/, '' ) + ' js ' + cls.join( ' ' ); // now we can assign the classes to the documentElement. i.e. the html tag

    _ua = cls = versions = null;
}

function orientationchange() {
    var deg = __global__.orientation;

    target.className = target.className.replace( re_orientation, ' ' );

    if ( deg === 0 || deg === 180 ) { // portrait
        target.className += ' o9n-P';
        ua.orientation = 'portrait';
    }
    else if ( deg === 90 || deg === -90 ) { // landscape
        target.className += ' o9n-L';
        ua.orientation = 'landscape';
    }
}

function test( re ) { return re.test( _ua ); }
