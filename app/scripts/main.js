
$("#formula").validate({
	rules:{
		nombre:'required',
		apellidos:'required',
		telefono:{
			required:true,
			digits:true,
			maxlength:9,
			minlength:9
		},
		email:{
			required:true,
			email:true,
			remote:'php/validar_email_db.php'
		},
		emailConf:{
			equalTo:email
		},
		nif:{
			required: function() {
				return $('#particular').is(':checked');
			},
			nif:'nif',
			remote:'php/validar_nif_db.php'
		},
		cif:{
			required: function() {
				return $('#empresa').is(':checked');
			},
			cif:'cif'
		},
		nombre_empresa:'required',
		direccion:'required',
		zip:{
			required:true,
			maxlength:5,
			digits:true
		},
		provincia:'required',
		localidad:'required',
		pais:'required',
		iban:{
			required:true,
			iban:'iban'
		},
		usuario:{
			required:true,
			minlength:4
		},
		pass:{
			required:true,
			minlength:6  
		},
		passConf:{
			equalTo:pass
		}
	},
	messages: {
		email: {
			remote: "Correo ya utilizado."
		},
		nif: {
			remote: "NIF ya utilizado."
		}
	},	
	// Se pide la confirmacion de alta si todo es correcto
    submitHandler : function() {
        var usuario=$('#usuario').val();
        var cuota=$('input[name="pago"]:checked').val();
		var aceptar=confirm('Va a dar de alta el usuario: '+usuario+' y se cobrara la primera cuota de '+cuota+' € ¿Desea continuar?');
		if (aceptar==1){ // ===true
			alert('Nuevo usuario dado de alta: '+usuario);
		}
	}
});

//Nombre de usuario equivalente al email
$('#email').focusout(function() {
    $('#usuario').val($('#email').val());
});

// Si el país España esta seleccionado, capturamos el Código Postal, recortamos los dos primeros dígitos.
// Despues lo comparamos con el campo de la Provincia, para selección automatica y ponemos la localidad
// Añadimos ceros si es necesario al zip
$('#zip').focusout(function() {
	if ($('#pais option:selected').val() == 'ES/0/0') {
		if ($(this).val() != '') {
			var dato = $(this).val();
			if (dato.length >= 2) {
				dato = dato.substring(0, 2);
			}
			$('#provincia').val(dato);
			$('#localidad').val($('#provincia option[value='+dato+']').text());
		}
	}
	var zip = $(this).val();
	var resultado=5-zip.length;
	for (var i=0;i<resultado;i++){
		zip='0'+zip;  
	}
	$(this).val(zip);
});

// Se actualizan los apellidos de facturacion si cambia los datos.
$('#apellidos').focusout(function (){
	if ($('#particular').is(':checked')){
		$('#nombre_empresa').val($('#nombre').val()+' '+$('#apellidos').val());
    }
});
// Se actualiza el nombre de facturacion si cambia los datos.
$('#nombre').focusout(function (){
	if ($('#particular').is(':checked')){
		$('#nombre_empresa').val($('#nombre').val()+' '+$('#apellidos').val());
    }
});

// Se cambian los label si es particular.
$('#particular').change(function (){
	$('#label_nombre').text('Nombre:');  
	$('#label_nif').text('Nif:'); 
	$('#nombre_empresa').val($('#nombre').val()+' '+$('#apellidos').val());
	$('label[for="cif"]').hide();
	$('#cif').val('').hide();
	$('#nif').show();
	$('label[for="nif"]').show();
});

// Se cambian los label si es empresa.
$('#empresa').change(function (){
	$('#nombre_empresa').val('');
	$('#label_nombre').text('Empresa:');
	$('#label_nif').text('Cif:');
	$('label[for="nif"]').hide();
	$('#nif').val('').hide();
	$('#cif').show();
	$('label[for="cif"]').show();
});

