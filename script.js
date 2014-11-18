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
var isPaused = false;
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
					     getRandomArbitrary(-20, 21), 
					     getRandomArbitrary(-20, 21));

		// Legger objektet i en array så det er lett å kalle på alle objektene.
		circleArray.push(newCircle); 
	} 
	else {
		// Ellers reset mouseDownBoolean. 
		mouseDownBoolean = false;
	}
});

// Funksjon som pauser bildet når du klikker på knappen.
function pause(){
	pauseButton = document.getElementById('pause');

	// Hvis den ikke er pauset:
	if(isPaused === false) {

		// Sett den til pauset.
		isPaused = true;

		// Endre grafikken til knappen.
		pauseButton.innerHTML = "Unpause";
		pauseButton.style.marginLeft = "45%";
	}

	// Ellers hvis den er pauset:
	else {

		// Sett den tl ikke pauset.
		isPaused = false;

		// Endre grafikken til knappen.
		pauseButton.innerHTML = "Pause";
		pauseButton.style.marginLeft = "46%";
	}
}

// Funksjon som henter scenarioet du har valgt.
function getScenario() {

	// Legger valgte element i listen i en variabel.
	var list = document.getElementById('scenlist');
	var selectedValue = list.options[list.selectedIndex].text;

	// Validering.
	if(selectedValue.length === 0) {
		alert('Du må velge et scenario.');
	}
	else {

		// AJAX Request for å lese filen med navnet til scenarioet du valgte.
		var request = new XMLHttpRequest();
		request.open('GET', 'scenarios/' + selectedValue + '.json', false);
		request.send(null);
		var response = request.responseText;
		var dataObject = JSON.parse(response);
		
		// Gjør om circleArray til objektene du hentet fra JSON filen.
		circleArray = dataObject.baller;
	}
}

