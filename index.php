<!DOCTYPE html>
<html>
	<?php 
		error_reporting(E_ALL);
		ini_set('display_errors', 'On');
	?>
<head>
	<title>Infprog Oblig 4</title>
	<meta charset="utf-8" />
	<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css' />
	<link rel="stylesheet" type="text/css" href="stylesheet.css" />
</head>
<body>
	<main>
		<header>
			<h1>Gravity Simulator</h1>
		</header>
		<section>
			<div class="container">
				<button id="pause" onclick="pause();">Pause</button>
				<canvas id="myCanvas" width="800" height="600"></canvas>
				<form>
					<label class="gravity">Gravity</label>
					<input type="range" min="0" max="2" value="0.6" step="0.1" id="gravity" onchange="changeValues();"/>

					<input type="range" min="0" max="1" value="0.8" step="0.05" id="friction" onchange="changeValues();" />
					<label class="friction">Friction</label>
				</form>
			</div>
			<div class="explanation">
				<p>Dette er en gravitasjons simulering. Trykk på canvas for å lage en ball. Den vil ha tilfeldig størrelse, farge, retning og hastighet. Du kan plukke opp baller ved å holde ned venstre musetast, og du kan slenge den i en retning basert på farten av musa di når du slepper knappen. Ballene vil også sprette av hverandre. Gravity og slideren går fra 0 til 2 med intervaller på 0,1. Hvis gravity er 0, så vil ikke sirkelen aksellerere, men får høyere aksellerasjon jo mer du skrur opp slideren. Friction fungerer på samme måte, men litt motsatt. Friction går fra 0 til 1 med intervaller på 0,05. Hvis friction er 0, vil ballen miste all sin energi når den treffer en vegg, men hvis den er 1 vil den ikke miste noe energi (Kan miste litt likevel ser det ut som).</p>
				<p>På høyre side er det en form får å åpne eller lagre et "scenario". Dette vil si at du kan lagre den simuleringen du har på skjermen nå på serveren og hente den igjen fra listen. Anbefaler og bruke pause-knappen først så alt ikke har stoppet før du har sendt inn filen :)</p>
				<p>Jo fler baller du har, jo mer buggy blir det, dette er pga dårlig formel for å sørge for at en kollisjon ikke hender mer enn en gang per frame. Hadde ikke tid til å fikse dette før innlevering. Hvis du finner andre bugs er det bare å legge en kommentar på github!</p>
				<p>Kildekode finner du på <a href="https://github.com/TheRedSock/grav-simulation">github prosjektet</a>.</p>
			
				<div id="info"></div>
			<div id="submit">
				<form class="pure-form pure-form-stacked">
					<label>Velg et scenario</label>
					<select id="scenlist">
						<?php

							// Henter inneholdet i mappen med filene til scenarioene og legger det i variabel.
							$dir = 'scenarios';
							$files = scandir($dir);

							// Teller antall mengder i mappen (dette inneholder to tomme verdier brukt for mappenavigasjon).
							$fileslength = count($files);
							
							// Siden den har 2 tomme verdier, starter vi tellinga på 2.
							for ($i=2; $i < ($fileslength); $i++) {

								// Eksploderer på punktum, siden filene heter navn.json.
								$currentfile = explode(".", $files[$i]);

								// Printer ut første verdi inne i option tag for å legge det i drop down menyen.
								echo '<option>' . $currentfile[0] . '</option>';
							}
						?>
					</select>

					<button type="button" onclick="getScenario()" class="pure-button pure-button-primary">Åpne scenario</button>

					<label>Eller lagre dette scenarioet</label>
					<input type="text" placeholder="scenario name" id="scenname" name="scenname" />

					<button type="button" onclick="saveScenario()" class="pure-button pure-button-primary">Lagre scenario</button>
				</form>
			</div>
			<script type="text/javascript" src="script.js"></script>
		</section>
		<section class="explanation">
			<h1>Oblig 5:</h1>
			<p>Her er en <a href="studenter.json">link</a> til oppgave 1, JSON struktur for lagring av studenter og dems personinfo.</p>
			<p>For oppgave 2 har jeg valgt å legge til lagring av persistent data på oblig 4, som var alternativ 2. Jeg har gjort så du kan lagre et bilde av simuleringen, og fortsette fra dette punktet via lasting av fil.</p>
		</section>
	</main>
</body>
</html>
