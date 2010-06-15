/*
Copyright (c) 2010, Daniel Svensson, <daniel.svensson@purplescout.se>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/


// Detect if 'tap' event is available.
var clickEvent = 'click';
var agent = navigator.userAgent.toLowerCase();
if (agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1)
    clickEvent = 'tap';

var jQT = new $.jQTouch({
    icon: 'jqtouch.png',
    addGlossToIcon: false,
    startupScreen: 'jqt_startup.png',
    statusBar: 'black',
    icon: 'plex.png',
    preloadImages: [
        'themes/jqt/img/back_button.png',
        'themes/jqt/img/back_button_clicked.png',
        'themes/jqt/img/button_clicked.png',
        'themes/jqt/img/grayButton.png',
        'themes/jqt/img/whiteButton.png',
        'themes/jqt/img/loading.gif'
    ]
});

/**
 * Very simplistic database query scrubbing.
 */
function scrub(query) {
    return query.replace('"', '\"');
}

/**
 * As XBMC is retarded and doesn't send row delimiters
 * this method converts the hetrogenous list of fields
 * to method calls where rows are separated based on
 * the number of arguments of the callback method.
 */
function eachRow(fields, cb) {
    for (var x=0; x < fields.length; x+= cb.length) {
        cb.apply(null, fields.slice(x, x + cb.length).toArray().map(function(x) {
            return x.textContent;
        }));
    }
}

$(document).ready(function(e) {
    var xbmcUrl = 'http://' + location.host + '/xbmcCmds/xbmcHttp';

    var argsAll = {"command": "queryvideodatabase(select c00,totalCount,watchedCount from tvshowview order by c00)"};

    $.get(xbmcUrl, argsAll, function(data) {
        eachRow($(data), function(title, episodes, watched) {
            episodes = parseInt(episodes || '0', 10);
            watched = parseInt(watched || '0', 10);

            var item = '<a href="#season_menu">' + title + '</a>';

            if (episodes > watched)
                item += '<small class="counter_green">' + episodes + '</small>';
            else
                item += '<small class="counter">' + episodes + '</small>';

            $('<li class="arrow">'+item+'</li>').appendTo('#main_menu_list');
        });
    });

    $('#season_menu').bind('pageAnimationStart', function(event, info) {
        if (info.direction != "in") {
            return false;
        }

        var title = $(this).data('referrer').text();

        $("#season_title").html(title);
        $("#season_menu_list").empty();

        var argsSeasons = {"command": "queryvideodatabase(select c12, count(c13), count(c08) from episodeview where strtitle like \"" + scrub(title) + "\" group by c12;)"};

        $.get(xbmcUrl, argsSeasons, function(data) {
            eachRow($(data), function(season, episodes, watched) {
                var episodes = parseInt(episodes || '0', 10);
                var watched = parseInt(watched || '0', 10);

                var item = '<a href="#episode_menu">Season ' + season + '</a>';
                if (episodes > watched)
                    item += '<small class="counter_green">' + episodes + '</small>';
                else
                    item += '<small class="counter">' + episodes + '</small>';

                $('<li class="arrow">' + item + '</li>').appendTo('#season_menu_list');
            });
        });
    });

    $('#episode_menu').bind('pageAnimationStart', function(event, info) {
        if (info.direction != "in") {
            return false;
        }

        var title = $("#season_title").text();
        var season = $(this).data('referrer').text().match(/[\d\.]+/g)[0];

        $('#episode_title').html('Season ' + season);
        $("#episode_menu_list").empty();

        var argsEpisodes = {"command": "queryvideodatabase(select c13, c08, c00, strPath, strFileName from episodeview where strtitle like \"" + scrub(title) + "\" and c12=" + scrub(season) + " order by cast(c13 as int))"};

        $.get(xbmcUrl, argsEpisodes, function(data) {
            eachRow($(data), function(episode, watched, title, path, filename) {
                $('#episode_menu_list').data(episode, path + filename);

                var item = '<a href="javascript:$(this).removeClass(\'active\');">' + episode + ' - ' + title + '</a>';
                if (watched == 0)
                    item += '<small class="counter_green">new</small>';

                $('<li class="arrow" class="episode">' + item + '</li>').appendTo('#episode_menu_list');
            });
        });
    });

    $('#episode_menu_list').bind(clickEvent, function(event){
        var episode = event.srcElement.innerText.match(/[\d]+/g)[0];
        var url = $('#episode_menu_list').data(episode);

        var argsPlayback = {'command': 'ExecBuiltIn',
                            'parameter': 'XBMC.PlayMedia('+url+')'};

        $.get(xbmcUrl, argsPlayback);
    });
});