// Funksjon som lagrer scenarioet du har på skjermen.
function saveScenario() {
	var scenname = document.getElementById('scenname').value;
	
	// Validering.
	if (scenname.length === 0) {
		alert('Du må fylle ut navnet til scenarioet.');
	}
	else {

		// Legger arrayen av baller inn i et objekt.
		var scenario = {
			baller: circleArray
		};

		// Skriver dette objektet som tekst inn i en variabel.
		var circleJSON = JSON.stringify(scenario);

		// AJAX request for å poste informasjonen til et PHP script.
		var request = new XMLHttpRequest();
		request.open('POST', 'savescen.php', false);
		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send('scenname=' + scenname + '&jsonstring=' + circleJSON);

		// Refresh siden.
		location.reload();
	}
}

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

					// Kalkuler kollisjonsvinkel:
	 				var phi = Math.atan2(dy, dx);

	 				// Kalkuler vinkel på hver vektor:
	 				var d1 = Math.atan2(u1y, u1x);
	 				var d2 = Math.atan2(u2y, u2x);

	 				// Kalkuler absoluttverdi på hver vektor:
	 				var mag1 = Math.sqrt((u1x * u1x) + (u1y * u1y));
	 				var mag2 = Math.sqrt((u2x * u2x) + (u2y * u2y));
	 				
					// Sett nye vektorer:
	 				var newu1x = mag1 * Math.cos(d1 - phi);
	 				var newu1y = mag1 * Math.sin(d1 - phi);
	 				var newu2x = mag2 * Math.cos(d2 - phi);
	 				var newu2y = mag2 * Math.sin(d2 - phi);
	 				
	 				// Del 1 av formelen (http://en.wikipedia.org/wiki/Elastic_collision#Two-Dimensional_Collision_With_Two_Moving_Objects):
	 				var v1x = (((m1 - m2) * newu1x) + ((2 * m2) * newu2x)) / (m1 + m2);
	 				var v1y = newu1y;
	 				var v2x = (((m2 - m1) * newu2x) + ((2 * m1) * newu1x)) / (m1 + m2);
	 				var v2y = newu2y;

	 				// Del 2 av formelen:
	 				circleArray[i].vx = (Math.cos(phi) * v1x) + (Math.cos(phi + Math.PI/2) * v1y);
	 				circleArray[i].vy = (Math.sin(phi) * v1x) + (Math.sin(phi + Math.PI/2) * v1y);
	 				circleArray[j].vx = (Math.cos(phi) * v2x) + (Math.cos(phi + Math.PI/2) * v2y);
	 				circleArray[j].vy = (Math.sin(phi) * v2x) + (Math.sin(phi + Math.PI/2) * v2y);
	 				
	 				// Enkel formel for å hindre klistring av baller, ikke optimal.
	 				circleArray[i].x += circleArray[i].vx;
	 				circleArray[j].x += circleArray[j].vx;
	 				circleArray[i].y += circleArray[i].vy;
	 				circleArray[j].y += circleArray[j].vy;
	 				
	 				// Friksjon når ballene kolliderer med hverandre.
	 				circleArray[i].vx *= bounceFactor;
	 				circleArray[i].vy *= bounceFactor;
	 				circleArray[j].vx *= bounceFactor;
	 				circleArray[j].vy *= bounceFactor;
			
					// Disse to objektene har nå kollidert, med dette kan de ikke kollidere med hverandre igjen denne framen.
	 				circleArray[i].col = true;
	 				circleArray[j].col = true;
	 				
	 				/* Et forsøk på anti-stick;
	 				X og Y kordinatene til kollisjonspunktet:
	 				colX = ((x1 * m2) + (x2 * m1)) / (m1 + m2);
					colY = ((y1 * m2) + (y2 * m1)) / (m1 + m2);

					// Lengen mellom kordinatene til ballene og kollisjonspunktet.
					colDif1 = Math.sqrt(Math.pow((x1 - colX), 2) + Math.pow((y1 - colY), 2));
					colDif2 = Math.sqrt(Math.pow((x2 - colX), 2) + Math.pow((y2 - colY), 2));

					// Hvis farten er i negativ retning:
					if (circleArray[i].vx < 0) {

						// Legg til negativ differanse av størrelse til ballen og lendgen til kollisjonspunkt.
						circleArray[i].x += (m1 - colDif1) * -1;
					} else {

						// Ellers legg til positiv av det samme.
						circleArray[i].x += (m1 - colDif1);
					}

					// Resten er likt det over barre på de forskjellige vektorene.
					if (circleArray[i].vy < 0) {
						circleArray[i].y += (m1 - colDif1) * -1;
					} else {
						circleArray[i].y += (m1 - colDif1);
					}

					if (circleArray[j].vx < 0) {
						circleArray[j].x += (m2 - colDif2) * -1;
					} else {
						circleArray[j].x += (m2 - colDif2);
					}

					if (circleArray[j].vy < 0) {
						circleArray[j].y += (m2 - colDif2) * -1;
					} else {
						circleArray[j].y += (m2 - colDif2);
					}*/
 				} 
 			}
 		}
	}
}

// Funksjon som skriver ut informasjon om ballen du har selected.
function ballInfo(i) {
	info.style.display = 'block';
	var constants = '<span class="infoTitle">Constants:</span><br>',
			fric = '<span class="information">Friction: ' + bounceFactor + '</span><br>',
			grav = '<span class="information">Gravity: ' + gravity + '</span><br>';

	if (circleArray[i].sel === true) {	
		var	title = '<span class="infoTitle">Ball ' + (i + 1) + ':</span><br>',
			size = '<span class="information">Radius: ' + (circleArray[i].r).toFixed(2) + 'px</span><br>',
			color = '<span class="information">Color: ' + circleArray[i].clr + '</span><br>',
			space = '<br>',
			coordinates = '<span class="information">X - Y Coordinates: (' + (circleArray[i].x).toFixed(2) + ') - (' + (circleArray[i].y).toFixed(2) + ')</span><br>',
			velocities = '<span class="information">X - Y Velocities: (' + (circleArray[i].vx).toFixed(2) + ') - (' + (circleArray[i].vy).toFixed(2) + ')</span><br>',
			collision = '<span class="information">Is colliding: ' + circleArray[i].col + '.</span>';

		counter++;
		info.innerHTML = constants + fric + grav + space + title + size + color + space + coordinates + velocities + collision;
	} 
}

// Kjører funksjonen for å sette den i gang.
animate();
