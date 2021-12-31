
var colorBackground = "#CDF0EA";                           
var colorNorth = "#D83A56";                                // Farbe f�r Nordpol
var colorSouth = "#66DE93";                                // Farbe f�r S�dpol
var colorContact = "#c0c0c0";                              // Farbe f�r Kontakte (ohne Strom)
var colorInsulator = "#000000";                            // Farbe f�r Isolator
var	colorCurrent1 = "#ff0000";                             // Farbe f�r Strom (Dr�hte)
var colorCurrent2 = "#ff6060";                             // Farbe f�r Strom (Kontakte)
var colorCurrent3 = "#400000";                             // Farbe f�r Innenseite eines Schleifrings
var	colorField = "#0000ff";                                // Farbe f�r Magnetfeld
var colorMotion = "#000000";                               // Farbe f�r Bewegung
var colorVoltage = "#865439";                              // Farbe f�r Spannung
var colorCrank = "#ECD662";                                // Farbe f�r Kurbel
var colorResistor = "#125D98";                             // Farbe f�r Widerstand

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var PI = Math.PI;                                          // Abk�rzung f�r pi
var PI2 = 2*Math.PI;                                       // Abk�rzung f�r 2 pi
var PIH = Math.PI/2;                                       // Abk�rzung f�r pi/2
var DEG = Math.PI/180;                                     // Winkelgrad
var PHI = 235*DEG;                                         // Azimutwinkel (Bogenma�, zwischen pi und 3 pi/2)  
var THETA = 15*DEG;                                        // H�henwinkel (Bogenma�, zwischen 0 und pi/2)
var HC = 6;                                                // Halbe Seitenl�nge eines Kontakts
var XM1 = 40;                                              // x-Koordinate f�r Hufeisenmagnet
var YM1 = 5, YM2 = 300, YM3 = 400;                         // y-Koordinaten f�r Hufeisenmagnet
var ZM1 = 90, ZM2 = 110;                                   // z-Koordinaten f�r Hufeisenmagnet
var XW1 = 130, XW2 = 140, XW3 = 220, XW4 = 260;            // x-Koordinaten f�r Dr�hte
var YW1 = 0, YW2 = -90, YW3 = -110;                        // y-Koordinaten f�r Dr�hte
var ZW1 = -100, ZW2 = 75;                                  // z-Koordinaten f�r Stromquelle und Dr�hte
var YA1 = 80, YA2 = 200;                                   // y-Koordinaten f�r Leiterschleife
var ZA1 = 8, ZA2 = 30;                                     // z-Koordinaten f�r Leiterschleife
var XC1 = 0;                                               // x-Koordinate f�r Kontakte und Kommutator
var YC1 = 0, YC2 = -40;                                    // y-Koordinate f�r Kontakte und Kommutator
var ZC1 = 36;                                              // z-Koordinaten f�r Kontakte
var YC3 = -80, YC4 = -120;                                 // y-Koordinate f�r Kurbel (Gleichstrom/Wechselstrom)
var XV1 = 120, XV2 = 240;                                  // x-Koordinaten f�r Voltmeter
var YV1 = -90, YV2 = -50;                                  // y-Koordinaten f�r Voltmeter
var ZV1 = -120, ZV2 = 50, ZV3 = -50;                       // z-Koordinaten f�r Voltmeter
var XR1 = 60, XR2 = 100;                                   // x-Koordinaten f�r Verbraucherwiderstand
var U0 = 300, V0 = 250;                                    // Bildschirmkoordinaten des Ursprungs
var INSMAX = 15*DEG;                                       // Winkel f�r Isolator
var THICK = 2;                                             // Liniendicke f�r dicke Linien

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var rb1, rb2;                                              // Radiobuttons
var bu1, bu2;                                              // Schaltkn�pfe
var sl;                                                    // Schieberegler
var op;                                                    // Ausgabefeld
var cb1, cb2, cb3;                                         // Optionsfelder

var genDC;                                                 // Flag f�r Gleichstrom-Generator (mit Kommutator)
var on;                                                    // Flag f�r Bewegung
var timer;                                                 // Timer f�r Animation
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var omega;                                                 // Kreisfrequenz (1/s)
var nPer;                                                  // Maximale Zahl der Perioden
var direction;                                             // Drehrichtung (1 f�r Gegenuhrzeigersinn, -1 f�r Uhrzeigersinn)
var current;                                               // Stromrichtung (0, 1, -1)
var alpha;                                                 // Drehwinkel (Bogenma�)
var sinAlpha, cosAlpha;                                    // Trigonometrische Werte
var uRot, vRot;                                            // Aktuelle Koordinaten f�r rotierende Teile
var vArrows;                                               // Flag: Pfeile f�r Bewegungsrichtung
var bArrows;                                               // Flag: Pfeile f�r Magnetfeld
var iArrows;                                               // Flag: Pfeile f�r induzierten Strom

var a1, a2, b1, b2, b3, c1, c2, c3;                        // Koeffizienten f�r Parallelprojektion


var pgNorth, pgSouth;                                      // Polygone f�r Hufeisenmagnet (Nord- bzw. S�dpol)
var pgContact1;                                            // Polygon f�r oberen Schleifkontakt
var pgContact2;                                            // Polygon f�r unteren Schleifkontakt (mit Kommutator)
var pgContact3;                                            // Polygon f�r unteren Schleifkontakt (ohne Kommutator)
var pointContact1, pointContact2, pointContact3;           // Innere Punkte des Schleifkontakt-Polygone
var aEllipse, bEllipse;                                    // Gro�e und kleine Halbachse der Kommutator-Ellipsen (Pixel)
var deltaEllipse;                                          // Drehwinkel der Kommutator-Ellipsen (Bogenma�)
var pgInsulator1, pgInsulator2;                            // Polygone f�r Isolierschicht des Kommutators 
var pgVoltmeter1;                                          // Polygon f�r Messger�t insgesamt
var pgVoltmeter2;                                          // Polygon f�r Skala des Messger�ts
var pgVoltmeter3;                                          // Polygon f�r unteren Teil des Messger�ts
var pointVoltmeter;                                        // Innerer Punkt f�r Voltmeter


function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  }  
  
// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  rb1 = getElement("rb1a");                                // Radiobutton (ohne Kommutator)
  rb1.checked = true;                                      // Radiobutton zun�chst ausgew�hlt
  getElement("rb1b",text01);                               // Erkl�render Text (ohne Kommutator)
  rb2 = getElement("rb2a");                                // Radiobutton (mit Kommutator)
  getElement("rb2b",text02);                               // Erkl�render Text (mit Kommutator)
  bu1 = getElement("bu1",text03);                          // Schaltknopf (umgekehrte Richtung)
  sl = getElement("sl");                                   // Schieberegler (Drehzahl)
  sl.value = 10;                                           // Anfangszustand (6 U/min) entsprechend T = 10 s
  op = getElement("op");                                   // Ausgabefeld (Drehzahl)
  reactionSlider(false);                                   // Festlegung von omega, Ausgabe der Drehzahl
  bu2 = getElement("bu2",text04[1]);                       // Schaltknopf (Pause/Weiter)
  setButton2State(1);                                      // Anfangszustand des Schaltknopfs
  cb1 = getElement("cb1a");                                // Optionsfeld (Bewegungsrichtung)
  getElement("cb1b",text05);                               // Erkl�render Text (Bewegungsrichtung)
  cb2 = getElement("cb2a");                                // Optionsfeld (Magnetfeld)
  getElement("cb2b",text06);                               // Erkl�render Text (Magnetfeld)
  cb3 = getElement("cb3a");                                // Optionsfeld (Lorentzkraft)
  getElement("cb3b",text07);                               // Erkl�render Text (Lorentzkraft)
  cb1.checked = cb2.checked = cb3.checked = true;          // Optionsfelder zun�chst eingeschaltet
  getElement("translator",translator);                     // �bersetzer
  
  genDC = false;                                           // Zun�chst Wechselspannungs-Generator (ohne Kommutator)
  nPer = 5;                                                // Maximalzahl der Perioden im Diagramm
  t = 0;                                                   // Zeitvariable (s)
  alpha = 0; cosAlpha = 1; sinAlpha = 0;                   // Drehwinkel (Bogenma�), trigonometrische Werte
  vArrows = bArrows = iArrows = true;                      // Zun�chst Pfeile f�r Bewegung, Magnetfeld und Strom      
  direction = 1;                                           // Startwert f�r Drehrichtung (Gegenuhrzeigersinn)
  calcCoeff();                                             // Koeffizienten f�r Projektion berechnen
  initPolygons();                                          // Polygone vorbereiten
  calcEllipse();                                           // Ellipse f�r Kommutator vorbereiten
  startAnimation();                                        // Animation starten
  
  rb1.onclick = reactionRadio;                             // Reaktion auf Radiobutton (ohne Kommutator)
  rb2.onclick = reactionRadio;                             // Reaktion auf Radiobutton (mit Kommutator)
  bu1.onclick = reactionReverse;                           // Reaktion auf Schaltknopf (Umgekehrte Richtung)
  sl.onchange = reactionSlider;                            // Reaktion auf Schieberegler
  sl.onclick = reactionSlider;                             // Reaktion auf Schieberegler  
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Pause/Weiter)
  cb1.onclick = reactionCheckbox;                          // Reaktion auf Optionsfeld (Bewegungsrichtung)
  cb2.onclick = reactionCheckbox;                          // Reaktion auf Optionsfeld (Magnetfeld)
  cb3.onclick = reactionCheckbox;                          // Reaktion auf Optionsfeld (Induktionsstrom)
  
  } 
  
  
