 /*
  * yertwitter
  * A javascript object for displaying and customizing twitter timelines.
  *
  * Copyright (c) 2012 Johann Heyne
  *
  * Minimum requirements: jQuery v1.6+
  *
  * Terms of use:
  * yertwitter is licensed under the MIT License.
  *
  */

var yerTwitter = {
    
    linkify: function ( tweet ) {

        /* Source: http://pastebin.com/Ai685Ya9 */
        tweet = tweet.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
            var wrap = document.createElement('div');
            var anch = document.createElement('a');
            anch.href = url;
            anch.target = "_blank";
            anch.innerHTML = url;
            wrap.appendChild(anch);
            return wrap.innerHTML;
        });
        tweet = tweet.replace(/(^|\s)@(\w+)/g, '$1<a href="http://www.twitter.com/$2" target="_blank">@$2</a>');
        return tweet.replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>');
    },

    parseTwitterDate: function ( p ) {
        
         if ( typeof p === 'undefined' ) { p = {}; }
            if ( typeof p.type === 'undefined' ) { p.type = 'relative'; } // relative, date
            if ( typeof p.lang === 'undefined' ) { p.lang = 'de'; } // en, de
            if ( typeof p.created_at === 'undefined' ) { p.created_at = new Date(); }
            if ( typeof p.show_time === 'undefined' ) { p.show_time = false; }
            if ( typeof p.show_date === 'undefined' ) { p.show_date = true; }
        
        if ( p.type === 'date' ) {
        
            var month = [];
        
                month.en = [];
                month.en[0] = "January";
                month.en[1] = "February";
                month.en[2] = "March";
                month.en[3] = "April";
                month.en[4] = "May";
                month.en[5] = "June";
                month.en[6] = "July";
                month.en[7] = "August";
                month.en[8] = "September";
                month.en[9] = "October";
                month.en[10] = "November";
                month.en[11] = "December";
            
                month.de = [];
                month.de[0] = "Januar";
                month.de[1] = "Februar";
                month.de[2] = "März";
                month.de[3] = "April";
                month.de[4] = "Mai";
                month.de[5] = "Juni";
                month.de[6] = "Juli";
                month.de[7] = "August";
                month.de[8] = "September";
                month.de[9] = "Oktober";
                month.de[10] = "November";
                month.de[11] = "Dezember";

            var v = p.created_at.split(' '),
                date = new Date( Date.parse( v[1] + " " + v[2] + ", " + v[5] + " " + v[3] + " UTC") ),
                hour = date.getHours(),
                ampm = hour < 12 ? ' AM' : ' PM';
            
                var ret = '';
            
                if ( p.show_time ) { ret += date.getHours() + ':' + date.getMinutes(); }
                if ( p.show_time && p.lang === 'en' ) { ret += ' ' + ampm; }
                if ( p.show_date ) { ret += ' ' + date.getDate() + '.'; }
                if ( p.show_date ) { ret += ' ' + month[ p.lang ][ date.getMonth() ]; }
                if ( p.show_date ) { ret += ' ' + date.getFullYear(); }
            
            return ret;
        }
        
        if ( p.type === 'relative' ) {
        
            /* Quelle: http://www.der-webdesigner.net/forum/javascript-f52/twitter-datum-anzeigen-t13382.html */
            var values = p.created_at.split(" ");
            time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
            var parsed_date = Date.parse(time_value);
            var relative_to = ( arguments.length > 1 ) ? arguments[1] : new Date();
            var delta = parseInt( (relative_to.getTime() - parsed_date) / 1000, 10 );
            delta = delta + ( relative_to.getTimezoneOffset() * 60 );
            
            if ( p.lang === 'de' ) {
                if ( delta < 60 ) {
                    return 'Vor ein paar Sekunden';
                } else if ( delta < 120 ) {
                    return 'Vor einer Minute';
                } else if(delta < ( 60 * 60 ) ) {
                    return 'Vor ' + (parseInt( delta / 60, 10) ).toString() + ' Minuten';
                } else if (delta < ( 120 * 60 ) ) {
                    return 'Vor einer Stunde';
                } else if (delta < ( 24 * 60 * 60 ) ) {
                    return 'Vor ' + ( parseInt( delta / 3600, 10 ) ).toString() + ' Stunden';
                } else if ( delta < ( 48 * 60 * 60 ) ) {
                    return 'Gestern';
                } else {
                    return 'Vor ' + ( parseInt( delta / 86400, 10 ) ).toString() + ' Tagen';
                }
            }
            
            if ( p.lang === 'en' ) {
                if ( delta < 60 ) {
                    return 'seconds ago';
                } else if ( delta < 120 ) {
                    return 'about 1 minute ago';
                } else if(delta < ( 60 * 60 ) ) {
                    return (parseInt( delta / 60, 10) ).toString() + ' minutes ago';
                } else if (delta < ( 120 * 60 ) ) {
                    return 'about 1 hour ago';
                } else if (delta < ( 24 * 60 * 60 ) ) {
                    return 'Vor ' + ( parseInt( delta / 3600, 10 ) ).toString() + ' hours ago';
                } else if ( delta < ( 48 * 60 * 60 ) ) {
                    return 'yesterday';
                } else {
                    return ( parseInt( delta / 86400, 10 ) ).toString() + ' days ago';
                }
            }
        }
    },
    
    timeline: function ( p ) {
        
        if ( typeof p === 'undefined' ) { p = {}; }
        if ( typeof p.lang === 'undefined' ) { p.lang = 'de'; }
        if ( typeof p.screen_name === 'undefined' ) { p.screen_name = 'johannheyne'; }
        if ( typeof p.count === 'undefined' ) { p.count = 3; }
        if ( typeof p.selector === 'undefined' ) { p.selector = false; }
        if ( typeof p.root_class === 'undefined' ) { p.root_class = 'tweets'; }
        if ( typeof p.retweet_class === 'undefined' ) { p.retweet_class = 'retweet'; }
        if ( typeof p.tweet_class === 'undefined' ) { p.tweet_class = 'tweet'; }
        if ( typeof p.twitter_link === 'undefined' ) { p.twitter_link = 'https://twitter.com'; }
        if ( typeof p.console_log === 'undefined' ) { p.console_log = false; }
        if ( typeof p.created_at_type === 'undefined' ) { p.created_at_type = false; }
        if ( typeof p.created_at_class === 'undefined' ) { p.created_at_class = false; }
        if ( typeof p.show_in_order === 'undefined' ) { p.show_in_order = {
            text: 1
        }; }
        if ( typeof p.show_in_order.profile_image === 'undefined' ) { p.show_in_order.profile_image = false; }
        if ( typeof p.show_in_order.screen_name === 'undefined' ) { p.show_in_order.screen_name = false; }
        if ( typeof p.show_in_order.text === 'undefined' ) { p.show_in_order.text = false; }
        if ( typeof p.show_in_order.created_at === 'undefined' ) { p.show_in_order.created_at = false; }
        if ( typeof p.show_in_order.twitter_link === 'undefined' ) { p.show_in_order.twitter_link = false; }
        if ( typeof p.twitter_link_text === 'undefined' ) { p.twitter_link_text = 'more tweets'; }
        if ( typeof p.twitter_link_class === 'undefined' ) { p.twitter_link_class = false; }
        
        
        var param = {};
            param.screen_name = p.screen_name;
            param.count = p.count;
            param.include_rts = 1;
            param.include_entities = 1;
        
        jQuery.ajax({
            type: 'GET',
            dataType: 'jsonp',
            url: 'http://api.twitter.com/1/statuses/user_timeline.json',
            data: param,
            success: function( data, textStatus, XMLHttpRequest ) {
            
                if ( p.console_log ) { console.log( data ); }
                
                if ( p.selector ) {
                    
                    var adclass = '',
                        results = jQuery( p.selector );
                        
                    results.append( '<ul class="tweets ' + p.root_class + '">' );
                    results = results.find('ul');
                    
                    for ( var i in data ) {
                        
                        var sort = [];
                        
                        if ( data[i].retweeted_count > 0 ) {
                            
                            // retweet
                            /*if ( data[i].retweeted_status.favorited ) { adclass = ' favorite'; }
                            tmp += '<li class="' + p.retweet_class + adclass + '" data-id="' + data[i].retweeted_status.id_str + '">';
                                if ( p.show_profile_image ) { tmp += '<img src="' + data[i].retweeted_status.user.profile_image_url + '" alt=""/>'; }
                                if ( p.show_screen_name ) { tmp += '<cite>' + data[i].retweeted_status.user.screen_name + '</cite>'; }
                                if ( p.show_text ) { tmp += '<p>' + yerTwitter.linkify( data[i].retweeted_status.text ) + '</p>'; }
                                if ( p.show_created_at ) { tmp += '<p>' + yerTwitter.parseTwitterDate({ created_at: data[i].retweeted_status.created_at, lang: p.lang }) + '</p>'; }
                                if ( p.show_link_twitter ) { tmp += '<a href="https://twitter.com/' + data[i].user.screen_name + '">' + p.show_link_twitter_text + '</a>'; }
                            tmp += '</li>';*/
                        
                        } else {
                            
                            // tweet
                            
                            if ( p.show_in_order.profile_image !== false ) { sort[ p.show_in_order.profile_image ] = '<img class="tweet_profile_image" src="' + data[i].user.profile_image_url + '" alt=""/>'; }
                            if ( p.show_in_order.screen_name !== false ) { sort[ p.show_in_order.screen_name ] = '<cite class="tweet_screen_name">' + data[i].user.screen_name + '</cite>'; }
                            if ( p.show_in_order.text !== false ) { sort[ p.show_in_order.text ] = '<p class="tweet_text">' + yerTwitter.linkify( data[i].text ) + '</p>'; }
                            if ( p.show_in_order.created_at !== false ) { sort[ p.show_in_order.created_at ] = '<p class="' + p.created_at_class + ' tweet_created_at">' + yerTwitter.parseTwitterDate({ created_at: data[i].created_at, lang: p.lang, type: p.created_at_type }) + '</p>'; }
                            if ( p.show_in_order.twitter_link !== false ) { sort[ p.show_in_order.twitter_link ] = '<a class="' + p.twitter_link_class + ' tweet_twitter_link" href="https://twitter.com/' + data[i].user.screen_name + '">' + p.twitter_link_text + '</a>'; }
                            if ( data[i].favorited ) { adclass = ' favorite'; }
                            
                        }
                        
                        var tmp = '<li data-id="' + data[i].id_str + '" class="' + p.tweet_class + ' ' + adclass + '">';
                            for ( var i2 in sort ) {
                                tmp += sort[ i2 ];
                            }
                        tmp += '</li>';
                        
                        results.append( tmp );
                    }
                }
            },
            
            error: function(req, status, error) {
                console.log( 'Error: ' + status );
            }
            
        });
    }

};
    
