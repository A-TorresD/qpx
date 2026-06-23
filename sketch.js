// Login Qpx
let inputUsuario, inputPassword, botonLogin;
let enlaceOlvidaste, botonCrearCuenta;

// Video
let captura;
// estados:
let estadoActual = 'LOGIN';

// Paleta de colores
let colorPrincipal = '#BC4ED8'; 
let colorFondo = '#f0f2f5';     
let colorVerde = '#42b72a';     

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Inicializar la cámara de vigilancia
  captura = createCapture(VIDEO);
  captura.hide(); 

  //LOGIN FALSO
  let anchoFormulario = 350;
  let formX = width / 2 - anchoFormulario / 2;
  let formY = height / 2 - 50;

  inputUsuario = createInput('');
  inputUsuario.attribute('placeholder', 'Correo electrónico o número de teléfono');
  inputUsuario.position(formX + 15, formY + 20);
  inputUsuario.size(anchoFormulario - 30, 45);
  inputUsuario.style('font-size', '16px');
  inputUsuario.style('padding', '10px 15px');
  inputUsuario.style('border', '1px solid #ddd');
  inputUsuario.style('border-radius', '6px');
  inputUsuario.style('box-sizing', 'border-box');
  inputUsuario.style('outline', 'none');

  inputPassword = createInput('', 'password');
  inputPassword.attribute('placeholder', 'Contraseña');
  inputPassword.position(formX + 15, formY + 80);
  inputPassword.size(anchoFormulario - 30, 45);
  inputPassword.style('font-size', '16px');
  inputPassword.style('padding', '10px 15px');
  inputPassword.style('border', '1px solid #ddd');
  inputPassword.style('border-radius', '6px');
  inputPassword.style('box-sizing', 'border-box');
  inputPassword.style('outline', 'none');

  botonLogin = createButton('Iniciar sesión');
  botonLogin.position(formX + 15, formY + 140);
  botonLogin.size(anchoFormulario - 30, 45);
  botonLogin.style('background-color', colorPrincipal); 
  botonLogin.style('color', 'white');
  botonLogin.style('font-size', '20px');
  botonLogin.style('font-weight', 'bold');
  botonLogin.style('border', 'none');
  botonLogin.style('border-radius', '6px');
  botonLogin.style('cursor', 'pointer');
  botonLogin.mousePressed(Colapso);

  enlaceOlvidaste = createA('#', '¿Olvidaste tu contraseña?');
  enlaceOlvidaste.position(formX + 90, formY + 200);
  enlaceOlvidaste.style('color', colorPrincipal); 
  enlaceOlvidaste.style('font-size', '14px');
  enlaceOlvidaste.style('text-decoration', 'none');
  enlaceOlvidaste.style('font-family', 'sans-serif');

  botonCrearCuenta = createButton('Crear cuenta nueva');
  botonCrearCuenta.position(formX + 85, formY + 250);
  botonCrearCuenta.size(180, 40);
  botonCrearCuenta.style('background-color', colorVerde);
  botonCrearCuenta.style('color', 'white');
  botonCrearCuenta.style('font-size', '16px');
  botonCrearCuenta.style('font-weight', 'bold');
  botonCrearCuenta.style('border', 'none');
  botonCrearCuenta.style('border-radius', '6px');
  botonCrearCuenta.style('cursor', 'pointer');
}

function draw() {
  if (estadoActual === 'LOGIN') {
    Login();
  } else if (estadoActual === 'COLAPSO') {
    InterfazDividida();
  }
}

//FUNCIONES

function Login() {
  background(colorFondo); 
  
  let anchoFormulario = 350;
  let altoFormulario = 310;
  let formX = width / 2 - anchoFormulario / 2;
  let formY = height / 2 - 50;

  // Logotipo Qpx
  textAlign(CENTER, CENTER);
  textSize(60);
  fill(colorPrincipal); 
  textStyle(BOLD);
  text("Qpx", width / 2, formY - 60);
  textStyle(NORMAL);

  // formulario
  fill(255);
  stroke(220);
  strokeWeight(1);
  rect(formX, formY, anchoFormulario, altoFormulario, 8); 

  // Divison
  stroke(220);
  line(formX + 15, formY + 235, formX + anchoFormulario - 15, formY + 235);
}

function Colapso() {
  inputUsuario.hide();
  inputPassword.hide();
  botonLogin.hide();
  enlaceOlvidaste.hide();
  botonCrearCuenta.hide();
  
  estadoActual = 'COLAPSO';
}

function InterfazDividida() {
  //Fondo gris 
  background(240); 

  let mitadAncho = width / 2;

  //CAMARA
  image(captura, 0, 0, mitadAncho, height);

  // Logo Qpx y cámara sobre video
  fill(255); 
  noStroke();
  textSize(28);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text("Qpx! 🎥", 20, 20);
  textStyle(NORMAL);

  //Divison
  stroke(200); 
  strokeWeight(2);
  line(mitadAncho, 0, mitadAncho, height);

  // FEED
  noStroke();
  
  //Barra superior
  fill(colorPrincipal);
  rect(mitadAncho, 0, mitadAncho, 60);

  // Perfil
  fill(255);
  ellipse(mitadAncho + 40, 30, 30, 30);

  // Textos
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(20);
  text("Amigos", mitadAncho + 65, 30);

  //Barra de búsqueda
  fill(255);
  rect(mitadAncho + 150, 15, mitadAncho - 180, 30, 15);

  //Iconoas y texto
  fill(150); 
  textSize(14);
  text("🔍 Búsqueda", mitadAncho + 165, 30);
  fill(120);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("buscar / amigos", mitadAncho + 20, height - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (estadoActual === 'LOGIN') {
    let anchoFormulario = 350;
    let formX = width / 2 - anchoFormulario / 2;
    let formY = height / 2 - 50;

    inputUsuario.position(formX + 15, formY + 20);
    inputPassword.position(formX + 15, formY + 80);
    botonLogin.position(formX + 15, formY + 140);
    enlaceOlvidaste.position(formX + 90, formY + 200);
    botonCrearCuenta.position(formX + 85, formY + 250);
  }
}