function setButton2State (st) {
  bu2.state = st;                                          
  bu2.innerHTML = text04[st];                              
  }
  
  
function switchButton2 () {
  var st = bu2.state;                                      
  if (st == 0) st = 1;                                     
  else st = 3-st;                                          
  setButton2State(st);                                     
  }
  

function reactionRadio () {
  genDC = rb2.checked;                                     // Flag f�r Gleichspannungs-Generator (mit Kommutator)  
  reset();                                                 // Ausgangsstellung
  }
    

function reactionStart () {
  if (bu2.state != 1) t0 = new Date();                     // Falls Animation angeschaltet, neuer Anfangszeitpunkt
  switchButton2();                                         // Zustand des Schaltknopfs �ndern
  if (bu2.state == 1) startAnimation();                    // Entweder Animation fortsetzen ...
  else stopAnimation();                                    // ... oder stoppen
  }
  

function reactionReverse () {
  direction = -direction;                                  // Stromrichtung umkehren
  reset();                                                 // Ausgangsstellung
  }
 
  
function reset () {
  t = 0;                                                   // Zeitvariable
  alpha = 0; cosAlpha = 1; sinAlpha = 0;                   // Drehwinkel, trigonometrische Werte
  if (!on) paint();                                        // Falls Animation abgeschaltet, neu zeichnen
  }
  

function reactionSlider (r) {
  var n = sl.value;                                        // Position des Schiebereglers
  omega = PI2*n/100;                                       // Kreisfrequenz (1/s) entsprechend T = 100 s / n
  var s = (n*0.6).toFixed(1);                              // Zeichenkette f�r Wert der Drehzahl
  s = s.replace(".",decimalSeparator);                     // Eventuell Punkt durch Komma ersetzen
  if (n == 0) s = "0";                                     // Sonderfall 0 (ohne Nachkommastelle)
  op.innerHTML = s+" "+rotationsPerMinute;                 // Drehzahl ausgeben (Umdrehungen pro Minute)
  nPer = Math.floor(n/2);                                  // Maximale Zahl der Perioden
  if (r != false) reset();                                 // Falls gew�nscht, zur�ck in Ausgangsstellung
  }
  

function reactionCheckbox () {
  vArrows = cb1.checked;                                   // Pfeile f�r Bewegungsrichtung
  bArrows = cb2.checked;                                   // Pfeile f�r Magnetfeld
  iArrows = cb3.checked;                                   // Pfeile f�r Induktionsstrom
  if (!on) paint();                                        // Falls Animation abgeschaltet, neu zeichnen
  }
  

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  clearInterval(timer);                                    // Timer deaktivieren
  }
  
//-------------------------------------------------------------------------------------------------


function initPolygons () {
  pgSouth = new Array(8);                                  // Polygon f�r den S�dpol des Hufeisenmagneten
  setPoint(pgSouth,0,-XM1,YM3,0);
  setPoint(pgSouth,1,-XM1,YM3,-ZM2);
  setPoint(pgSouth,2,-XM1,YM1,-ZM2);
  setPoint(pgSouth,3,XM1,YM1,-ZM2);
  setPoint(pgSouth,4,XM1,YM1,-ZM1);
  setPoint(pgSouth,5,XM1,YM2,-ZM1);
  setPoint(pgSouth,6,XM1,YM2,0);
  setPoint(pgSouth,7,-XM1,YM2,0);
  pgNorth = new Array(9);                                  // Polygon f�r den Nordpol des Hufeisenmagneten
  setPoint(pgNorth,0,-XM1,YM3,0);
  setPoint(pgNorth,1,-XM1,YM2,0);
  setPoint(pgNorth,2,XM1,YM2,0);
  var u0 = screenU(-XM1,YM1);
  var v0 = screenV(-XM1,YM1,ZM1);
  var u1 = screenU(-XM1,YM2);
  var v1 = screenV(-XM1,YM2,ZM1);  
  var uS = screenU(XM1,YM2);
  var q = (uS-u0)/(u1-u0);
  var vS = v0+q*(v1-v0);
  pgNorth[3] = {u: uS, v: vS};
  setPoint(pgNorth,4,-XM1,YM1,ZM1);
  setPoint(pgNorth,5,XM1,YM1,ZM1);
  setPoint(pgNorth,6,XM1,YM1,ZM2);
  setPoint(pgNorth,7,XM1,YM3,ZM2);
  setPoint(pgNorth,8,-XM1,YM3,ZM2);
  pgContact1 = new Array(6);                               // Polygon f�r den oberen Schleifkontakt
  pointContact1 = initContact(pgContact1,XC1,YC1,ZC1);     // Zugeh�riger innerer Punkt
  pgContact2 = new Array(6);                               // Polygon f�r den unteren Schleifkontakt (mit Kommutator)
  pointContact2 = initContact(pgContact2,XC1,YC1,-ZC1);    // Zugeh�riger innerer Punkt
  pgContact3 = new Array(6);                               // Polygon f�r den unteren Schleifkontakt (ohne Kommutator)
  pointContact3 = initContact(pgContact3,XC1,YC2,-ZC1);    // Zugeh�riger innerer Punkt
  pgVoltmeter1 = new Array(6);                             // Polygon f�r Voltmeter insgesamt
  pointVoltmeter = initCuboid(pgVoltmeter1,XV1,XV2,YV1,YV2,ZV1,ZV2); // Zugeh�riger innerer Punkt
  pgVoltmeter2 = new Array(4);                             // Polygon f�r Skala des Voltmeters
  setPoint(pgVoltmeter2,0,XV1,YV1,ZV3);
  setPoint(pgVoltmeter2,1,XV2,YV1,ZV3);
  setPoint(pgVoltmeter2,2,XV2,YV1,ZV2);
  setPoint(pgVoltmeter2,3,XV1,YV1,ZV2);
  pgVoltmeter3 = new Array(4);                             // Polygon f�r unteren Teil des Voltmeters
  pgVoltmeter3[0] = pgVoltmeter1[1];
  pgVoltmeter3[1] = pgVoltmeter1[2];
  pgVoltmeter3[2] = pgVoltmeter2[1];
  pgVoltmeter3[3] = pgVoltmeter2[0];
  pgInsulator1 = new Array(20);                            // Polygon f�r Isolierschicht
  pgInsulator2 = new Array(20);                            // Polygon f�r Isolierschicht 
  for (i=0; i<20; i++) {                                   // Vorl�ufige Koordinaten
    pgInsulator1[i] = {u: 0, v: 0};
    pgInsulator2[i] = {u: 0, v: 0};
    }
  }

