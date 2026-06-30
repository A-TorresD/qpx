// PRUEBA//

 // Login Qpx
let inputUsuario, inputPassword, botonLogin;
let enlaceOlvidaste, botonCrearCuenta;
let botonFotoPerfil, botonConfirmarFoto, botonCancelarFoto;
let pfp;

// Video
let captura;
// Estados:
let estadoActual = 'LOGIN';

// Paleta de colores
let colorPrincipal = '#BC4ED8'; 
let colorFondo = '#f0f2f5';     
let colorVerde = '#42b72a';     

// VARIABLES FEED
let scrollY = 0;
let publicaciones = [];
let logInteracciones = []; // Aquí se guardarán las interacciones del usuario
let anchoColumnaFeed;
let xInicioFeed;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Iniciae  cámara
  captura = createCapture(VIDEO);
  captura.hide(); 

  // Feed
  xInicioFeed = width / 2;
  anchoColumnaFeed = width / 2;

  // Publicaciones simuladas 
  publicaciones = [
    {
      id: 1,
      usuario: "Sam Jackson",
      fecha: "Hace 10 min",
      texto: "Revisando detalles del vestuario para el set. Las medidas del drop ya son exactas.",
      likes: 0,
      yPos: 0, // Se calculará dinámicamente
      altoCard: 200
    },
    {
      id: 2,
      usuario: "Benson Music",
      fecha: "Hace 2 horas",
      texto: "La cadena vocal para el nuevo proyecto está terminada. Stems listos para mezcla.",
      likes: 0,
      yPos: 0,
      altoCard: 200
    }
  ];

  // LOGIN FALSO (como mi ex pipipp)
  let anchoFormulario = 350;
  let formX = 5 + width / 2 - anchoFormulario / 2;
  let formY = height / 2 - 50;

  inputUsuario = createInput('');
  inputUsuario.attribute('placeholder', 'Usuario');
  inputUsuario.position(formX + 15, formY + 20);
  inputUsuario.size(anchoFormulario - 30, 45);
  inputUsuario.style('font-size', '16px');
  inputUsuario.style('padding', '10px 15px');
  inputUsuario.style('border', '1px solid #ddd');
  inputUsuario.style('border-radius', '6px');
  inputUsuario.style('box-sizing', 'border-box');
  inputUsuario.style('outline', 'none');

  botonLogin = createButton('Crear cuenta');
  botonLogin.position(formX + 15, formY + 80);
  botonLogin.size(anchoFormulario - 30, 45);
  botonLogin.style('background-color', colorPrincipal); 
  botonLogin.style('color', 'white');
  botonLogin.style('font-size', '20px');
  botonLogin.style('font-weight', 'bold');
  botonLogin.style('border', 'none');
  botonLogin.style('border-radius', '6px');
  botonLogin.style('cursor', 'pointer');
  botonLogin.mousePressed(irAFotoPerfil);

  botonFotoPerfil = createButton('📸');
  botonFotoPerfil.position(formX + 15, formY + 130);
  botonFotoPerfil.size(anchoFormulario - 30, 45);
  botonFotoPerfil.style('background-color', colorPrincipal);
  botonFotoPerfil.style('color', 'white');
  botonFotoPerfil.style('font-size', '20px');
  botonFotoPerfil.style('font-weight', 'bold');
  botonFotoPerfil.style('border', 'none');
  botonFotoPerfil.style('border-radius', '6px');
  botonFotoPerfil.style('cursor', 'pointer');
  botonFotoPerfil.mousePressed(verificarFotoPerfil);

  botonConfirmarFoto = createButton('Confirmar');
  botonConfirmarFoto.position(formX + 15, formY + 190);
  botonConfirmarFoto.size(anchoFormulario - 30, 45);
  botonConfirmarFoto.style('background-color', colorVerde); 
  botonConfirmarFoto.style('color', 'white');
  botonConfirmarFoto.style('font-size', '20px');
  botonConfirmarFoto.style('font-weight', 'bold');
  botonConfirmarFoto.style('border', 'none');
  botonConfirmarFoto.style('border-radius', '6px');
  botonConfirmarFoto.style('cursor', 'pointer');
  botonConfirmarFoto.mousePressed(Colapso);

  botonCancelarFoto = createButton('Intentar de nuevo');
  botonCancelarFoto.position(formX + 15, formY + 250);
  botonCancelarFoto.size(anchoFormulario - 30, 45);
  botonCancelarFoto.style('background-color', '#e74c3c'); 
  botonCancelarFoto.style('color', 'white');
  botonCancelarFoto.style('font-size', '20px');
  botonCancelarFoto.style('font-weight', 'bold');
  botonCancelarFoto.style('border', 'none');
  botonCancelarFoto.style('border-radius', '6px');
  botonCancelarFoto.style('cursor', 'pointer');
}

