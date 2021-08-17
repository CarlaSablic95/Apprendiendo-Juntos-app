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
      { path: '/mi-perfil/', url: 'mi-perfil.html' },
      { path: '/materias/', url: 'materias.html' },
]
 // ... other parameters
  });

  let mainView = app.views.create('.view-main');

  // db hace la conexión a la BD
 let db = firebase.firestore();

 // creo la coleccion de usuarios
 let colAlumnos = db.collection("alumnos");

 // Email y pass del registro, las hago variables globales para poder usarlas en el login, y así compararlas
 let emailReg = "", passReg = "", avatar = "", datosAlumno = "", nombre ="", emailLogin = "";

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
          console.log("Carga registro");
        })

        $$('#login').on('click', function(){
          mainView.router.navigate('/login/');
          console.info("Carga login");
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

function registro() { // 14:58hs
  // las variables que guardan los datos del usuario y el objeto que contiene esos datos, debo ponerlos fuera de la función --> firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
  let avatar = $$('.fotoPerfil').attr('src');
  let nombre = $$('#nombre').val();
  let emailReg = $$('#emailRegistro').val();
  let passReg = $$('#passRegistro').val();

 let datosAlumno = {
    avatar,
    nombre,
    emailReg,
    passReg
  };



  firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
  .then((userCredential) => {
    // Registrado
    // var user = userCredential.user;
    // Creaar la BD de alumnos y agregarle los datos
    // GRACIAS AL SEÑOR 15:16HS, AGREGUÉ A LA BD LA COLECCIÓN DE USUARIOS Y SUS DATOS
      colAlumnos.doc('alumno').set(datosAlumno);
    // nombre
      console.info('Nombre: ' + datosAlumno.nombre);
      //email
      console.info('Email:' + datosAlumno.emailReg);

      console.info('Avatar:' + datosAlumno.avatar);
      // pass
      // console.info('Pass: ' + passReg);

      mainView.router.navigate('/login/');
      
  })
  .catch((error) => {
    // var errorCode = error.code;
    // var errorMessage = error.message;

    // Valido si el nombre que el usuario ingresa, es válido
    if(!(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/g.test(datosAlumno.nombre))) return console.error(`${datosAlumno.nombre} no es un nombre válido`);

    // Valido si la contraseña que el usuario ingresa, no exceda los 6 caracteres
    if(passReg > 6) return console.error("La contraseña no puede exceder los 6 caracteres");

  });
}

// MARTES 17/8/2021
// De 11:28hs a 15:44hs
/* QUÉ HICE: 
- Registrar y loguear al usuario
- Crear una colección de usuarios para la BD y agregarle datos con código, y no manualmente

*/


function avatarUsuario(id) {
  avatar = id;
  $$('.fotoPerfil').addClass("avatarElegido");
  console.info("Avatar elegido: ", avatar);
}

/*************************************************/

// LOGIN
$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#btnLogin').on('click', login);
});

function login() {

  emailLogin = $$('#emailLogin').val();
  passLogin = $$('#passLogin').val();

  firebase.auth().signInWithEmailAndPassword(emailLogin, passLogin)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // Imprimir email de usuario y un alerta con un mensaje de éxito

      // Una vez que se loguea, es llevado al inicio, materias
      mainView.router.navigate('/materias/');
  
    console.info('Mi email: ' + emailLogin);
    alert('Bienvenido/a');
  })
  .catch((error) => {
    // var errorCode = error.code;
    // var errorMessage = error.message;

    if(emailLogin !== emailReg) return console.error('El email es incorrecto');

    if(passLogin !== emailLogin) return console.error('La constraseña es incorrecta');
  });
}

/*Mi Perfil de usuario */

$$(document).on('page:init', '.page[data-name="perfil"]', function (e) {
  console.info("Carga perfil del usuario");

   // GRACIAS AL SEÑOR, RECIÉN 13:08HS PUDE MOSTRAR EN LOGIN, LA FOTO QUE EL USUARIO ELIJE
   $$('#mi-avatar').attr('src', 'img/' + 'iconos/' + `${avatar}` + '.png');
 
   $$('#btnRegistro').on('click', registro);

   $$('#nomAlumno').html('Nombre: ' + `${datosAlumno.nombre}`);

   $$('#emailAlumno').html('Email: ' + `${datosAlumno.emailReg}`);
});
