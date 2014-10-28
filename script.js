// Funksjon som gjør lager animasjon på 60 FPS.
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || 
        		window.webkitRequestAnimationFrame || 
        		window.mozRequestAnimationFrame || 
        		window.oRequestAnimationFrame || 
        		window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

// Definerer globale variabeler for canvas, arrays, booleans, objekter og konstanter.
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var circleArray = [];
var mouseDownBoolean = false;
var clickBoolean = false;
var selectedCircle = [];
var bounceFactor = parseFloat(document.getElementById('friction').value);
var gravity = parseFloat(document.getElementById('gravity').value);
var mouse = {x: 0, y: 0};
var lastMouse = {x: 0, y: 0};
var mouseSpeed = {x: 0, y: 0};

// Event som henter posisjon til musa hver gang musa flytter på seg.
canvas.addEventListener('mousemove', function(evt){ 
	var rect = canvas.getBoundingClientRect();
    mouse.x = evt.clientX - rect.left; 
    mouse.y = evt.clientY - rect.top;
});

// Event funksjon for når musetast er nede.
canvas.addEventListener('mousedown', function() {
	
	// Definer variabler for å regne pytagoras.
	var xDistance = 0;
	var yDistance = 0;
	var xMouse = mouse.x;
	var yMouse = mouse.y;

	// Tømmer denne arrayen.
	selectedCircle = [];

	for (var i = 0; i < circleArray.length; i++) {

		// Pytagoras for å finne distanse. (sqrt((x1-x2)^2 + (y1-y2)^2))
		xDistance = xMouse - circleArray[i].x;
		yDistance = yMouse - circleArray[i].y;
		var distance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));

		// Hvis variabel distance er lik eller mindre radiusen til en av sirklene:
		if (distance <= circleArray[i].r) {

			// Boolean som forteller andre funksjoner at en sirkel er funnet.
			mouseDownBoolean = true;

			// Legg denne sirkelen i en array for å kalle på senere.
			selectedCircle.push(circleArray[i]);

			//Gå ut av for setningen.
			break;
		} 
		else {
			// Ellers reset mouseDownBoolean for å fortelle at alt er normalt.
			mouseDownBoolean = false;
		}
	}
	determineSpeed();
});

// Event funksjon for når musetast slippes.
canvas.addEventListener('mouseup', function(evt) {
	
	// Hvis mousedown ikke fant en sirkel:
	if (mouseDownBoolean === false) {

		// Lag nytt sirkel objekt på musepekeren innenfor canvas.
		var newCircle = new myCircle(mouse.x, 
									mouse.y, 
									getRandomArbitrary(5, 51), 
									0, //getRandomArbitrary(-20, 21), 
									0); //getRandomArbitrary(-20, 21));

		// Legger objektet i en array så det er lett å kalle på alle objektene.
		circleArray.push(newCircle); 
	} 
	else {
		// Ellers reset mouseDownBoolean. 
		mouseDownBoolean = false;
	}
});

function determineSpeed() {

	// Hvor ofte i millisekunder denne funksjonen skal kjøres.
	refreshInterval = 50;

	// Hastigheten på musa er forholdet på musa når fuksjonen kjøres og forrige gang den kjørte.
	mouseSpeed.x = mouse.x - lastMouse.x;
	mouseSpeed.y = mouse.y - lastMouse.y;

	// Setter verdien til forrige gang musa kjørte så den er klar for neste iterasjon.
	lastMouse.x = mouse.x;
	lastMouse.y = mouse.y;

	// Så lenge mousedown er sann, kjør setTimeout som kjører funksjonen hvert 'refreshInterval' millisekund.
	if (mouseDownBoolean) {
		setTimeout(determineSpeed, refreshInterval);	
	}
}

// Lager et tilfeldig tall mellom min og max (max exclusive). Tatt fra developer.mozilla.org.
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//Sørger for at konstantene oppdateres når slider'en endres.
function changeValues() {
	bounceFactor = parseFloat(document.getElementById('friction').value);
	gravity = parseFloat(document.getElementById('gravity').value);
}

