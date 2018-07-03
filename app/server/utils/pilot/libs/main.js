requirejs.config({
    baseUrl: 'libs',
    paths: {
        app: '../app'
    }
});

requirejs(['app/main']);
