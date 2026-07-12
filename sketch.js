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
let logInteracciones = []; 
let anchoColumnaFeed;
let xInicioFeed;

// NUEVAS VARIABLES: Métricas para contabilizar atención y reacciones
let metricasSecciones = {
  memes: { atencion: 0, reacciones: 0 },
  publicidad: { atencion: 0, reacciones: 0 },
  variedades: { atencion: 0, reacciones: 0 },
  seguridad: { atencion: 0, reacciones: 0 } 
};

// ALGORITMO DE TIEMPO Y PROPAGACIÓN
let tiempoInicioSimulacion = 0;
let triggerSeguridadActivado = false;
let porcentajeSeguridad = 0; 
let primeraNoticiaInyectada = false;
let ultimoIntentoInyeccion = 0;

// POOLS PROCEDIMENTALES
let poolSeguridad = [];
let poolMemes = [];
let poolPublicidad = [];
let poolVariedades = [];

// AVATAR E HISTORIAL DE VIGILANCIA CAPTURADA
let fotoPerfilImg = null;
let pgAvatar = null;
let fotosHistorial = []; 
let slideWrapped = 0; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  captura = createCapture(VIDEO);
  captura.hide(); 

  xInicioFeed = width / 2;
  anchoColumnaFeed = width / 2;

  inicializarBancosContenido();

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
  botonCancelarFoto.style('font-weight', 'bold');
  botonCancelarFoto.style('font-size', '20px');
  botonCancelarFoto.style('border', 'none');
  botonCancelarFoto.style('border-radius', '6px');
  botonCancelarFoto.style('cursor', 'pointer');
}

function draw() {
  botonFotoPerfil.hide();
  botonConfirmarFoto.hide();
  botonCancelarFoto.hide();

  if (estadoActual === 'COLAPSO') {
    if (mouseX < width / 2) {
      noCursor(); 
    } else {
      cursor(ARROW); 
    }
  } else {
    cursor(ARROW); 
  }

  if (estadoActual === 'LOGIN') {
    Login();
  } else if (estadoActual === 'FOTOPERFIL') {
    fotoPerfil();
  } else if (estadoActual === 'VERIFICARFOTOPERFIL') {
    confirmarFoto();
  } else if (estadoActual === 'COLAPSO') {
    InterfazDividida();
    feedQpx(); 
    actualizarAlgoritmoSeguridad(); 
  } else if (estadoActual === 'WRAPPED') {
    dibujarWrapped(); 
  }
}

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
}

function Colapso() {
  registrarEvento("SISTEMA", "INICIO_SESION", "El usuario ha ingresado a la interfaz dividida.");
  
  if (captura && captura.width > 0) {
    fotoPerfilImg = captura.get(captura.width/4, captura.height/4, captura.height/2, captura.height/2); 
    pgAvatar = createGraphics(30, 30);
    pgAvatar.ellipse(15, 15, 30, 30);
    pgAvatar.canvas.getContext('2d').clip(); 
    pgAvatar.image(fotoPerfilImg, 0, 0, 30, 30);
  }

  estadoActual = 'COLAPSO';
  tiempoInicioSimulacion = millis();
  ultimoIntentoInyeccion = millis();
  cargarMasPosts(10);
}
function InterfazDividida() {
  background(240); 
  fill(0); 
  rect(0, 0, width/2, height);
  let mitadAncho = width / 2;

  let aspectRatio = captura.width / captura.height;
  let camAncho = min(mitadAncho, height * aspectRatio);
  let camAlto = camAncho / aspectRatio;
  let yCamara = (height - camAlto) / 2;
  image(captura, 0, yCamara, camAncho, camAlto);

  fill(255); 
  noStroke();
  textSize(28);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text("Qpx! 🎥", 20, 20);
  textStyle(NORMAL);

  stroke(200); 
  strokeWeight(2);
  line(mitadAncho, 0, mitadAncho, height);

  noStroke();
  fill(colorPrincipal);
  rect(mitadAncho, 0, mitadAncho, 60);

  if (pgAvatar) {
    image(pgAvatar, mitadAncho + 25, 15);
  } else {
    fill(255);
    ellipse(mitadAncho + 40, 30, 30, 30);
  }

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

  fill(160);
  textSize(11);
  textAlign(RIGHT, BOTTOM);
  let restante = max(0, floor((300000 - (millis() - tiempoInicioSimulacion)) / 1000));
  let txtMetricas = "Tiempo restante: " + restante + "s | Probabilidad Alertas: " + porcentajeSeguridad + "% | Trigger Seguridad: " + (triggerSeguridadActivado ? "ACTIVO" : "ESPERA");
  text(txtMetricas, width - 20, height - 20);
}

