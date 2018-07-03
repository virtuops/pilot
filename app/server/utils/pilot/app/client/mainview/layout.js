define(function () {
    return {
        init: function () {
                $('#layout').w2layout(this.layoutmain);
                $().w2layout(this.layout2080);
                $().w2layout(this.layout7030);
                $().w2layout(this.layout5050);
                $().w2layout(this.layoutsingle);
        },
        layoutmain: {
                name: 'layoutmain',
                panels: [
                        { type: 'left', size: 275, resizable: true },
                        { type: 'main', resizable: true }
                ]
        },
        layout2080: {
                name: 'layout2080',
                panels: [
                        { type: 'top', size: '30%', resizable: true },
                        { type: 'main', size: '70%', resizable: true }
                ]
        },
        layout7030: {
                name: 'layout7030',
                panels: [
                        { type: 'right', size: '30%', resizable: true },
                        { type: 'main', size: '70%', resizable: true }
                ]
        },
        layout5050: {
                name: 'layout5050',
                panels: [
                        { type: 'left', size: '50%', resizable: true },
                        { type: 'main', size: '50%', resizable: true }
                ]
        },
        layoutsingle: {
                name: 'layoutsingle',
                panels: [
                        { type: 'main', resizable: true }
                ]
        },
        popuplayout: {
                name: 'popuplayout',
                padding: 4,
                panels: [
                    { type: 'main', size: '100%', minSize: 500 }
                ]
        },
        intro: function(){
                w2ui.layoutmain.load('main','html/docs/intro.php');
        }
    };
});