function draw() {
  botonFotoPerfil.hide();
  botonConfirmarFoto.hide();
  botonCancelarFoto.hide();
  if (estadoActual === 'LOGIN') {
    Login();
  } else if (estadoActual === 'FOTOPERFIL') {
    fotoPerfil();
  } else if (estadoActual === 'VERIFICARFOTOPERFIL') {
    confirmarFoto();
  } else if (estadoActual === 'COLAPSO') {
    InterfazDividida();
    DibujarFeedSimulado();
  }
}


// LOGIN
function Login() {
  background(colorFondo); 
  let anchoFormulario = 350;
  let altoFormulario = 130;
  let formX = width / 2 - anchoFormulario / 2;
  let formY = height / 2 - 50;

  textAlign(CENTER, CENTER);
  textSize(60);
  fill(colorPrincipal); 
  textStyle(BOLD);
  text("Qpx", width / 2, formY - 60);
  textStyle(NORMAL);

  fill(255);
  stroke(220);
  strokeWeight(1);
  rect(formX, formY, anchoFormulario, altoFormulario, 8); 
}

function irAFotoPerfil() {
  if (inputUsuario) inputUsuario.hide();
  if (botonLogin) botonLogin.hide();
  estadoActual = 'FOTOPERFIL';
  registrarEvento('SISTEMA', 'CREAR_CUENTA', 'El usuario inició el flujo para crear cuenta.');
}

// FOTO PERFIL
function fotoPerfil() {
  background(colorFondo);
  if (inputUsuario) inputUsuario.hide();
  if (botonLogin) botonLogin.hide();

  fill(colorPrincipal);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text('Foto de perfil', width / 2, 40);
  textStyle(NORMAL);

  let previewW = min(width - 120, 500);
  let previewH = previewW * 0.75;
  let previewX = (width - previewW) / 2;
  let previewY = 90;

  if (captura && captura.width > 0) {
    image(captura, previewX, previewY, previewW, previewH);
  } else {
    fill(255);
    rect(previewX, previewY, previewW, previewH, 16);
    fill(120);
    textSize(18);
    text('Cámara no disponible', width / 2, previewY + previewH / 2);
  }

  botonFotoPerfil.position(width / 2 - 80, previewY + previewH + 25);
  botonFotoPerfil.size(160, 45);
  botonFotoPerfil.show();

  botonConfirmarFoto.position(width / 2 - 80, previewY + previewH + 85);
  botonConfirmarFoto.size(160, 45);
  botonConfirmarFoto.show();

  botonCancelarFoto.position(width / 2 - 80, previewY + previewH + 145);
  botonCancelarFoto.size(160, 45);
  botonCancelarFoto.show();
}

function verificarFotoPerfil() {
  // Aquí podrías agregar lógica para verificar si la foto de perfil es válida
  // Por ahora, simplemente pasamos al estado COLAPSO
  //estadoActual = 'COLAPSO';
}

  function Colapso() {
  // Registrar el inicio de la simulación
  registrarEvento("SISTEMA", "INICIO_SESION", "El usuario ha ingresado a la interfaz dividida.");
  estadoActual = 'COLAPSO';
}

function InterfazDividida() {
  background(240); 
  fill(0); //Backdrop de la cámara
  rect(0, 0, width/2, height);
  let mitadAncho = width / 2;

  // Cámara de vigilancia (Izquierda)
  let aspectRatio = captura.width / captura.height;
  let camAncho = min(mitadAncho, height * aspectRatio);
  let camAlto = camAncho / aspectRatio;
  let yCamara = (height - camAlto) / 2;
  image(captura, 0, yCamara, camAncho, camAlto);

  // Logo Qpx sobre el video
  fill(255); 
  noStroke();
  textSize(28);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text("Qpx! 🎥", 20, 20);
  textStyle(NORMAL);

  // División central
  stroke(200); 
  strokeWeight(2);
  line(mitadAncho, 0, mitadAncho, height);

  // Feed (Derecha)
  noStroke();
  fill(colorPrincipal);
  rect(mitadAncho, 0, mitadAncho, 60);

  fill(255);
  ellipse(mitadAncho + 40, 30, 30, 30);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(20);
  text("Amigos", mitadAncho + 65, 30);

  fill(255);
  rect(mitadAncho + 150, 15, mitadAncho - 180, 30, 15);

  fill(150); 
  textSize(14);
  text("🔍 Búsqueda", mitadAncho + 165, 30);
  
  fill(120);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("buscar / amigos", mitadAncho + 20, height - 20);
}