// Metodo para comprobar el cif.
jQuery.validator.addMethod('cif', function(value, element) {
	value = value.replace(/[\s-]/g, ''); // quitar espacios o guiones
	var par = 0;
	var non = 0;
	var letras = 'ABCDEFGHKLMNPQS';
	var let = value.charAt(0);
	if (value.length==0){
		return true;
	}
	if (value.length!=9) {
		return false;
	}
	if (letras.indexOf(let.toUpperCase())==-1) {
		return false;
	}
	for (zz=2;zz<8;zz+=2) {
		par = par+parseInt(value.charAt(zz));
	}
	for (zz=1;zz<9;zz+=2) {
		nn = 2*parseInt(value.charAt(zz));
		if (nn > 9) nn = 1+(nn-10);
			non = non+nn;
	}
	var parcial = par + non;
	var control = (10 - ( parcial % 10));
	if (control==10){
		control=0;
	}
	if (control!=value.charAt(8)) {
		return false;
	}
	return true;
}, 'CIF incorrecto'); 

// Metodo para comprobar el nif.
jQuery.validator.addMethod('nif', function(value, element) {
	if(/^([0-9]{8})*[a-zA-Z]+$/.test(value)){
		var numero = value.substr(0,value.length-1);
		var letra = value.substr(value.length-1,1);
		numero = numero % 23;
		var letter='TRWAGMYFPDXBNJZSQVHLCKET';
        letra=letra.toUpperCase();
		letter=letter.substring(numero,numero+1);
		if (letter==letra)
			return true;
		return false;
	}
}, 'NIF incorrecto.');

