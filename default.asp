<html>
  <head>
	<title>Plextastic</title>
    <style type="text/css" media="screen">@import "jqtouch/jqtouch.css";</style>
    <style type="text/css" media="screen">@import "themes/jqt/theme.css";</style>
    <script src="jqtouch/jquery-1.4.2.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="jqtouch/jqtouch.js" type="application/x-javascript" charset="utf-8"></script>
    <script type="text/javascript" src="plextastic.js"></script>
    <style type="text/css">
      .green {
        background:
      }
      #jqt ul li small.counter_green {
        font-size: 17px;
        line-height: 13px;
        font-weight: bold;
        background: rgba(92,186,22,1);
        color: #fff;
        -webkit-border-radius: 11px;
        padding: 4px 10px 5px 10px;
        display: block;
        width: auto;
        margin-top: -22px;
        -webkit-box-shadow: rgba(255,255,255,.1) 0 1px 0;
      }
      #jqt ul li.arrow small.counter_green {
        margin-right: 15px;
      }
    </style>
  </head>
  <body>
    <div id="jqt">
    <div id="main_menu">
      <div class="toolbar">
        <h1>TV Shows</h1>
      </div>
      <ul id="main_menu_list" class="rounded">
      </ul>
    </div>
    <div id="season_menu">
      <div class="toolbar">
        <a class="back" href="#series">Back</a>
        <h1 id="season_title"></h1>
      </div>
      <ul id="season_menu_list" class="rounded">
      </ul>
    </div>
    <div id="episode_menu">
      <div class="toolbar">
        <a class="back" href="#series">Back</a>
        <h1 id="episode_title"></h1>
      </div>
      <ul id="episode_menu_list" class="rounded">
      </ul>
    </div>
    </div>
  </body>
</html>