//FUNCION PUBLICACIONES (POST/NOTICIAS)
function DibujarFeedSimulado() {
  let yInicial = 80 + scrollY; // Margen debajo de la barra superior + scroll
  let anchoCard = anchoColumnaFeed - 40;

  for (let i = 0; i < publicaciones.length; i++) {
    let post = publicaciones[i];
    let cardX = xInicioFeed + 20;
    let cardY = yInicial;
    post.yPos = cardY; //detectar clics

    // Post
    fill(255);
    stroke(220);
    strokeWeight(1);
    rect(cardX, cardY, anchoCard, post.altoCard, 8);

    // User fehca//
    noStroke();
    fill(50);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(post.usuario, cardX + 20, cardY + 15);
    
    fill(120);
    textSize(11);
    textStyle(NORMAL);
    text(post.fecha, cardX + 20, cardY + 35);

    // Texto del post
    fill(30);
    textSize(13);
    text(post.texto, cardX + 20, cardY + 60, anchoCard - 40);

    // Like button
    let btnX = cardX + 20;
    let btnY = cardY + post.altoCard - 40;
    let btnAncho = 90;
    let btnAlto = 30;

    // Detectar si el mouse está sobre el botón 
    if (mouseX > btnX && mouseX < btnX + btnAncho && mouseY > btnY && mouseY < btnY + btnAlto) {
      fill(240);
    } else {
      fill(248);
    }
    
    stroke(200);
    rect(btnX, btnY, btnAncho, btnAlto, 6);

    // Texto del botón e indicador de conteo
    noStroke();
    fill(colorPrincipal);
    textStyle(BOLD);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("👍 Like (" + post.likes + ")", btnX + (btnAncho / 2), btnY + (btnAlto / 2));
    textStyle(NORMAL);

    // Desplazamiento para el siguiente post
    yInicial += post.altoCard + 20;
  }
}

// Clicks//interacción 
function mousePressed() {
  if (estadoActual === 'COLAPSO') {
    let anchoCard = anchoColumnaFeed - 40;

    for (let i = 0; i < publicaciones.length; i++) {
      let post = publicaciones[i];
      let cardX = xInicioFeed + 20;
      
      // Coordenadas exactas del botón de Like del post actual
      let btnX = cardX + 20;
      let btnY = post.yPos + post.altoCard - 40;
      let btnAncho = 90;
      let btnAlto = 30;

      // Verificar si el clic ocurrió dentro del botón
      if (mouseX > btnX && mouseX < btnX + btnAncho && mouseY > btnY && mouseY < btnY + btnAlto) {
        post.likes++;
        // Registrar la interacción con fines de estudio(oilo )
        registrarEvento(post.usuario, "CLICK_LIKE", "El usuario reaccionó a la publicación de " + post.usuario);
      }
    }
  }
}

// SCROLL
function mouseWheel(event) {
  if (estadoActual === 'COLAPSO') {
    scrollY -= event.delta;
    // Limitar el scroll para evitar que el contenido desaparezca por completo
    scrollY = min(0, scrollY); 
    
    // Registrar el comportamiento de navegación de manera discreta
    if (frameCount % 60 === 0) { // Evita saturar el log por cada micro-scroll
      registrarEvento("SISTEMA", "SCROLL", "El usuario está navegando por el feed. ScrollY: " + scrollY);
    }
  }
}

//(LOGGING 
function registrarEvento(autorPost, tipoAccion, detalles) {
  let evento = {
    timestamp: nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2) + "." + nf(millis() % 1000, 3),
    idPostAutor: autorPost,
    accion: tipoAccion,
    descripcion: detalles
  };
  logInteracciones.push(evento);
  print("Evento registrado: ", evento); // Visualización en consola de desarrollo
}

//EXPORTAR DATOS
function keyPressed() {
  // Al presionar la letra 'S' o 's', se descarga el archivo con los resultados
  if (key === 's' || key === 'S') {
    if (logInteracciones.length > 0) {
      saveJSON(logInteracciones, 'estudio_interacciones_Qpx.json');
      print("Sistemas: Datos del estudio exportados exitosamente.");
    } else {
      print("Sistemas: No hay interacciones registradas para exportar aún.");
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  xInicioFeed = width / 2;
  anchoColumnaFeed = width / 2;
  
  if (estadoActual === 'LOGIN') {
    let anchoFormulario = 350;
    let formX = width / 2 - anchoFormulario / 2;
    let formY = height / 2 - 50;

    inputUsuario.position(formX + 15, formY + 20);
    botonLogin.position(formX + 15, formY + 140);
  }
}