// Object constructor for sirkelen.
function myCircle(x, y, r, vx, vy) {

	// X og Y posisjon til sirkelen i canvas.
	this.x = x; 
	this.y = y; 
	this.r = r; // radius på sirkelen (størrelse).
	
	// Vinkler som bestemmer hvor i sirkelen du skal slutte å tegne, kan brukes hvis du vil ha halvsirkel.
	this.sAngle = 0;
	this.eAngle = (Math.PI * 2);

	// Fart i x og y retning.
	this.vx = vx;
	this.vy = vy;

	// Random hex verdi for random farge. Tatt fra nett.
	this.clr = "#" + Math.floor(Math.random() * 16777215).toString(16);

	// Om den er i en kollisjon.
	this.col = false;
};

// Funksjon som tegner sirkelen i arrayen som den blir kalt på ved 'i'.
function drawCircle(i) {
	ctx.beginPath();
	ctx.arc(circleArray[i].x, circleArray[i].y, circleArray[i].r, circleArray[i].sAngle, circleArray[i].eAngle);
	ctx.fillStyle = circleArray[i].clr.toString();
	ctx.fill();	
}

// Animate funksjon som skal kjøres 60 ganger i sekundet.
function animate(evt) {

	// Tømmer canvas før den begynner å tegne.
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// For setning for å endre posisjon til alle ballene i arrayen.
	for (var i = 0; i < circleArray.length; i++) {

		// Hvis musa er klikket ned og har funnet noe:
		if (mouseDownBoolean === true) {
			//Hvis dette objektet i arrayen er lik den ballen som ble funnet:
			if (circleArray[i] === selectedCircle[0]) {

				// Posisjon til ballen er lik musa, og hastigheten blir lik hastigheten på ballen.
				circleArray[i].x = mouse.x;
				circleArray[i].y = mouse.y;
				circleArray[i].vx = mouseSpeed.x / 2;
				circleArray[i].vy = mouseSpeed.y / 2; 
			} 
			else {

				// Endre posisjon til ballen basert på konstantene.
				circleArray[i].vy += gravity;
				circleArray[i].x += circleArray[i].vx;
				circleArray[i].y += circleArray[i].vy; 
			}
		} 
		else {

			// Endre posisjon til ballen basert på konstantene.
			circleArray[i].vy += gravity;
			circleArray[i].x += circleArray[i].vx;
			circleArray[i].y += circleArray[i].vy; 
		}

		// Sjekker om sirkelen treffer en annen sirkel.
		checkCollision(i);

		// Sjekker om sirkelen treffer en vegg.
		checkDirection(i);

		// Tegner sirkelen.
		drawCircle(i);	
	}
	
	/* Tegning av objekter er ferdig, og vi anntar at det ikke er flere kollisjoner denne framen
	   Så vi setter alle objektene sin kollisjonsboolean til false. */
	if (circleArray.length > 0) {
		for (var i = 0; i < circleArray.length; i++) {
			circleArray[i].col = false;
		}
	}

	// Kaller på funksjonen som sørger for at den blir kjørt 60 ganger i sekundet.
	requestAnimFrame(function() {
		// Så kaller den på seg selv.
		animate();
	});
}

// Funksjon som sjekker om en sirkel treffer en vegg.
function checkDirection(i) {

	// Hvis den treffer bakken.
	if (circleArray[i].y + circleArray[i].r >= canvas.height) {

		// Sett sirkelen så den akkurat treffer veggen (så den ikke er x antall piksler forbi veggen).
		circleArray[i].y = canvas.height - circleArray[i].r;

		// Reverser retningen og reduser fart.
		circleArray[i].vy *= -bounceFactor;
		
		/* Ekstra bouncefactor når den treffer bakken.
		   Dette er for at den mister fart i x retning når y ikke endres mer.
		   Dette kan gjøres bedre. */
		circleArray[i].vx *= bounceFactor;
	}

	// De andre er identiske. (Utenom ekstra bouncefactor)
	
	// Hvis den treffer taket. 
	if (circleArray[i].y - circleArray[i].r <= 0) {
		circleArray[i].y = 0 + circleArray[i].r;
		circleArray[i].vy *= -bounceFactor;
	}

	// Hvis den treffer høyre vegg.
	if (circleArray[i].x + circleArray[i].r >= canvas.width) {
		circleArray[i].x = canvas.width - circleArray[i].r;
		circleArray[i].vx *= -bounceFactor;
	}

	// Hvis den treffer venstre vegg.
	if (circleArray[i].x - circleArray[i].r <= 0) {
		circleArray[i].x = 0 + circleArray[i].r;
		circleArray[i].vx *= -bounceFactor;
	}

	//Mister fortsatt litt fart pga reposisjoneringen selvom friksjon er 1.
}

