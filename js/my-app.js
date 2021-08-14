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
  // console.log(e);

      
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
          console.log("carga registro");
        })

        $$('#login').on('click', function(){
          mainView.router.navigate('/login/');
        })
})

// 10/8/2021
// QUÉ HICE: REGISTRO DE USUARIO
// DE 14 a 16:23hs
// Gracias al Señor puedo registrar un usuario --> 16:23hs

// REGISTRO


$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('#btnRegistro').on('click', registro);
  $$('img').on('click', function() { avatarUsuario(this.id) });
});

function registro() {
  nombre = $$('#nombre').val();
  email = $$('#emailRegistro').val();
  passReg = $$('#passRegistro').val();

  firebase.auth().createUserWithEmailAndPassword(email, passReg)
  .then((userCredential) => {
    // Registrado
    var user = userCredential.user;
    // Avatar
    
    // nombre
      console.info('Nombre: ' + nombre);
      //email
      console.info('Email:' + user.email);

      // pass
      console.info('Pass: ' + passReg);
      
  })
  .catch((error) => {
    // var errorCode = error.code;
    // var errorMessage = error.message;

    // Valido si el nombre que el usuario ingresa, es válido
    if(!(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/g.test(nombre))) return console.error(`${nombre} no es un nombre válido`);

    // Valido si la contraseña que el usuario ingresa, no exceda los 6 caracteres
    if(passReg > 6) return console.error("La contraseña no puede exceder los 6 caracteres");

  });
}

function avatarUsuario(id) {
  avatar = id;
  $$('.fotoPerfil').addClass("avatarElegido");
  console.info("Avatar elegido: ", avatar);
}