function actualizarAlgoritmoSeguridad() {
  let tiempoTranscurrido = millis() - tiempoInicioSimulacion;

  if (tiempoTranscurrido >= 300000) {
    estadoActual = 'WRAPPED';
    registrarEvento("SISTEMA", "FIN_TIEMPO", "La sesión de 5 minutos concluyó. Forzando despliegue de Wrapped.");
    return;
  }

  if (!triggerSeguridadActivado && !primeraNoticiaInyectada && (millis() - ultimoIntentoInyeccion >= 60000)) {
    inyectarPostAlertaUrgente();
  }

  if (triggerSeguridadActivado) {
    let minutosActivo = floor(tiempoTranscurrido / 60000);
    porcentajeSeguridad = min(80, 10 + (minutosActivo * 10)); 
  }
}

function inyectarPostAlertaUrgente() {
  if (poolSeguridad.length > 0) {
    let postMalo = poolSeguridad.shift();
    postMalo.likes = floor(random(50, 200));
    publicaciones.push(postMalo);
    primeraNoticiaInyectada = true;
    registrarEvento("ALGORITMO", "INYECCION_FORZADA", "Inyectando alerta trampa de seguridad tras cumplirse el intervalo de tiempo.");
  }
}

function cargarMasPosts(cuantos) {
  for (let i = 0; i < cuantos; i++) {
    let postGenerado;
    let r = random(100);

    if (r < porcentajeSeguridad && poolSeguridad.length > 0) {
      postGenerado = poolSeguridad.shift();
    } else {
      let opcionesDisponibles = [];
      if (poolMemes.length > 0) opcionesDisponibles.push('memes');
      if (poolVariedades.length > 0) opcionesDisponibles.push('variedades');
      if (poolPublicidad.length > 0) opcionesDisponibles.push('publicidad');
      
      let seleccion = random(opcionesDisponibles);
      if (seleccion === 'memes') postGenerado = poolMemes.shift();
      else if (seleccion === 'variedades') postGenerado = poolVariedades.shift();
      else postGenerado = poolPublicidad.shift();
    }

    if (postGenerado) {
      publicaciones.push(postGenerado);
    }
  }
}