// Koeffizienten f�r Projektion berechnen:
// Seiteneffekt a1, a2, b1, b2, b3, c1, c2, c3
  
function calcCoeff () {
  a1 = -Math.sin(PHI); a2 = Math.cos(PHI);                 // Vektor (a1, a2, 0) f�r waagrechte Bildschirmkoordinate
  b1 = Math.sin(THETA)*a2; b2 = -Math.sin(THETA)*a1;       // Vektor (b1, b2, b3) f�r senkrechte Bildschirmkoordinate
  b3 = -Math.cos(THETA);
  c1 = a2*b3; c2 = -a1*b3; c3 = a1*b2-a2*b1;               // Vektor (c1, c2, c3) zum Betrachter (Kreuzprodukt)
  }
    
  
function screenU (x, y) {
  return U0+a1*x+a2*y;
  }

      
function screenV (x, y, z) {
  return V0+b1*x+b2*y+b3*z;
  }
  
  
function setPoint (p, i, x, y, z) {
  p[i]= {u: screenU(x,y), v: screenV(x,y,z)};
  }
  
  
function setPointRot (p, i, x, y, z) {
  screenCoordsRot(x,y,z);                                  // Bildschirmkoordinaten berechnen
  p[i].u = uRot; p[i].v = vRot;                            // Koordinaten der Polygonecke festlegen
  }
 
      
function initCuboid (pg, xx1, xx2, yy1, yy2, zz1, zz2) {
  pg[0] = {u: screenU(xx1,yy2), v: screenV(xx1,yy2,zz1)};  // Ecke links unten
  pg[1] = {u: screenU(xx1,yy1), v: screenV(xx1,yy1,zz1)};  // Ecke unten
  pg[2] = {u: screenU(xx2,yy1), v: screenV(xx2,yy1,zz1)};  // Ecke rechts unten
  pg[3] = {u: screenU(xx2,yy1), v: screenV(xx2,yy1,zz2)};  // Ecke rechts oben
  pg[4] = {u: screenU(xx2,yy2), v: screenV(xx2,yy2,zz2)};  // Ecke oben
  pg[5] = {u: screenU(xx1,yy2), v: screenV(xx1,yy2,zz2)};  // Ecke links oben
  return {u: screenU(xx1,yy1), v: screenV(xx1,yy1,zz2)};   // Innerer Punkt
  }
  

function initContact (pg, x, y, z) {
  return initCuboid(pg,x-HC,x+HC,y-HC,y+HC,z-HC,z+HC);
  }
  

function moveTo (x, y, z) {
  ctx.moveTo(screenU(x,y),screenV(x,y,z));
  }
  

function lineTo (x, y, z) {
  ctx.lineTo(screenU(x,y),screenV(x,y,z));
  }
  

function screenCoordsRot (x, y, z) {
  var xx = x*cosAlpha-z*sinAlpha;                          // x-Koordinate nach Drehung
  var zz = x*sinAlpha+z*cosAlpha;                          // z-Koordinate nach Drehung
  uRot = U0+a1*xx+a2*y;                                    // Waagrechte Bildschirmkoordinate (Pixel)
  vRot = V0+b1*xx+b2*y+b3*zz;                              // Senkrechte Bildschirmkoordinate (Pixel)
  }
  

function moveToRot (x, y, z) {
  screenCoordsRot(x,y,z);                                  // Bildschirmkoordinaten berechnen
  ctx.moveTo(uRot,vRot);                                   // Ausgangsposition festlegen
  }


function lineToRot (x, y, z) {
  screenCoordsRot(x,y,z);                                  // Bildschirmkoordinaten berechnen
  ctx.lineTo(uRot,vRot);                                   // Linie vorbereiten
  }  
  
// Berechnungen f�r Kommutator-Ellipsen:
// Seiteneffekt aEllipse, bEllipse, deltaEllipse

function calcEllipse () {
  var r = ZC1-HC;                                          // Radius  
  // Die Hilfsgr��en c, d und m sind durch folgende Bedingungen bestimmt:
  // Ellipse durch (c|mc) mit unendlicher Steigung
  // Ellipse durch Punkt (0|d) mit Steigung m  
  var c = a1*r, d = -b3*r, m = b1/a1;   
  // Koeffizienten der Ellipsengleichung (c11 u^2 + 2 c12 uv + c22 v^2 + c0 = 0)  
  var c11 = c*c*m*m+d*d;                                   // Koeffizient von u^2
  var c12 = -m*c*c;                                        // Koeffizient von uv
  var c22 = c*c;                                           // Koeffizient von v^2
  var c0 = -c*c*d*d;                                       // Konstanter Summand  
  // Koeffizienten der biquadratischen Gleichung (a^4 + bq a^2 + cq = 0) f�r die gro�e Halbachse a  
  var bq = -c*c*(1+m*m)-d*d;                               // Koeffizient von a^2
  var cq = c*c*d*d;                                        // Konstanter Summand
  var discr = bq*bq-4*cq;                                  // Diskriminante
  aEllipse = Math.sqrt((-bq-Math.sqrt(discr))/2);          // Gro�e Halbachse (Pixel)
  bEllipse = c*d/aEllipse;                                 // Kleine Halbachse (Pixel)  
  deltaEllipse = Math.atan(2*c12/(c22-c11))/2;             // Drehwinkel (Bogenma�, negativ)
  }

//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// w ... Liniendicke (optional, Defaultwert 1)

function newPath (w) {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }

// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // L�nge
  if (length == 0) return;                                 // Abbruch, falls L�nge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // L�nge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt f�r Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad f�r Pfeilspitze
  ctx.lineWidth = 1;                                       // Liniendicke zur�cksetzen
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Rotierende Linie:
// (x1,y1,z1) ... Anfangspunkt (Koordinaten in Ausgangsstellung)
// (x2,y2,z2) ... Endpunkt (Koordinaten in Ausgangsstellung)
// c ............ Linienfarbe
// w ............ Liniendicke