// Metodo para comprobar el IBAN.
jQuery.validator.addMethod('iban', function(value, element) {
	// some quick simple tests to prevent needless work
	if (this.optional(element)) {
		return true;
	}
	if (!(/^([a-zA-Z0-9]{4} ){2,8}[a-zA-Z0-9]{1,4}|[a-zA-Z0-9]{12,34}$/.test(value))) {
		return false;
	}

	// check the country code and find the country specific format
	var iban = value.replace(/ /g,'').toUpperCase(); // remove spaces and to upper case
	var countrycode = iban.substring(0,2);
	var bbancountrypatterns = {
		'AL': '\\d{8}[\\dA-Z]{16}',
		'AD': '\\d{8}[\\dA-Z]{12}',
		'AT': '\\d{16}',
		'AZ': '[\\dA-Z]{4}\\d{20}',
		'BE': '\\d{12}',
		'BH': '[A-Z]{4}[\\dA-Z]{14}',
		'BA': '\\d{16}',
		'BR': '\\d{23}[A-Z][\\dA-Z]',
		'BG': '[A-Z]{4}\\d{6}[\\dA-Z]{8}',
		'CR': '\\d{17}',
		'HR': '\\d{17}',
		'CY': '\\d{8}[\\dA-Z]{16}',
		'CZ': '\\d{20}',
		'DK': '\\d{14}',
		'DO': '[A-Z]{4}\\d{20}',
		'EE': '\\d{16}',
		'FO': '\\d{14}',
		'FI': '\\d{14}',
		'FR': '\\d{10}[\\dA-Z]{11}\\d{2}',
		'GE': '[\\dA-Z]{2}\\d{16}',
		'DE': '\\d{18}',
		'GI': '[A-Z]{4}[\\dA-Z]{15}',
		'GR': '\\d{7}[\\dA-Z]{16}',
		'GL': '\\d{14}',
		'GT': '[\\dA-Z]{4}[\\dA-Z]{20}',
		'HU': '\\d{24}',
		'IS': '\\d{22}',
		'IE': '[\\dA-Z]{4}\\d{14}',
		'IL': '\\d{19}',
		'IT': '[A-Z]\\d{10}[\\dA-Z]{12}',
		'KZ': '\\d{3}[\\dA-Z]{13}',
		'KW': '[A-Z]{4}[\\dA-Z]{22}',
		'LV': '[A-Z]{4}[\\dA-Z]{13}',
		'LB': '\\d{4}[\\dA-Z]{20}',
		'LI': '\\d{5}[\\dA-Z]{12}',
		'LT': '\\d{16}',
		'LU': '\\d{3}[\\dA-Z]{13}',
		'MK': '\\d{3}[\\dA-Z]{10}\\d{2}',
		'MT': '[A-Z]{4}\\d{5}[\\dA-Z]{18}',
		'MR': '\\d{23}',
		'MU': '[A-Z]{4}\\d{19}[A-Z]{3}',
		'MC': '\\d{10}[\\dA-Z]{11}\\d{2}',
		'MD': '[\\dA-Z]{2}\\d{18}',
		'ME': '\\d{18}',
		'NL': '[A-Z]{4}\\d{10}',
		'NO': '\\d{11}',
		'PK': '[\\dA-Z]{4}\\d{16}',
		'PS': '[\\dA-Z]{4}\\d{21}',
		'PL': '\\d{24}',
		'PT': '\\d{21}',
		'RO': '[A-Z]{4}[\\dA-Z]{16}',
		'SM': '[A-Z]\\d{10}[\\dA-Z]{12}',
		'SA': '\\d{2}[\\dA-Z]{18}',
		'RS': '\\d{18}',
		'SK': '\\d{20}',
		'SI': '\\d{15}',
		'ES': '\\d{20}',
		'SE': '\\d{20}',
		'CH': '\\d{5}[\\dA-Z]{12}',
		'TN': '\\d{20}',
		'TR': '\\d{5}[\\dA-Z]{17}',
		'AE': '\\d{3}\\d{16}',
		'GB': '[A-Z]{4}\\d{14}',
		'VG': '[\\dA-Z]{4}\\d{16}'
	};
	var bbanpattern = bbancountrypatterns[countrycode];
	// As new countries will start using IBAN in the
	// future, we only check if the countrycode is known.
	// This prevents false negatives, while almost all
	// false positives introduced by this, will be caught
	// by the checksum validation below anyway.
	// Strict checking should return FALSE for unknown
	// countries.
	if (typeof bbanpattern !== 'undefined') {
		var ibanregexp = new RegExp('^[A-Z]{2}\\d{2}' + bbanpattern + '$', '');
		if (!(ibanregexp.test(iban))) {
			return false; // invalid country specific format
		}
	}
	// now check the checksum, first convert to digits
	var ibancheck = iban.substring(4,iban.length) + iban.substring(0,4);
	var ibancheckdigits = '';
	var leadingZeroes = true;
	var charAt;
	for (var i =0; i<ibancheck.length; i++) {
		charAt = ibancheck.charAt(i);
		if (charAt !== '0') {
			leadingZeroes = false;
		}
		if (!leadingZeroes) {
			ibancheckdigits += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(charAt);
		}
	}
	// calculate the result of: ibancheckdigits % 97
    var cRest = '';
    var cOperator = '';
	for (var p=0; p<ibancheckdigits.length; p++) {
		var cChar = ibancheckdigits.charAt(p);
		cOperator = '' + cRest + '' + cChar;
		cRest = cOperator % 97;
    }
	return cRest === 1;
}, 'IBAN incorrecto.');

// Metodo para la contraseña
$('#pass').focusin(function () {
	$('#pass').complexify({}, function (valid, complexity) {
		$('#complex').attr('value',complexity);
	});
});

// Mensajes en español.
(function ($) {
	$.extend($.validator.messages, {
		required: 'Este campo es obligatorio.',
		email: 'Email incorrecto.',
		digits: 'Debes escribir dígitos.',
		equalTo: 'Campo incorrecto.',
		maxlength: $.validator.format('No debes escribir más de {0} caracteres.'),
		minlength: $.validator.format('Debes escribir al menos {0} caracteres.')		
	});
}(jQuery));