function feedQpx() { 
  let yInicial = 80 + scrollY; 
  let anchoCard = anchoColumnaFeed - 40;

  for (let i = 0; i < publicaciones.length; i++) {
    let post = publicaciones[i];
    let cardX = xInicioFeed + 20;
    let cardY = yInicial;
    post.yPos = cardY; 

    if (cardY + post.altoCard > 0 && cardY < height) {
      fill(255);
      stroke(220);
      strokeWeight(1);
      rect(cardX, cardY, anchoCard, post.altoCard, 8);

      let mouseSobreCard = mouseX > cardX && mouseX < cardX + anchoCard && mouseY > cardY && mouseY < cardY + post.altoCard;
      if (mouseSobreCard) {
        metricasSecciones[post.categoria].atencion++;
        
        if (post.categoria === 'seguridad') {
          post.hoverFrames = (post.hoverFrames || 0) + 1;
          if (post.hoverFrames >= 300 && !triggerSeguridadActivado) {
            triggerSeguridadActivado = true;
            porcentajeSeguridad = 20; 
            registrarEvento("ALGORITMO", "TRIGGER_ATENCION_PROLONGADA", "Activando escalada.");
          }
        }

        if (metricasSecciones[post.categoria].atencion % 60 === 0) {
          registrarEvento("SISTEMA", "ATENCION_" + post.categoria.toUpperCase(), "Atención en sección.");
        }
      }

      if (post.categoria === 'seguridad' && primeraNoticiaInyectada && !triggerSeguridadActivado && (cardY + post.altoCard < 0)) {
        if ((post.hoverFrames || 0) < 300 && post.miReaccion === "") {
          primeraNoticiaInyectada = false; 
          ultimoIntentoInyeccion = millis();
          registrarEvento("ALGORITMO", "POST_IGNORADO", "Usuario ignoró la alerta.");
        }
      }

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

      fill(30);
      textSize(13);
      textAlign(LEFT, TOP);
      text(post.texto, cardX + 20, cardY + 60, anchoCard - 40);

      fill(110);
      textSize(12);
      textAlign(LEFT, TOP);
      let textoGlobalReacciones = post.reaccionesFicticias;
      if (post.usuarioYaReacciono) {
        textoGlobalReacciones += "  (Tú reaccionaste)";
      }
      text(textoGlobalReacciones, cardX + 20, cardY + post.altoCard - 75);

      let btnX = cardX + 20;
      let btnY = cardY + post.altoCard - 40;
      let btnAncho = 150; 
      let btnAlto = 30;

      let hoverBoton = mouseX > btnX && mouseX < btnX + btnAncho && mouseY > btnY && mouseY < btnY + btnAlto;
      let zonaExpandida = mouseX > btnX && mouseX < btnX + 220 && mouseY > btnY - 50 && mouseY < btnY + btnAlto;

      if (hoverBoton || zonaExpandida) { fill(240); } else { fill(248); }
      
      stroke(200);
      rect(btnX, btnY, btnAncho, btnAlto, 6);

      noStroke();
      fill(colorPrincipal);
      textStyle(BOLD);
      textSize(12);
      textAlign(CENTER, CENTER);
      
      let textoReaccion = post.miReaccion !== "" ? post.miReaccion : "👍 Me late";
      text(textoReaccion + " (" + post.likes + ")", btnX + (btnAncho / 2), btnY + (btnAlto / 2));
      textStyle(NORMAL);

      if (zonaExpandida) {
        let panelX = btnX;
        let panelY = btnY - 45;
        let opciones = [
          { emoji: '👍', nombre: 'Me late' },       
          { emoji: '❤️', nombre: 'Me encanta' },    
          { emoji: '😂', nombre: 'Me divierte' },   
          { emoji: '😲', nombre: 'Que pedo' },      
          { emoji: '😢', nombre: 'Achicopalado' },  
          { emoji: '😡', nombre: 'Me encabrona' }   
        ];

        fill(255);
        stroke(200);
        rect(panelX, panelY, 210, 40, 20);

        for (let j = 0; j < opciones.length; j++) {
          let emojiX = panelX + 15 + (j * 32);
          let emojiY = panelY + 20;
          let areaEmoji = mouseX > emojiX - 12 && mouseX < emojiX + 20 && mouseY > panelY && mouseY < panelY + 40;

          textSize(areaEmoji ? 24 : 18); 
          textAlign(CENTER, CENTER);
          text(opciones[j].emoji, emojiX, emojiY - (areaEmoji ? 4 : 0));

          if (areaEmoji) {
            fill(0, 150);
            noStroke();
            rect(emojiX - 35, panelY - 25, 70, 20, 5);
            fill(255);
            textSize(10);
            text(opciones[j].nombre, emojiX, panelY - 15);
          }
        }
      }
    }

    yInicial += post.altoCard + 20;
  }

  if (yInicial < height + 600) {
    cargarMasPosts(5);
  }
}
function mousePressed() {
  if (estadoActual === 'WRAPPED') {
    slideWrapped = min(5, slideWrapped + 1);
    return;
  }

  if (estadoActual === 'COLAPSO') {
    for (let i = 0; i < publicaciones.length; i++) {
      let post = publicaciones[i];
      let cardX = xInicioFeed + 20;
      
      let btnX = cardX + 20;
      let btnY = post.yPos + post.altoCard - 40;
      let btnAncho = 150;
      let btnAlto = 30;

      let opciones = [
        { emoji: '👍', nombre: 'Me late' },
        { emoji: '❤️', nombre: 'Me encanta' },
        { emoji: '😂', nombre: 'Me divierte' },
        { emoji: '😲', nombre: 'Que pedo' },
        { emoji: '😢', nombre: 'Achicopalado' },
        { emoji: '😡', nombre: 'Me encabrona' }
      ];

      let enPanel = mouseX > btnX && mouseX < btnX + 210 && mouseY > btnY - 45 && mouseY < btnY - 5;
      let enBoton = mouseX > btnX && mouseX < btnX + btnAncho && mouseY > btnY && mouseY < btnY + btnAlto;

      if (enPanel) {
        for (let j = 0; j < opciones.length; j++) {
          let emojiX = btnX + 15 + (j * 32);
          if (mouseX > emojiX - 12 && mouseX < emojiX + 20) {
            
            if (!post.usuarioYaReacciono) {
              post.likes++;
              metricasSecciones[post.categoria].reacciones++;
              
              if (post.categoria === 'seguridad' && !triggerSeguridadActivado) {
                triggerSeguridadActivado = true;
                porcentajeSeguridad = 20;
                registrarEvento("ALGORITMO", "TRIGGER_REACCION_DIRECTA", "Activando propagación.");
              }
            }
            
            post.miReaccion = opciones[j].emoji + " " + opciones[j].nombre;
            post.usuarioYaReacciono = true;

            capturarFotoEspia();
            registrarEvento(post.usuario, "REACCION_" + opciones[j].nombre.toUpperCase().replace(" ", "_"), "Reacción.");
          }
        }
      } else if (enBoton) {
        if (!post.usuarioYaReacciono) {
          post.miReaccion = "👍 Me late";
          post.likes++;
          post.usuarioYaReacciono = true;
          
          metricasSecciones[post.categoria].reacciones++;

          if (post.categoria === 'seguridad' && !triggerSeguridadActivado) {
            triggerSeguridadActivado = true;
            porcentajeSeguridad = 20;
          }

          capturarFotoEspia();
          registrarEvento(post.usuario, "CLICK_MELATE", "Reacción Like.");
        } else {
          post.miReaccion = "";
          post.likes = max(0, post.likes - 1);
          post.usuarioYaReacciono = false;
          
          metricasSecciones[post.categoria].reacciones = max(0, metricasSecciones[post.categoria].reacciones - 1);
          registrarEvento(post.usuario, "QUITAR_REACCION", "Quitó reacción.");
        }
      }
    }
  }
}