function checkCollision(i) {
	//Går igjennom alle objektene igjen.
	for (var j = 0; j < circleArray.length; j++) {
	 	
	 	//Sjekker om objektet som er hentet fra animate() er lik objektet i denne iterasjonen.
	 	if (circleArray[i] != circleArray[j]) {

	 		//Pytagoras for å finne distansen mellom objektet fra animate() og objektet i denne iterasjonen.
	 		var dx = circleArray[i].x - circleArray[j].x;
	 		var dy = circleArray[i].y - circleArray[j].y;
	 		var distance = Math.sqrt((dx * dx) + (dy * dy));

	 		// Hvis distansen er mindre en summen av radiusen til objektene (altså en kollisjon):
	 		if (distance < circleArray[i].r + circleArray[j].r) {

	 			// Hvis ett av objektene ikke har kollidert denne framen:
 				if (circleArray[i].col === false || circleArray[j].col === false) {
 				
 					// Enklere variabler for attributtene til objektene.
	 				var x1 = circleArray[i].x;
	 				var x2 = circleArray[j].x;
	 				var y1 = circleArray[i].y;
	 				var y2 = circleArray[j].y;
	 				var u1x = circleArray[i].vx;
	 				var u2x = circleArray[j].vx;
	 				var u1y = circleArray[i].vy;
	 				var u2y = circleArray[j].vy;
	 				var m1 = circleArray[i].r;
	 				var m2 = circleArray[j].r;

	 				/* En dimensjonal elastisk støt formel for hver vektor.
	 				   Dette er ikke riktig formel. */
	 				circleArray[i].vx = ((u1x * (m1 - m2)) + (2 * (m2 * u2x))) / (m1 + m2);
	 				circleArray[j].vx = ((u2x * (m2 - m1)) + (2 * (m1 * u1x))) / (m1 + m2);
	 				circleArray[i].vy = ((u1y * (m1 - m2)) + (2 * (m2 * u2y))) / (m1 + m2);
	 				circleArray[j].vy = ((u2y * (m2 - m1)) + (2 * (m1 * u1y))) / (m1 + m2);

	 				// For å legge friksjon på støt mellom kuler.
	 				/*circleArray[i].vx *= bounceFactor;  
	 				circleArray[j].vx *= bounceFactor;
	 				circleArray[i].vy *= bounceFactor;
	 				circleArray[j].vy *= bounceFactor;*/
	 				
	 				/* For å dytte kuler vekk for å unngå kollisjon over flere frames.
	 				   Fungerer ikke optimalt.
	 				   Trenger noe som garanterer at ingen sirkler vil være inne i hverandre på en frame.
	 				   Har tenkt på å offsette kulene basert på forskjell mellom radius og kollisjonspunkt. */
	 				circleArray[i].x += circleArray[i].vx;
	 				circleArray[j].x += circleArray[j].vx;
	 				circleArray[i].y += circleArray[i].vy;
	 				circleArray[j].y += circleArray[j].vy;
			
					// Disse to objektene har nå kollidert, med dette kan de ikke kollidere med hverandre igjen denne framen.
	 				circleArray[i].col = true;
	 				circleArray[j].col = true;
 				} 
 			}
 		}
	}
}

// Kjører funksjonen for å sette den i gang.
animate();
