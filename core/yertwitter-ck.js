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
  */var yerTwitter={linkify:function(e){e=e.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g,function(e){var t=document.createElement("div"),n=document.createElement("a");n.href=e;n.target="_blank";n.innerHTML=e;t.appendChild(n);return t.innerHTML});e=e.replace(/(^|\s)@(\w+)/g,'$1<a href="http://www.twitter.com/$2" target="_blank">@$2</a>');return e.replace(/(^|\s)#(\w+)/g,'$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>')},parseTwitterDate:function(e){typeof e=="undefined"&&(e={});typeof e.type=="undefined"&&(e.type="relative");typeof e.lang=="undefined"&&(e.lang="de");typeof e.created_at=="undefined"&&(e.created_at=new Date);typeof e.show_time=="undefined"&&(e.show_time=!1);typeof e.show_date=="undefined"&&(e.show_date=!0);if(e.type==="date"){var t=[];t.en=[];t.en[0]="January";t.en[1]="February";t.en[2]="March";t.en[3]="April";t.en[4]="May";t.en[5]="June";t.en[6]="July";t.en[7]="August";t.en[8]="September";t.en[9]="October";t.en[10]="November";t.en[11]="December";t.de=[];t.de[0]="Januar";t.de[1]="Februar";t.de[2]="März";t.de[3]="April";t.de[4]="Mai";t.de[5]="Juni";t.de[6]="Juli";t.de[7]="August";t.de[8]="September";t.de[9]="Oktober";t.de[10]="November";t.de[11]="Dezember";var n=e.created_at.split(" "),r=new Date(Date.parse(n[1]+" "+n[2]+", "+n[5]+" "+n[3]+" UTC")),i=r.getHours(),s=i<12?" AM":" PM",o="";if(e.lang==="de"){e.show_time&&(o+=r.getHours()+":"+r.getMinutes());e.show_time&&e.lang==="en"&&(o+=" "+s);e.show_date&&(o+=" "+r.getDate()+".");e.show_date&&(o+=" "+t[e.lang][r.getMonth()]);e.show_date&&(o+=" "+r.getFullYear())}if(e.lang==="en"){e.show_time&&(o+=r.getHours()+":"+r.getMinutes());e.show_time&&(o+=" "+s);e.show_date&&(o+=" "+t[e.lang][r.getMonth()]);e.show_date&&(o+=" "+r.getDate()+"th");e.show_date&&(o+=", "+r.getFullYear())}return o}if(e.type==="relative"){var u=e.created_at.split(" ");time_value=u[1]+" "+u[2]+", "+u[5]+" "+u[3];var a=Date.parse(time_value),f=arguments.length>1?arguments[1]:new Date,l=parseInt((f.getTime()-a)/1e3,10);l+=f.getTimezoneOffset()*60;if(e.lang==="de")return l<60?"Vor ein paar Sekunden":l<120?"Vor einer Minute":l<3600?"Vor "+parseInt(l/60,10).toString()+" Minuten":l<7200?"Vor einer Stunde":l<86400?"Vor "+parseInt(l/3600,10).toString()+" Stunden":l<172800?"Gestern":"Vor "+parseInt(l/86400,10).toString()+" Tagen";if(e.lang==="en")return l<60?"seconds ago":l<120?"about 1 minute ago":l<3600?parseInt(l/60,10).toString()+" minutes ago":l<7200?"about 1 hour ago":l<86400?"Vor "+parseInt(l/3600,10).toString()+" hours ago":l<172800?"yesterday":parseInt(l/86400,10).toString()+" days ago"}},timeline:function(e){typeof e=="undefined"&&(e={});typeof e.lang=="undefined"&&(e.lang="de");typeof e.screen_name=="undefined"&&(e.screen_name="johannheyne");typeof e.count=="undefined"&&(e.count=3);typeof e.selector=="undefined"&&(e.selector=!1);typeof e.root_class=="undefined"&&(e.root_class="tweets");typeof e.retweet_class=="undefined"&&(e.retweet_class="retweet");typeof e.tweet_class=="undefined"&&(e.tweet_class="tweet");typeof e.twitter_link=="undefined"&&(e.twitter_link="https://twitter.com");typeof e.console_log=="undefined"&&(e.console_log=!1);typeof e.created_at_type=="undefined"&&(e.created_at_type=!1);typeof e.created_at_class=="undefined"&&(e.created_at_class=!1);typeof e.show_in_order=="undefined"&&(e.show_in_order={text:1});typeof e.show_in_order.profile_image=="undefined"&&(e.show_in_order.profile_image=!1);typeof e.show_in_order.screen_name=="undefined"&&(e.show_in_order.screen_name=!1);typeof e.show_in_order.text=="undefined"&&(e.show_in_order.text=!1);typeof e.show_in_order.created_at=="undefined"&&(e.show_in_order.created_at=!1);typeof e.show_in_order.twitter_link=="undefined"&&(e.show_in_order.twitter_link=!1);typeof e.twitter_link_text=="undefined"&&(e.twitter_link_text="more tweets");typeof e.twitter_link_class=="undefined"&&(e.twitter_link_class=!1);var t={};t.screen_name=e.screen_name;t.count=e.count;t.include_rts=1;t.include_entities=1;jQuery.ajax({type:"GET",dataType:"jsonp",url:"http://api.twitter.com/1/statuses/user_timeline.json",data:t,success:function(t,n,r){e.console_log&&console.log(t);if(e.selector){var i="",s=jQuery(e.selector);s.append('<ul class="tweets '+e.root_class+'">');s=s.find("ul");for(var o in t){var u=[];if(!(t[o].retweeted_count>0)){e.show_in_order.profile_image!==!1&&(u[e.show_in_order.profile_image]='<img class="tweet_profile_image" src="'+t[o].user.profile_image_url+'" alt=""/>');e.show_in_order.screen_name!==!1&&(u[e.show_in_order.screen_name]='<cite class="tweet_screen_name">'+t[o].user.screen_name+"</cite>");e.show_in_order.text!==!1&&(u[e.show_in_order.text]='<p class="tweet_text">'+yerTwitter.linkify(t[o].text)+"</p>");e.show_in_order.created_at!==!1&&(u[e.show_in_order.created_at]='<p class="'+e.created_at_class+' tweet_created_at">'+yerTwitter.parseTwitterDate({created_at:t[o].created_at,lang:e.lang,type:e.created_at_type})+"</p>");e.show_in_order.twitter_link!==!1&&(u[e.show_in_order.twitter_link]='<a class="'+e.twitter_link_class+' tweet_twitter_link" href="https://twitter.com/'+t[o].user.screen_name+'">'+e.twitter_link_text+"</a>");t[o].favorited&&(i=" favorite")}var a='<li data-id="'+t[o].id_str+'" class="'+e.tweet_class+" "+i+'">';for(var f in u)a+=u[f];a+="</li>";s.append(a)}}},error:function(e,t,n){console.log("Error: "+t)}})}};