function lineRot (x1, y1, z1, x2, y2, z2, c, w) {
  newPath(w);                                              // Neuer Grafikpfad
  ctx.strokeStyle = c;                                     // Linienfarbe
  moveToRot(x1,y1,z1);                                     // Anfangspunkt
  lineToRot(x2,y2,z2);                                     // Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Rotierender Pfeil:
// (x1,y1,z1) ... Anfangspunkt (Koordinaten in Ausgangsstellung)
// (x2,y2,z2) ... Endpunkt (Koordinaten in Ausgangsstellung)
  
function arrowRot (x1, y1, z1, x2, y2, z2) {
  var xx1 = x1*cosAlpha-z1*sinAlpha;                       // x-Koordinate des Anfangspunkts nach der Drehung
  var zz1 = x1*sinAlpha+z1*cosAlpha;                       // z-Koordinate des Anfangspunkts nach der Drehung
  var xx2 = x2*cosAlpha-z2*sinAlpha;                       // x-Koordinate des Endpunkts nach der Drehung
  var zz2 = x2*sinAlpha+z2*cosAlpha;                       // z-Koordinate des Endpunkts nach der Drehung
  var u1 = screenU(xx1,y1), v1 = screenV(xx1,y1,zz1);      // Bildschirmkoordinaten des Anfangspunkts
  var u2 = screenU(xx2,y2), v2 = screenV(xx2,y2,zz2);      // Bildschirmkoordinaten des Endpunkts
  arrow(u1,v1,u2,v2,THICK);                                // Pfeil zeichnen
  }
  
// Pfeil auf einer vorhandenen Verbindungslinie (Version f�r nicht bewegte Teile):
// (x1,y1,z1) ... R�umliche Position des ersten Punkts
// (x2,y2,z2) ... R�umliche Position des zweiten Punkts
// q ............ Bruchteil
// d ............ Flag f�r Pfeil vom ersten zum zweiten Punkt
  
function arrowLine (x1, y1, z1, x2, y2, z2, q, d) {
  var u1 = screenU(x1,y1), v1 = screenV(x1,y1,z1);         // Bildschirmkoordinaten des ersten Punkts
  var u2 = screenU(x2,y2), v2 = screenV(x2,y2,z2);         // Bildschirmkoordinaten des zweiten Punkts
  var du = u2-u1, dv = v2-v1;                              // Verbindungsvektor
  if (d) arrow(u1,v1,u1+q*du,v1+q*dv,THICK);               // Entweder Pfeil vom ersten Punkt auf den zweiten Punkt zu ...
  else arrow(u2,v2,u2-q*du,v2-q*dv,THICK);                 // ... oder Pfeil vom zweiten Punkt auf den ersten Punkt zu
  }
  
// Pfeil auf einer vorhandenen Verbindungslinie (Version f�r rotierende Teile):
// (x1,y1,z1) ... R�umliche Position des ersten Punkts
// (x2,y2,z2) ... R�umliche Position des zweiten Punkts
// q ............ Bruchteil
// d ............ Flag f�r Pfeil vom ersten zum zweiten Punkt
  
function arrowLineRot (x1, y1, z1, x2, y2, z2, q, d) {
  var xx1 = x1*cosAlpha-z1*sinAlpha;                       // x-Koordinate des ersten Punkts nach der Drehung
  var zz1 = x1*sinAlpha+z1*cosAlpha;                       // z-Koordinate des ersten Punkts nach der Drehung
  var xx2 = x2*cosAlpha-z2*sinAlpha;                       // x-Koordinate des zweiten Punkts nach der Drehung
  var zz2 = x2*sinAlpha+z2*cosAlpha;                       // z-Koordinate des zweiten Punkts nach der Drehung
  arrowLine(xx1,y1,zz1,xx2,y2,zz2,q,d);                    // Pfeil zeichnen
  }
  
// Polygon zeichnen:
// p ... Array mit Koordinaten der Ecken
// c ... F�llfarbe

function drawPolygon (p, c) {
  newPath();                                               // Neuer Pfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.moveTo(p[0].u,p[0].v);                               // Zur ersten Ecke
  for (var i=1; i<p.length; i++)                           // F�r alle weiteren Ecken ... 
    ctx.lineTo(p[i].u,p[i].v);                             // Linie zum Pfad hinzuf�gen
  ctx.closePath();                                         // Zur�ck zum Ausgangspunkt
  ctx.fill(); ctx.stroke();                                // Polygon ausf�llen und Rand zeichnen   
  }
  
// Verbindungslinie zweier Punkte:
// (u1,v1), (u2,v2) ... Bildschirmkoordinaten der Endpunkte

function line (u1, v1, u2, v2) {
  newPath();                                               // Neuer Pfad (Standardwerte)
  ctx.moveTo(u1,v1); ctx.lineTo(u2,v2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Verbindungslinie eines Punktes im Inneren eines Polygons mit einer Polygonecke:
// (u,v) ... Bildschirmkoordinaten des inneren Punkts
// p ....... Array der Polygonecken
// i ....... Index der Polygonecke

function lineP (u, v, p, i) {
  line(u,v,p[i].u,p[i].v);                                 // Linie zeichnen
  }
  
// Ausgef�llter Kreis:
// (u,v) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... F�llfarbe

function circle (u, v, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.arc(u,v,r,0,PI2,true);                               // Kreis vorbereiten
  ctx.fill();                                              // Kreis ausf�llen
  }
  
// S�dpol des Hufeisenmagneten (unten):

function magnetSouth () {
  drawPolygon(pgSouth,colorSouth);                         // Ausgef�lltes Polygon
  var u1 = screenU(-XM1,YM2);                              // 1. innerer Punkt links, waagrechte Bildschirmkoordinate
  var v1 = screenV(-XM1,YM2,-ZM1);                         // 1. innerer Punkt links, senkrechte Bildschirmkoordinate
  lineP(u1,v1,pgSouth,5);                                  // Linie vom 1. inneren Punkt nach rechts oben
  lineP(u1,v1,pgSouth,7);                                  // Linie vom 1. inneren Punkt nach oben
  var u2 = screenU(-XM1,YM1);                              // 2. innerer Punkt rechts, waagrechte Bildschirmkoordinate
  var v2 = screenV(-XM1,YM1,-ZM1);                         // 2. innerer Punkt rechts, senkrechte Bildschirmkoordinate
  lineP(u2,v2,pgSouth,2);                                  // Linie vom 2. inneren Punkt nach unten
  lineP(u2,v2,pgSouth,4);                                  // Linie vom 2. inneren Punkt nach rechts oben  
  line(u1,v1,u2,v2);                                       // Linie zwischen den beiden inneren Punkten  
  }
  
// Nordpol des Hufeisenmagneten (oben):

function magnetNorth () {  
  drawPolygon(pgNorth,colorNorth);                         // Ausgef�lltes Polygon
  var u1 = screenU(-XM1,YM2);                              // 1. innerer Punkt links, waagrechte Bildschirmkoordinate
  var v1 = screenV(-XM1,YM2,ZM1);                          // 1. innerer Punkt links, senkrechte Bildschirmkoordinate
  lineP(u1,v1,pgNorth,1);                                  // Linie vom 1. inneren Punkt nach unten
  lineP(u1,v1,pgNorth,3);                                  // Linie vom 1. inneren Punkt nach rechts unten
  var u2 = screenU(-XM1,YM1);                              // 2. innerer Punkt rechts, waagrechte Bildschirmkoordinate
  var v2 = screenV(-XM1,YM1,ZM2);                          // 2. innerer Punkt rechts, senkrechte Bildschirmkoordinate
  lineP(u2,v2,pgNorth,4);                                  // Linie vom 2. inneren Punkt nach unten
  lineP(u2,v2,pgNorth,6);                                  // Linie vom 2. inneren Punkt nach rechts oben
  lineP(u2,v2,pgNorth,8);                                  // Linie vom 2. inneren Punkt nach links oben
  }
  
// Farbe f�r Drahtst�cke (je nach Stromfluss):
  
function colorCurrent () {
  return (current!=0 ? colorCurrent1 : "#000000");
  }

// Ankerh�lfte (mit Strompfeil):
// i = 1: Ankerh�lfte, die in Ausgangsposition oben ist
// i = 2: Ankerh�lfte, die in Ausgangsposition unten ist

function halfArmature (i) {
  var dir = 0;                                             // Richtung des Strompfeils (-1, 0 oder +1)
  var sign = 3-2*i;                                        // Vorzeichen von z in Ausgangsposition
  if (cosAlpha > 0 && current != 0) dir = direction;       // Richtung des Strompfeils, falls Ankerh�lfte oben
  if (cosAlpha < 0 && current != 0) dir = -direction;      // Richtung des Strompfeils, falls Ankerh�lfte unten
  newPath(THICK);                                          // Neuer Grafikpfad
  ctx.strokeStyle = colorCurrent();                        // Linienfarbe je nach Stromfluss
  var z1 = sign*ZA1, z2 = sign*ZA2;                        // z-Koordinaten innen bzw. au�en
  moveToRot(0,0,z1);                                       // Anfangspunkt bei Zuleitung 
  lineToRot(0,YA1,z1);                                     // Linie zum Rechteck 
  lineToRot(0,YA1,z2);                                     // Linie nach au�en
  lineToRot(0,YA2,z2);                                     // Linie nach hinten 
  lineToRot(0,YA2,0);                                      // Linie hinten zur Drehachse
  ctx.stroke();                                            // Linien zeichnen
  if (iArrows && current != 0 && omega > 0)                // Falls sinnvoll ... 
    arrowLineRot(0,YA1,z2,0,YA2,z2,0.75,sign*dir<0);       // Pfeilspitze (konventionelle Stromrichtung) 
  } 
  
// Pfeil f�r Bewegungsrichtung:
// i = 1: Ankerh�lfte, die in Ausgangsposition oben ist
// i = 2: Ankerh�lfte, die in Ausgangsposition unten ist

function movementArrow (i) {
  if (!vArrows || omega <= 0) return;                      // Falls Pfeil nicht sinnvoll, abbrechen
  var dir = (3-2*i)*direction;                             // Faktor f�r Drehsinn (1 oder -1)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = colorMotion;                           // Farbe f�r Bewegung
  var y = (YA1+YA2)/2;                                     // y-Koordinate                                    
  if (i == 1) arrowRot(0,y,ZA2,-40*dir,y,ZA2);             // Pfeil f�r 1. Ankerh�lfte
  if (i == 2) arrowRot(0,y,-ZA2,-40*dir,y,-ZA2);           // Pfeil f�r 2. Ankerh�lfte
  }  
  
// Feldlinien des Magnetfelds:
// i1 ... Erster Index
// i2 ... Letzter Index

function fieldLines (i1, i2) {
  if (!cb2.checked) return;                                // Falls Optionsfeld nicht aktiviert, abbrechen
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = THICK;                                   // Liniendicke
  ctx.strokeStyle = colorField;                            // Farbe f�r Magnetfeld
  var y0 = (YA2+YA1)/2;                                    // y-Koordinate f�r mittlere Feldlinie
  for (i=i1; i<=i2; i++) {                                 // F�r alle Linien ...
    var y1 = y0+i*36;                                      // y-Koordinate berechnen
    moveTo(0,y1,-ZM1);                                     // Anfangspunkt berechnen
    lineTo(0,y1,ZM1);                                      // Linie vorbereiten
    }
  ctx.stroke();                                            // Linien zeichnen
  for (i=i1; i<=i2; i++) {                                 // F�r alle Linien ...
    var y1 = y0+i*36;                                      // y-Koordinate berechnen
    arrowLine(0,y1,ZM1,0,y1,-ZM1,0.25,true);               // Obere Pfeilspitze zeichnen
    arrowLine(0,y1,ZM1,0,y1,-ZM1,0.85,true);               // Untere Pfeilspitze zeichnen
    }
  }
  
// Ellipsenbogen zum Grafikpfad hinzuf�gen:
// (u,v) ... Mittelpunkt (Pixel)
// a, b .... Halbachsen (Pixel)
// delta ... Drehwinkel (Bogenma�)
// w0 ...... Startwinkel (Bogenma�)
// w1 ...... Endwinkel (Bogenma�)
  
function addEllipticalArc (u, v, a, b, delta, w0, w1) {
  ctx.save();                                              // Bisherigen Grafikkontext speichern
  ctx.translate(u,v);                                      // Parallelverschiebung
  ctx.rotate(-delta);                                      // Drehung
  ctx.scale(a,b);                                          // Skalierung
  ctx.arc(0,0,1,w0,w1,true);                               // Teil des Einheitskreises (wird zu Teil der Ellipse)
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen
  }
  
// Kreiszylinder-Schr�gbild f�r Kommutator:
// y ... y-Koordinate (Mittelpunkt, auf y-Achse)
// c ... F�llfarbe
  
function cylinder (y, c) {
  var u = screenU(0,y+HC), v = screenV(0,y+HC,0);          // Mittelpunkt der hinteren Ellipse
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe
  addEllipticalArc(u,v,aEllipse,bEllipse,deltaEllipse,1.5*PI,0.5*PI);  // Halbellipse hinten links
  u = screenU(0,y-HC); v = screenV(0,y-HC,0);              // Mittelpunkt der vorderen Ellipse
  ctx.lineTo(u+bEllipse*Math.sin(deltaEllipse),v+bEllipse*Math.cos(deltaEllipse));  // Verbindungslinie
  addEllipticalArc(u,v,aEllipse,bEllipse,deltaEllipse,0.5*PI,1.5*PI);  // Halbellipse vorne rechts
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill(); ctx.stroke();                                // Ausgef�llte Fl�che mit Rand
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  addEllipticalArc(u,v,aEllipse,bEllipse,deltaEllipse,0,PI2); // Vordere Ellipse
  ctx.stroke();                                            // Rand der vorderen Ellipse  
  }
  
// Hohlzylinder-Schr�gbild f�r Schleifringe:
// y ... y-Koordinate (Mittelpunkt, auf y-Achse)
// c ... F�llfarbe
  
function ring (y, c) {
  var u0 = screenU(0,y+HC), v0 = screenV(0,y+HC,0);        // Mittelpunkt der hinteren Ellipse
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = c;                                       // F�llfarbe (Au�enfl�che)
  addEllipticalArc(u0,v0,aEllipse,bEllipse,deltaEllipse,1.5*PI,0.5*PI);   // Halbellipse hinten links (au�en)
  var u1 = screenU(0,y-HC), v1 = screenV(0,y-HC,0);        // Mittelpunkt der vorderen Ellipse
  ctx.lineTo(u1+bEllipse*Math.sin(deltaEllipse),v1+bEllipse*Math.cos(deltaEllipse)); // Verbindungslinie
  addEllipticalArc(u1,v1,aEllipse,bEllipse,deltaEllipse,0.5*PI,1.5*PI);   // Halbellipse vorne rechts (au�en)
  ctx.lineTo(u0-bEllipse*Math.sin(deltaEllipse),v0-bEllipse*Math.cos(deltaEllipse)); // Verbindungslinie
  ctx.moveTo(u1-0.75*aEllipse*Math.cos(deltaEllipse),v1+0.75*aEllipse*Math.sin(deltaEllipse)); // Neuer Anfangspunkt
  addEllipticalArc(u1,v1,-0.75*aEllipse,0.75*bEllipse,deltaEllipse,0,PI2); // Vordere Ellipse (innen)
  ctx.fill(); ctx.stroke();                                 // Ring ausf�llen, Rand
  newPath();                                                // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorCurrent3;                            // F�llfarbe (Innenfl�che)
  addEllipticalArc(u1,v1,0.75*aEllipse,0.75*bEllipse,deltaEllipse,0.5*PI,1.5*PI); // Halbellipse (vorne)
  addEllipticalArc(u0,v0,-0.75*aEllipse,0.75*bEllipse,deltaEllipse,1.45*PI,0.55*PI); // Ellipsenbogen (hinten)
  ctx.fill(); ctx.stroke();                                 // Fl�che ausf�llen, Rand
  newPath();                                                // Neuer Grafikpfad (Standardwerte)
  addEllipticalArc(u1,v1,aEllipse,bEllipse,deltaEllipse,0,PI2); // Vordere Ellipse (au�en)
  ctx.stroke();                                             // Ellipsenrand
  }
  
// Markierung f�r Schleifring:
// y ... y-Koordinate der vorderen Fl�che

function mark (y) {
  var r = 0.87*(ZC1-HC);                                   // Radius
  var x = -r*sinAlpha, z = r*cosAlpha;                     // R�umliche Koordinaten
  var uM = screenU(x,y), vM = screenV(x,y,z);              // Bildschirmkoordinaten
  circle(uM,vM,2,"#ffffff");                               // Markierung (wei�er Kreis)
  }
  
// Linker (hinterer) Schleifring f�r Wechselstrom-Generator:

function leftRing () {
  if (sinAlpha > 0)                                        // Falls Zuleitung in der linken H�lfte ...
    lineRot(0,YC1,ZA1,0,YC1,0.75*(ZC1-HC),colorCurrent1,2);// Kurzes Drahtst�ck zur Innenfl�che zeichnen
  ring(YC1,colorCurrent2);                                 // Schr�gbild Hohlzylinder
  mark(YC1-HC);                                            // Markierung (wei�er Kreis) 
  if (sinAlpha < 0)                                        // Falls Zuleitung in der rechten H�lfte ...
    lineRot(0,YC1,ZA1,0,YC1,0.75*(ZC1-HC),colorCurrent1,2);// Kurzes Drahtst�ck zur Innenfl�che zeichnen       
  if (!genDC)                                              // Falls Wechselstromgenerator ...
    lineRot(0,YC1,-ZA1,0,YC2,-ZA1,colorCurrent1,2);        // Zuleitung f�r rechten Schleifring verl�ngern
  }
  
// Rechter (vorderer) Schleifring f�r Wechselstrom-Generator:

function rightRing () {
  lineRot(0,YC2,-ZA1,0,YC2,0.75*(-ZC1+HC),colorCurrent1,2);// Kurzes Drahtst�ck zur Innenfl�che zeichnen
  ring(YC2,colorCurrent2);                                 // Schr�gbild Hohlzylinder   
  mark(YC2-HC);                                            // Markierung (wei�er Kreis) 
  if (sinAlpha > 0)                                        // Falls Zuleitung in der rechten H�lfte ...
    lineRot(0,YC2,-ZA1,0,YC2,0.75*(-ZC1+HC),colorCurrent1,2); // Kurzes Drahtst�ck zur Innenfl�che zeichnen
  }
  
// Kommutator:
  
function commutator () {
  var color = (current!=0 ? colorCurrent2 : colorContact); // Farbe f�r Kreiszylinder
  cylinder(YC1,color);                                     // Schr�gbild Kreiszylinder
  // Die Isolierschicht wird n�herungsweise durch zwei Polygone dargestellt, eines auf der Vorderfl�che (pgInsulator1)
  // und eines auf der Mantelfl�che (pgInsulator2).
  var dw = INSMAX/5;                                       // Winkel f�r Polygonecken (Bogenma�)
  var r = ZC1-HC;                                          // Radius
  for (i=0; i<20; i++) {                                   // F�r alle Polygonecken (Vorderfl�che) ...
    var w = (i<10 ? (i-5)*dw : (i-15)*dw+PI);              // Winkel berechnen
    var xx = r*Math.cos(w);                                // x-Koordinate der Polygonecke berechnen
    var zz = r*Math.sin(w);                                // z-Koordinate der Polygonecke berechnen
    setPointRot(pgInsulator1,i,xx,-HC,zz);                 // Bildschirmkoordinaten der Ecke speichern 
    }
  // Durch die Variable seite wird festgestellt, welche Seite des Kommutators sichtbar ist.
  var seite = c1*cosAlpha+c3*sinAlpha;                     // Skalarprodukt
  for (i=0; i<10; i++) {                                   // F�r die ersten 10 Polygonecken (Mantelfl�che) ...
    var w = (i-5)*dw;                                      // Winkel berechnen
    if (seite > 0) w += PI;                                // Falls falsche Seite, pi addieren
    var xx = r*Math.cos(w);                                // x-Koordinate der Polygonecke berechnen
    var zz = r*Math.sin(w);                                // z-Koordinate der Polygonecke berechnen
    setPointRot(pgInsulator2,i,xx,-HC,zz);                 // Bildschirmkoordinaten f�r Ecke auf der Vorderseite speichern
    setPointRot(pgInsulator2,19-i,xx,HC,zz);               // Bildschirmkoordinaten f�r Ecke auf der R�ckseite speichern
    }
  drawPolygon(pgInsulator1,colorInsulator);                // Polygon auf der Vorderfl�che zeichnen
  drawPolygon(pgInsulator2,colorInsulator);                // Polygon auf der Mantelfl�che zeichnen
  }
  
// Handkurbel:
// y ... y-Koordinate (Mittelpunkt der Kurbelscheibe, auf y-Achse)

function crank (y) {
  cylinder(y,colorCrank);                                  // Kurbelscheibe
  var r = 24;                                              // Abstand Mittelpunkt-Kurbelgriff
  var x = -r*sinAlpha, z = r*cosAlpha;                     // R�umliche Koordinaten Kurbelgriff
  var u0 = screenU(x,y-HC), v0 = screenV(x,y-HC,z);        // Bildschirmkoordinaten Kurbelgriff
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorCrank;                              // F�llfarbe
  var a = aEllipse/12, b = bEllipse/12;                    // Halbachsen f�r Kurbelgriff
  addEllipticalArc(u0,v0,a,b,deltaEllipse,1.5*PI,0.5*PI);  // Halbellipse hinten links
  var u1 = screenU(x,y-36), v1 = screenV(x,y-36,z);        // Mittelpunkt der vorderen Ellipse
  ctx.lineTo(u1+b*Math.sin(deltaEllipse),v1+b*Math.cos(deltaEllipse)); // Verbindungslinie
  addEllipticalArc(u1,v1,a,b,deltaEllipse,0.5*PI,1.5*PI);  // Halbellipse vorne rechts
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill(); ctx.stroke();                                // Ausgef�llte Fl�che mit Rand
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  addEllipticalArc(u1,v1,a,b,deltaEllipse,0,PI2);          // Vordere Ellipse vorbereiten
  ctx.stroke();                                            // Rand der vorderen Ellipse  
  }
  
// Kontakt zeichnen:
// pg ... Polygon
// pt ... Innerer Punkt

function contact (pg, pt) {
  var col = (current!=0 ? colorCurrent2 : colorContact);   // Farbe (mit bzw. ohne Strom) 
  drawPolygon(pg,col);                                     // Ausgef�lltes Polygon mit Rand
  var u = pt.u, v = pt.v;                                  // Innerer Punkt
  lineP(u,v,pg,1);                                         // Linie vom inneren Punkt nach unten
  lineP(u,v,pg,3);                                         // Linie vom inneren Punkt nach rechts oben
  lineP(u,v,pg,5);                                         // Linie vom inneren Punkt nach links oben
  }
  
// Voltmeter (mit Zuleitungen und Strompfeilen):
// rv ... Relative Spannung (zwischen -1 und +1)

function voltmeter (rv) {
  drawPolygon(pgVoltmeter1,colorVoltage);                  // Polygon f�r Geh�use
  var u = pointVoltmeter.u, v = pointVoltmeter.v;          // Innerer Punkt
  lineP(u,v,pgVoltmeter1,1);                               // Linie vom inneren Punkt nach unten
  lineP(u,v,pgVoltmeter1,3);                               // Linie vom inneren Punkt nach rechts oben
  lineP(u,v,pgVoltmeter1,5);                               // Linie vom inneren Punkt nach links oben
  drawPolygon(pgVoltmeter2,"#ffffff");                     // Parallelogramm f�r Skala
  newPath(THICK);                                          // Neuer Grafikpfad f�r Zeiger
  var x0 = (XW2+XW3)/2;                                    // x-Koordinate der Mittelposition
  var wMax = 0.36;                                         // Maximaler Auslenkungswinkel (Bogenma�)
  var w = wMax*rv;                                         // Aktueller Auslenkungswinkel (Bogenma�)
  moveTo(x0,YW2,ZW1);                                      // Anfangspunkt des Zeigers (unten)
  lineTo(x0+125*Math.sin(w),YW2,ZW1+125*Math.cos(w));      // Weiter zum Endpunkt des Zeigers (oben)
  ctx.stroke();                                            // Zeiger zeichnen  
  drawPolygon(pgVoltmeter3,colorVoltage);                  // Unteren Teil neu ausf�llen, Zeiger teilweise verdecken
  u = screenU(XW2,YW2); v = screenV(XW2,YW2,ZW1);          // Bildschirmkoordinaten der linken Buchse (Pixel)
  circle(u,v,3,"#000000");                                 // Linke Buchse
  u = screenU(XW3,YW2); v = screenV(XW3,YW2,ZW1);          // Bildschirmkoordinaten der rechten Buchse (Pixel)
  circle(u,v,3,"#000000");                                 // Rechte Buchse  
  newPath(THICK);                                          // Neuer Grafikpfad f�r Zuleitungen
  ctx.strokeStyle = colorCurrent();                        // Linienfarbe je nach Stromfluss
  moveTo(XW2,YW2,ZW1);                                     // Anfangspunkt (linke Buchse)
  lineTo(XW2,YW3,ZW1);                                     // Weiter in y-Richtung zum Betrachter
  lineTo(XC1,YW3,ZW1);                                     // Weiter nach links
  moveTo(XW3,YW2,ZW1);                                     // Neuer Anfangspunkt (rechte Buchse)
  lineTo(XW3,YW3,ZW1);                                     // Weiter in y-Richtung zum Betrachter
  lineTo(XW4,YW3,ZW1);                                     // Weiter nach rechts
  ctx.stroke();                                            // Zuleitungen zeichnen
  if (iArrows && current != 0)                             // Falls sinnvoll ...
    arrowLine(XC1,YW3,ZW1,XW2,YW3,ZW1,0.6+current*0.3,current<0); // Pfeilspitze f�r Stromrichtung
  newPath(3);                                              // Neuer Grafikpfad f�r Symbole 
  moveTo(XW2-8,YW2,ZW1+15);                                // Anfangspunkt (linkes Ende Minuszeichen)
  lineTo(XW2+8,YW2,ZW1+15);                                // Weiter zum rechten Endpunkt des Minuszeichens
  moveTo(XW3-8,YW2,ZW1+15);                                // Neuer Anfangspunkt (linkes Ende Pluszeichen)
  lineTo(XW3+8,YW2,ZW1+15);                                // Weiter zum rechten Endpunkt des Pluszeichens
  moveTo(XW3,YW2,ZW1+23);                                  // Neuer Anfangspunkt (oberes Ende Pluszeichen)
  lineTo(XW3,YW2,ZW1+7);                                   // Weiter zum unteren Endpunkt des Pluszeichens
  moveTo(x0-7,YW2,ZW1+23);                                 // Neuer Anfangspunkt (linkes oberes Ende 'V')
  lineTo(x0,YW2,ZW1+5);                                    // Weiter zum unteren Ende des 'V'
  lineTo(x0+7,YW2,ZW1+23);                                 // Weiter zum rechten oberen Ende des 'V'
  ctx.stroke();                                            // Symbole '-', '+' und 'V' zeichnen
  newPath(2);                                              // Neuer Grafikpfad f�r Skala
  for (var i=-2; i<=2; i++) {                              // F�r alle Markierungen ...
    if (i == 0) continue;                                  // Mittelposition auslassen
    w = i*wMax/2;                                          // Winkel (Bogenma�)
    var sin = Math.sin(w), cos = Math.cos(w);              // Trigonometrische Werte
    moveTo(x0+130*sin,YW2,ZW1+130*cos);                    // Anfangspunkt (unten)
    lineTo(x0+140*sin,YW2,ZW1+140*cos);                    // Weiter zum Endpunkt (oben)
    }
  ctx.stroke();                                            // Markierungen zeichnen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillText("0",screenU(x0,YW2),screenV(x0,YW2,ZW1+130));  // Nullmarkierung  
  }
  
// Dr�hte vom oberen Kontakt in Richtung rechte Messger�t-Buchse:

function wires1 () {
  newPath(THICK);                                          // Neuer Grafikpfad
  ctx.strokeStyle = colorCurrent();                        // Linienfarbe 
  moveTo(0,YW1,ZC1+HC);                                    // Anfangspunkt (Oberseite des oberen Kontakts)
  lineTo(0,YW1,ZW2);                                       // Weiter nach oben
  lineTo(XW1,YW1,ZW2);                                     // Weiter nach rechts (in Richtung Messger�t)
  lineTo(XW1,YW1,ZW1);                                     // Weiter nach unten
  lineTo(XW4,YW1,ZW1);                                     // Weiter nach rechts (hinter dem Messger�t)
  lineTo(XW4,YW3,ZW1);                                     // Weiter zum Betrachter (rechts vom Messger�t)
  ctx.stroke();                                            // Dr�hte zeichnen
  if (iArrows && current != 0)                             // Falls sinnvoll ... 
    arrowLine(0,YW1,ZW2,XW1,YW1,ZW2,0.5,current>0);        // Pfeilspitze f�r Stromrichtung
  }
  
// Dr�hte vom unteren Kontakt in Richtung linke Messger�t-Buchse:

function wires2 () {
  newPath(THICK);                                          // Neuer Grafikpfad
  ctx.strokeStyle = colorCurrent();                        // Linienfarbe je nach Stromfluss
  var y = (genDC ? YC1 : YC2);                             // y-Koordinate des unteren Kontakts
  moveTo(XC1,y,-ZC1-HC);                                   // Anfangspunkt (Unterseite des unteren Kontakts)
  lineTo(XC1,y,ZW1);                                       // Weiter nach unten
  lineTo(XC1,YW3,ZW1);                                     // Weiter in Richtung Messger�t (linke Buchse)  
  ctx.stroke();                                            // Drahtst�cke zeichnen
  }
      
// Widerstand (Verbraucher) mit Zuleitungen:
// Vorschlag von Teun Koops �bernommen

function resistor () {
  var c = colorCurrent();                                  // Farbe je nach Stromfluss
  var uR = screenU(XW1,YC1), vR = screenV(XW1,YC1,ZW1);    // Bildschirmkoordinaten f�r rechten Knoten
  circle(uR,vR,3,c);                                       // Rechter Knoten
  newPath(THICK);                                          // Neuer Grafikpfad
  ctx.strokeStyle = c;                                     // Linienfarbe
  moveTo(XR2,YC1,ZW1);                                     // Neuer Anfangspunkt (rechtes Ende Widerstand)
  lineTo(XW1,YC1,ZW1);                                     // Weiter zum rechten Knoten
  ctx.stroke();                                            // Zuleitung rechts zeichnen
  newPath();                                               // Neuer Grafikpfad
  ctx.fillStyle = colorResistor;                           // Farbe f�r Widerstand
  var u0 = screenU(XR1,YC1), v0 = screenV(XR1,YC1,ZW1);    // Bildschirmkoordinaten f�r linkes Ende Widerstand
  var d = 100*DEG;                                         // Drehwinkel (Bogenma�)
  addEllipticalArc(u0,v0,10,8,d,0,PI);                     // Halbellipse links
  var u1 = screenU(XR2,YC1), v1 = screenV(XR2,YC1,ZW1);    // Bildschirmkoordinaten f�r rechtes Ende Widerstand
  addEllipticalArc(u1,v1,10,8,d,PI,0);                     // Halbellipse rechts                 
  ctx.closePath();                                         // Grafikpfad schlie�en
  ctx.fill(); ctx.stroke();                                // Fl�che ausf�llen, Rand
  newPath();                                               // Neuer Grafikpfad
  addEllipticalArc(u0,v0,10,8,d,0,PI2);                    // Komplette Ellipse links
  ctx.stroke();                                            // Ellipse zeichnen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  ctx.fillText(symbolResistor,0.4*u0+0.6*u1,0.4*v0+0.6*v1+4); // Symbol f�r Widerstand
  var y = (genDC ? YC1 : YC2);                             // y-Koordinate des linken Knotens
  var uL = screenU(0,y), vL = screenV(0,y,ZW1);            // Bildschirmkoordinaten f�r linken Knoten
  circle(uL,vL,3,c);                                       // Linker Knoten
  newPath(THICK);                                          // Neuer Grafikpfad
  ctx.strokeStyle = c;                                     // Linienfarbe  
  moveTo(0,y,ZW1);                                         // Anfangspunkt (linker Knoten)
  lineTo(0,YC1,ZW1);                                       // Drahtst�ck in y-Richtung (nur f�r Wechselstrom-Generator)  
  lineTo(XR1,YC1,ZW1);                                     // Weiter zum linken Ende des Widerstands
  ctx.stroke();                                            // Zuleitung links zeichnen
  }
      
// Hilfsroutine:
// du ... Bildschirmkoordinate relativ zum Ursprung (Pixel)
// f1 ... Faktor f�r Zeitachse
// f2 ... Faktor f�r Spannungsachse
// R�ckgabewert: Bildschirmkoordinate relativ zum Ursprung (Pixel, oben positiv)

function dvDiagram (du, f1, f2) {
  var dv = f2*Math.cos(du*f1);                             // Bildschirmkoordinate relativ zum Ursprung (Pixel)
  if (genDC) dv = Math.abs(dv);                            // Falls Kommutator, Betrag
  return direction*dv;                                     // R�ckgabewert (Vorzeichen je nach Bewegungsrichtung)
  }
  
// Diagramm:
// (u,v) ... Ursprung (Pixel)

function diagram (u, v) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  arrow(u-10,v,u+215,v);                                   // Waagrechte Achse (Zeit t)
  var pixT = 4;                                            // Umrechnungsfaktor (Pixel pro Sekunde)
  for (var i=1; i<=5; i++) {                               // F�r alle Ticks der t-Achse (im Abstand 10 s) ...
    var uT = u+i*10*pixT;                                  // Waagrechte Bildschirmkoordinate (Pixel) 
    line(uT,v-3,uT,v+3);                                   // Tick zeichnen
    }
  ctx.fillStyle = "#000000";                               // Schriftfarbe schwarz
  ctx.textAlign = "center";                                // Textausrichtung zentriert
  ctx.fillText(symbolTime,u+210,v+15);                     // Beschriftung t-Achse
  arrow(u,v+45,u,v-45);                                    // Senkrechte Achse (Spannung U)
  for (i=-2; i<=2; i++) {                                  // F�r alle Ticks der U-Achse ...
    var vT = v+i*15;                                       // Senkrechte Bildschirmkoordinate (Pixel)
    line(u-3,vT,u+3,vT);                                   // Tick zeichnen
    }
  ctx.textAlign = "right";                                 // Textausrichtung rechtsb�ndig
  ctx.fillText(symbolVoltage,u-5,v-35);                    // Beschriftung U-Achse
  var a = 75*omega/PI;                                     // Amplitude (Pixel)
  var f1 = omega/pixT;                                     // Faktor f�r Zeitachse
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(u,v-direction*a);                             // Anfangspunkt des Polygonzugs
  var uu = u;                                              // Waagrechte Bildschirmkoordinate
  while (uu < u+200) {                                     // Solange rechtes Ende noch nicht erreicht ...
    uu += 0.5;                                             // Waagrechte Bildschirmkoordinate erh�hen
    var vv = v-dvDiagram(uu-u,f1,a);                       // Senkrechte Bildschirmkoordinate
    // Korrektur f�r Unterbrechung durch Isolierschicht des Kommutators
    ctx.lineTo(uu,vv);                                     // Linie des Polygonzugs vorbereiten
    }
  ctx.stroke();                                            // Polygonzug zeichnen (N�herung f�r Kurve)
  var u0 = u+t*pixT;                                       // Waagrechte Bildschirmkoordinate f�r aktuelle Zeit
  var v0 = v-dvDiagram(u0-u,f1,a);                         // Senkrechte Bildschirmkoordinate f�r aktuelle Spannung
  circle(u0,v0,2.5,colorVoltage);                          // Markierung f�r aktuelle Werte
  }
  
// Grafikausgabe:
// Seiteneffekt current, t, t0, alpha, cosAlpha, sinAlpha, current ...
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  current = 0;                                             // Richtung des Induktionsstroms, vorl�ufiger Wert
  if (cosAlpha > 0) current = 1;                           // Richtung des Induktionsstroms, falls Markierung oben
  else if (cosAlpha < 0) current = -1;                     // Richtung des Induktionsstroms, falls Markierung unten
  if (genDC) current = Math.abs(current);                  // Falls Gleichstrom-Generator, Absolutbetrag
  current *= direction;                                    // Richtung des Induktionsstroms je nach Bewegungsrichtung
  if (on && omega > 0) {                                   // Falls Bewegung ...
    var t1 = new Date();                                   // Aktueller Zeitpunkt 
    var dt = (t1-t0)/1000;                                 // Verstrichene Zeit (s)
    t += dt;                                               // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    alpha += direction*omega*dt;                           // Winkel aktualisieren
    var n = Math.floor(alpha/PI2);                         // Zahl der ganzen Umdrehungen
    if (alpha >= 0) alpha -= n*PI2;                        // Falls alpha positiv, alpha < 2 pi erzwingen
    else alpha -= (n-1)*PI2;                               // Falls alpha negativ, alpha >= 0 erzwingen
    if (omega > 0 && t > nPer*PI2/omega)                   // Falls Zeitvariable zu gro� ...
      t -= nPer*PI2/omega;                                 // t reduzieren
    cosAlpha = Math.cos(alpha);                            // Cosinuswert aktualisieren 
    sinAlpha = Math.sin(alpha);                            // Sinuswert aktualisieren
    } 
  var dw = (genDC ? 0.05 : 0);                             // Toleranz f�r sinAlpha wegen Isolierschicht
  if (Math.abs(sinAlpha) > 1-dw) current = 0;              // Wenn Isolierschicht an den Kontakten, kein Strom
  magnetSouth();                                           // S�dpol des Hufeisenmagneten 
  var qu = Math.floor(alpha/PIH);                          // Quadrant (0 bis 3) f�r Drehung im Gegenuhrzeigersinn
  if (direction == -1) qu = (qu%2==0 ? qu+1 : qu-1);       // Quadrant (0 bis 3) f�r Drehung im Uhrzeigersinn
  switch(qu) {                                             // Je nach Quadrant (gegenseitige Verdeckungen!) ...
    case 0:
      movementArrow(2);                                    // Hinterer Pfeil f�r Bewegungsrichtung
      halfArmature(2);                                     // Hintere Ankerh�lfte
      fieldLines(-2,2);                                    // Alle Feldlinien
      halfArmature(1);                                     // Vordere Ankerh�lfte
      movementArrow(1); break;                             // Vorderer Pfeil f�r Bewegungsrichtung
    case 1:
      fieldLines(2,2);                                     // Feldlinie ganz links
      halfArmature(2);                                     // Hintere Ankerh�lfte
      fieldLines(0,1);                                     // Feldlinien halblinks und Mitte
      movementArrow(2);                                    // Hinterer Pfeil f�r Bewegungsrichtung
      movementArrow(1);                                    // Vorderer Pfeil f�r Bewegungsrichtung
      fieldLines(-2,-1);                                   // Feldlinien halbrechts und ganz rechts
      halfArmature(1); break;                              // Vordere Ankerh�lfte
    case 2:
      movementArrow(1);                                    // Hinterer Pfeil f�r Bewegungsrichtung
      halfArmature(1);                                     // Hintere Ankerh�lfte
      fieldLines(-2,2);                                    // Alle Feldlinien
      halfArmature(2);                                     // Vordere Ankerh�lfte
      movementArrow(2); break;                             // Vorderer Pfeil f�r Bewegungsrichtung
    case 3:
      fieldLines(2,2);                                     // Feldlinie ganz links
      halfArmature(1);                                     // Hintere Ankerh�lfte 
      fieldLines(0,1);                                     // Feldlinien halblinks und Mitte
      movementArrow(1);                                    // Hinterer Pfeil f�r Bewegungsrichtung
      movementArrow(2);                                    // Vorderer Pfeil f�r Bewegungsrichtung
      fieldLines(-2,-1);                                   // Feldlinien halbrechts und ganz rechts
      halfArmature(2); break;                              // Vordere Ankerh�lfte
      }
  magnetNorth();                                           // Nordpol des Hufeisenmagneten
  wires2();                                                // Dr�hte vom unteren Kontakt in Richtung linke Buchse Messger�t
  if (genDC) {                                             // Falls Gleichstrom-Generator (mit Kommutator) ...
    contact(pgContact2,pointContact2);                     // Unterer Schleifkontakt 
    commutator();                                          // Kommutator
    contact(pgContact1,pointContact1);                     // Oberer Schleifkontakt
    resistor();                                            // Widerstand 
    wires1();                                              // Dr�hte vom oberen Kontakt in Richtung rechte Buchse Messger�t
    crank(YC3);                                            // Handkurbel
    voltmeter(direction*5*omega*Math.abs(cosAlpha)/PI2);   // Messger�t
    }
  else {                                                   // Falls Wechselstrom-Generator (ohne Kommutator) ...
    contact(pgContact3,pointContact3);                     // Unterer Schleifkontakt
    leftRing(); rightRing();                               // Schleifringe
    contact(pgContact1,pointContact1);                     // Oberer Schleifkontakt
    resistor();                                            // Widerstand
    wires1();                                              // Dr�hte vom oberen Kontakt in Richtung rechte Buchse Messger�t
    crank(YC4);                                            // Handkurbel
    voltmeter(direction*5*omega*cosAlpha/PI2);             // Messger�t
    }
  diagram(360,65);                                         // Diagramm (Spannung in Abh�ngigkeit von der Zeit)
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

