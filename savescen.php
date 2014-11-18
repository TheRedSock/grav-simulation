<?php

	// Error reporting.
	error_reporting(E_ALL);
	ini_set('display_errors', 'On');

	// Henter POST dataen.
	$name = $_POST['scenname'];
	$jsonstring = $_POST['jsonstring'];

	//Lager en ny fil med navnet fra POST med JSON filtype.
	$file = fopen('scenarios/' . $name . '.json', 'w');

	// Skriver JSON teksten fra POST inn i JSON filen.
    fwrite($file, $jsonstring);

    // Lukker filen.
    fclose($file);
?>