function capturarFotoEspia() {
  if (captura && captura.width > 0 && fotosHistorial.length < 4) {
    let snap = captura.get(0, 0, captura.width, captura.height);
    fotosHistorial.push(snap);
  }
}

function dibujarWrapped() {
  background(15, 15, 15); 
  
  let catMax = "memes";
  let maxAtencion = -1;
  let keys = Object.keys(metricasSecciones);
  for(let i=0; i<keys.length; i++) {
    if(metricasSecciones[keys[i]].atencion > maxAtencion) {
      maxAtencion = metricasSecciones[keys[i]].atencion;
      catMax = keys[i];
    }
  }

  textAlign(CENTER, CENTER);
  noStroke();

  if (slideWrapped === 0) {
    fill(colorPrincipal);
    textSize(42);
    textStyle(BOLD);
    text("Tu Qpx Wrapped", width / 2, height / 2 - 40);
    fill(255);
    textSize(20);
    textStyle(NORMAL);
    text("Tus últimos 5 minutos analizados al microscopio.", width / 2, height / 2 + 30);
  } 
  else if (slideWrapped === 1) {
    fill(colorVerde);
    textSize(24);
    textStyle(BOLD);
    text("BUSCANDO REFUGIO EMOCIONAL", width / 2, height / 2 - 100);
    fill(255);
    textSize(32);
    text("Pasaste la mayor parte del tiempo leyendo la sección de:", width / 2, height / 2 - 20);
    fill(colorPrincipal);
    textSize(48);
    textStyle(BOLD);
    text(catMax.toUpperCase(), width / 2, height / 2 + 50);
    fill(180);
    textSize(16);
    textStyle(NORMAL);
    text("Tiempo total acumulado: " + floor(maxAtencion / 60) + " segundos.", width / 2, height / 2 + 120);
  } 
  else if (slideWrapped === 2) {
    let totalReacciones = metricasSecciones.memes.reacciones + metricasSecciones.seguridad.reacciones + metricasSecciones.publicidad.reacciones + metricasSecciones.variedades.reacciones;
    fill('#ffc107');
    textSize(24);
    textStyle(BOLD);
    text("EXPRESIÓN SIN FILTROS", width / 2, height / 2 - 80);
    fill(255);
    textSize(32);
    textStyle(NORMAL);
    text("Interactuaste activamente con la plataforma.", width / 2, height / 2 - 10);
    textSize(22);
    fill(200);
    text("Hiciste un total de " + totalReacciones + " reacciones directas.", width / 2, height / 2 + 40);
    text("Cada una de ellas entrenó directamente a tu feed personalizado.", width / 2, height / 2 + 80);
  } 
  else if (slideWrapped === 3) {
    fill('#e74c3c');
    textSize(26);
    textStyle(BOLD);
    text("REVELACIÓN DEL ALGORITMO", width / 2, height / 2 - 120);
    fill(255);
    textSize(22);
    textStyle(NORMAL);
    
    if (triggerSeguridadActivado) {
      text("El algoritmo detectó tu fijación en las noticias de SEGURIDAD.", width / 2, height / 2 - 50);
      text("Como respuesta, la frecuencia de alertas peligrosas subió a un " + porcentajeSeguridad + "%.", width / 2, height / 2);
      fill('#e74c3c');
      textSize(26);
      textStyle(BOLD);
      text("Moldeamos tu percepción de la realidad basándonos en tu interés.", width / 2, height / 2 + 70);
    } else {
      text("Intentamos inyectar alertas de seguridad para medir tu respuesta al miedo,", width / 2, height / 2 - 50);
      text("pero decidiste ignorar las advertencias y continuar navegando.", width / 2, height / 2);
      fill(colorVerde);
      textSize(26);
      textStyle(BOLD);
      text("Mantuviste un comportamiento inmune a la radicalización forzada.", width / 2, height / 2 + 70);
    }
  } 
  else if (slideWrapped === 4) {
    fill(255);
    textSize(24);
    textStyle(BOLD);
    text("TE OBSERVAMOS DE CERCA", width / 2, 40);
    textSize(16);
    textStyle(NORMAL);
    fill(180);
    text("Capturas discretas tomadas por la cámara web mientras reaccionabas:", width / 2, 70);

    if (fotosHistorial.length > 0) {
      let gridW = 200;
      let gridH = 150;
      let startX = width / 2 - gridW - 15;
      let startY = height / 2 - gridH - 10;

      for (let k = 0; k < 4; k++) {
        let xPos = startX + (k % 2) * (gridW + 30);
        let yPos = startY + floor(k / 2) * (gridH + 20);
        
        fill(40);
        rect(xPos, yPos, gridW, gridH, 8); 
        
        if (k < fotosHistorial.length) {
          image(fotosHistorial[k], xPos, yPos, gridW, gridH);
        } else {
          fill(100);
          textSize(12);
          text("[Sin interacción registrada]", xPos + gridW/2, yPos + gridH/2);
        }
      }
    } else {
      fill(120);
      text("[No se registraron expresiones; la cámara no generó capturas reactivas]", width / 2, height / 2);
    }
  }
  else if (slideWrapped === 5) {
    fill(colorPrincipal);
    textSize(36);
    textStyle(BOLD);
    text("Fin del Experimento Qpx", width / 2, height / 2 - 50);
    fill(255);
    textSize(18);
    textStyle(NORMAL);
    text("Gracias por formar parte del análisis conductual interactivo.", width / 2, height / 2 + 10);
    fill(colorVerde);
    textStyle(BOLD);
    text("Presiona la tecla 'S' para exportar tu informe analítico completo en JSON.", width / 2, height / 2 + 60);
  }

  if (slideWrapped < 5) {
    fill(80);
    textSize(14);
    textStyle(NORMAL);
    text("Haz clic en cualquier parte de la pantalla para continuar [ > ]", width / 2, height - 40);
  }
}

