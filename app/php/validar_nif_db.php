<?php
	header('Access-Control-Allow-Origin: *');
	/* Descomentaríamos la siguiente línea para mostrar errores de php en el fichero: */
	//ini_set('display_errors', '1');
	/* Definimos los parámetros de conexión con la bbdd: */
	$dbinfo = "mysql:dbname=eguzkicamarero_users;host=localhost";
	$user = "123456";
	$pass = "123456";
	//Nos intentamos conectar:
	try {
		/* conectamos con bbdd e inicializamos conexión como UTF8 */
		$db = new PDO($dbinfo, $user, $pass);
		$db->exec('SET CHARACTER SET utf8');
	} catch (Exception $e) {
		echo "La conexi&oacute;n ha fallado: " . $e->getMessage();
	}
	/* Para hacer debug cargaríamos a mano el parámetro, descomentaríamos la siguiente línea: */
	//$_REQUEST['nif'] = "73003600A";
	if (isset($_REQUEST['nif'])) {
		/* La línea siguiente la podemos descomentar para ver desde firebug-xhr si se pasa bien el parámetro desde el formulario */
		//echo $_REQUEST['nif'];
		$nif = $_REQUEST['nif'];
		$sql = $db->prepare("SELECT * FROM usuarios WHERE cif_nif=?");
		$sql->bindParam(1, $nif, PDO::PARAM_STR);
		$sql->execute();

		$valid = '"true"';
		if ($sql->rowCount() > 0) {
			$valid='"NIF ya existente"';
		}
	}
	echo $valid;
	$sql=null;
	$db=null;
?>
