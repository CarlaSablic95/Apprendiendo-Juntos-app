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
      { path: '/panel-admin/', url: 'panel-admin.html' },
      { path: '/carga-materias/', url: 'carga-materias.html'},
      { path: '/materias/', url: 'materias.html'},
]
 // ... other parameters
  });

  let mainView = app.views.create('.view-main');

  // db hace la conexión a la BD
 let db = firebase.firestore();

 // creo la coleccion de usuarios
 let colUsuarios = db.collection("usuarios");

  // creo la coleccion de materias
  let colMaterias = db.collection("materias");

 // Email y pass del registro, las hago variables globales para poder usarlas en el login, y así compararlas
 let emailReg = "",
     passReg = "",
     avatar = "",
     datosUsuario = "",
     nombre = "",
     emailLogin = "",
     isAdmin = true,
     materia = "";

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
    console.log("Carga index");

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

// REGISTRO

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('#btnRegistro').on('click', registro);
  $$('.fotoPerfil').on('click', function() { elegirAvatar(this.id)})
})

  function elegirAvatar(id) {
    avatar = id;
    $$('#miAvatar').attr('src', 'img/iconos/' + avatar + '.png');
    $$('#avatar').attr('src', 'img/iconos/' + avatar + '.png');
}

function registro() { // 14:58hs
  // las variables que guardan los datos del usuario y el objeto que contiene esos datos, debo ponerlos fuera de la función --> firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
 
  let nombre = $$('#nombre').val();
  let emailReg = $$('#emailRegistro').val();
  let passReg = $$('#passRegistro').val();

 let datosUsuario = {
    nombre,
    emailReg,
    passReg
  }

  firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
  .then((userCredential) => {
    // Registrado
    // var user = userCredential.user;

   // Crear la BD de usuarios y agregarle los datos
    colUsuarios.doc('usuario').set(datosUsuario)

    // Si el documento existe, su contenido se sobrescribirá con los datos recién proporcionados, a menos que especifique que los datos deben fusionarse en el documento existente, de la siguiente manera:

  // let nuevosUsuarios = datosUsuario.set({ merge: true,})
  //   return nuevosUsuarios

    .then(function(docRef) {
      console.info(docRef);
      console.info("ID:" + docRef.id);
      // nombre
      console.info('Nombre: ' + datosUsuario.nombre);
      //email
      console.info('Email:' + datosUsuario.emailReg);

      // Llamo a la función que le asigna al usuario, su avatar elegido
      elegirAvatar();
      // pass
      // console.info('Pass: ' + passReg);

      mainView.router.navigate('/login/');
    })
    .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);

    // Valido si el nombre que el usuario ingresa, es válido
      if(!(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/g.test(datosUsuario.nombre))) return console.error(`${datosUsuario.nombre} no es un nombre válido`);

    // Valido si la contraseña que el usuario ingresa, no exceda los 6 caracteres
      if(passReg.length > 6) return console.error("La contraseña no puede exceder los 6 caracteres");

  });
});
}

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
   
   // Una vez que se loguea, si el email es igual al del Admin, que sea redirigido al panel de admin, si no a las materias
   
   (emailLogin !== "carla@gmail.com") 
   ? mainView.router.navigate('/materias/')  
    : mainView.router.navigate('/panel-admin/');
  
  })
  .catch((error) => {
    // var errorCode = error.code;
    // var errorMessage = error.message;

    if(emailLogin !== emailReg) return console.error('El email es incorrecto');

    if(passLogin !== emailLogin) return console.error('La contraseña es incorrecta');
  });
}



/*Mi Perfil de usuario */

$$(document).on('page:init', '.page[data-name="mi-perfil"]', function (e) {

  app.navbar.show('#navBar');
  app.toolbar.show('#toolBar');
  
  console.info("Carga perfil del usuario");
  
  $$('#nomAlumno').html('Nombre: ' + `${datosUsuario.nombre}`);
  
  $$('#emailAlumno').html('Email: ' + `${datosUsuario.emailReg}`);

  elegirAvatar();
});


// PANEL ADMIN

$$(document).on('page:init', '.page[data-name="panel-admin"]', function (e) {
  console.info("Carga panel admin");
  app.navbar.show('#navBar');
  app.toolbar.show('#toolBar');
  alert('Bienvenida Administradora' + datosUsuario.nombre);
});

// CARGA MATERIAS

$$(document).on('page:init', '.page[data-name="carga-materias"]', function (e) {
  
  console.info("Carga formulario de materias");
  app.navbar.show('#navBar');
  app.toolbar.show('#toolBar');
  
  $$('#subirMaterias').on('click', crearMateria);
  
});

// Esta función carga el nombre de la materia y crea la colección de materias
function crearMateria() {
  materia = $$('#nombreMat').val();

  datosMateria = {
    materia
 }
 
 colMaterias.doc('id-materia').set(datosMateria)
 .then(() => {
   console.info("Materia cargada con éxito");
   console.info(`Materia: ` + datosMateria.materia);

  
      // IMPRIMIR CON UN FOR VARIAS TARJETAS

      

  })
  .catch((err) => {
    console.error("Error: " + err);
    if(materia === undefined) return console.error("Debés llenar el campo nombre");
    if(typeof materia !== "string") return console.error(`${nombre} es un nombre inválido`);
  });

  // MATERIAS
  
  $$(document).on('page:init', '.page[data-name="materias"]', function (e) {
  
    app.navbar.show('#navBar');
    app.toolbar.show('#toolBar');
  
    console.info("Carga Materias");
  
    // alerta con un mensaje de éxito
      alert('Bienvenido/a ' + datosUsuario.nombre);

      $$('#nomMat').html(datosMateria.materia);
  });
}


// SUBIR ARCHIVOS AL STORAGE
// CreaR una referencia

// Obtenga una referencia al servicio de almacenamiento, que se utiliza para crear referencias en su depósito de almacenamiento.
// var storage = firebase.storage();

// Crea una referencia de almacenamiento desde nuestro servicio de almacenamiento
// var storageRef = storage.ref();

// Crea una referencia raíz
var storageRef = firebase.storage().ref();

// Crea una referencia a 'images / mountains.jpg'
var icono = storageRef.child('img/iconos/manzana.png');

// Sube el archivo y los metadatos

var subirIcono = storageRef.child('img/iconos/manzana.png').put(file);