function mouseWheel(event) {
  if (estadoActual === 'COLAPSO') {
    if (mouseX > width / 2) {
      scrollY -= event.delta;
      let limiteInferior = -(publicaciones.length * 240 - height + 100);
      scrollY = constrain(scrollY, limiteInferior, 0); 
      
      if (frameCount % 60 === 0) { 
        registrarEvento("SISTEMA", "SCROLL", "El usuario está navegando por el feed. ScrollY: " + scrollY);
      }
    }
  }
  return false;
}

function registrarEvento(autorPost, tipoAccion, detalles) {
  let evento = {
    timestamp: nf(hour(), 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2) + "." + nf(millis() % 1000, 3),
    idPostAutor: autorPost,
    accion: tipoAccion,
    descripcion: detalles
  };
  logInteracciones.push(evento);
  print("Evento registrado: ", evento); 
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    if (logInteracciones.length > 0 || metricasSecciones.seguridad.atencion > 0) {
      let datosEstudio = {
        resumen_metricas_secciones: metricasSecciones,
        log_cronologico_eventos: logInteracciones
      };
      saveJSON(datosEstudio, 'estudio_interacciones_Qpx.json');
      print("Sistemas: Datos del estudio exportados.");
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

function inicializarBancosContenido() {
  let usuarios = ["Sam Jackson", "Benson Music", "p5_Programmer_99", "Centro Seguridad", "Qpx Sponsored", "Sistemas_Admin", "Ingeniero_Mx", "Anon_Qpx", "Cyber_Watch", "Dev_Gamer"];
  let tiempos = ["Hace 2 min", "Hace 10 min", "Hace 45 min", "Hace 1 hora", "Hace 2 horas", "Hace 5 horas", "Hace 1 día"];
  
  for(let i=0; i<200; i++) {
    poolSeguridad.push({
      categoria: "seguridad", usuario: "Centro de Seguridad Qpx", fecha: random(tiempos),
      texto: "ALERTA S-0" + i + ": Intento de vulneración detectado en nodos perimetrales bajo cifrado de red central.",
      likes: floor(random(100, 300)), reaccionesFicticias: "👍 110  •  😲 84  •  😡 12", usuarioYaReacciono: false, miReaccion: "", altoCard: 220
    });
    poolMemes.push({
      categoria: "memes", usuario: random(usuarios), fecha: random(tiempos),
      texto: "Meme #" + i + ": Yo viendo cómo mi código funciona después de borrar una línea al azar que parecía inservible.",
      likes: floor(random(300, 600)), reaccionesFicticias: "😂 450  •  👍 120  •  ❤️ 14", usuarioYaReacciono: false, miReaccion: "", altoCard: 220
    });
    poolPublicidad.push({
      categoria: "publicidad", usuario: random(usuarios) + " Patrocinado", fecha: "Patrocinado",
      texto: "Anuncio publicitario: Protege tus sketches de p5 con el nuevo sistema cifrado Qpx Cloud. 50% de descuento.",
      likes: floor(random(5, 40)), reaccionesFicticias: "👍 20  •  ❤️ 4", usuarioYaReacciono: false, miReaccion: "", altoCard: 220
    });
    poolVariedades.push({
      categoria: "variedades", usuario: "Benson Music", fecha: random(tiempos),
      texto: "Track #" + i + ": La cadena vocal para el nuevo proyecto de mezcla estéreo quedó terminada hoy por la tarde.",
      likes: floor(random(150, 400)), reaccionesFicticias: "❤️ 200  •  👍 180", usuarioYaReacciono: false, miReaccion: "", altoCard: 220
    });
  }
}
