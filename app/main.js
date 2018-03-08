/*START OF PROGRAM*/

define(function (require) {
    var NocHero = require('../app/client/mainview/layout');
    var SideBar = require('../app/client/sidemenu/menu');
    var Content = require('../app/client/display/content');
    var Session = require('../app/client/utils/session');
    NocHero.init();
    SideBar.init();
    NocHero.intro();
    Content.init();
    Session.init();

});

