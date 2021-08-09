// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
        // RUTAS GENERALES
      { path: '/', url: 'index.html', },
      { path: '/registro/', url: 'registro.html' },
      { path: '/login/', url: 'login.html' },

]
 // ... other parameters
  });

  var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialize
    console.log(e);

      
})


// Option 2. Using live 'page:init' event handlers for each page

// INDEX

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    console.log("carga index");

// Oculto navbar y toolbar en el index
      app.navbar.hide('#navBar');
      app.toolbar.hide('#toolBar');

        $$('#registro').on('click', function(){
          mainView.router.navigate('/registro/');
        })

        $$('#login').on('click', function(){
          mainView.router.navigate('/login/');
        })
})


// REGISTRO
