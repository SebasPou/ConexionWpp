const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

//Inicializas los "imports"
const servidor = express(); // Inicializas el servidor (express)
const client = new Client({ // Inicializas el whatsapp web
	authStrategy: new LocalAuth({
        dataPath: 'auth'
    })
});

//Eventos de whastsapp web
client.on('qr', (qr) => {
    console.log('QR recibido');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Web listo');
});

client.on('message', (message) => {});

client.initialize();

//Eventos del servidor Express
servidor.listen(3000, () => { // Inicializamos Express en el puerto 3000
  console.log('Servidor Node.js iniciado en el puerto 3000');
});

servidor.get('/buscarPorCedula', (peticion_desde_django, respuesta_para_django) => {
	const telefono 	= peticion_desde_django.query.telefono;
	const cedula 	= peticion_desde_django.query.cedula;
	const nombres 	= peticion_desde_django.query.nombres;
	var chatId 		= "593"+ telefono.slice(1) +"@c.us"; //número del cliente (+ @c.us)
	var mensaje 	= "Hola "+nombres+", su cita ha sido registrada. Por favor espere el mensaje de confirmación.";
	
	client.sendMessage(chatId, mensaje);
  
	console.log("Notificación enviada a: "+telefono);
	respuesta_para_django.send("whatsappp_enviado");
});

servidor.get('/confimarCita', (peticion_desde_django, respuesta_para_django) => {
	const telefono 	= peticion_desde_django.query.telefono;
	const cedula 	= peticion_desde_django.query.cedula;
	const nombres 	= peticion_desde_django.query.nombres;
	const fecha 	= peticion_desde_django.query.fecha;
	const hora	 	= peticion_desde_django.query.hora.substring(0,5);
	const local	 	= peticion_desde_django.query.local;
	const url 		= "https://07c9-181-39-28-7.ngrok-free.app.app/consultar_cita/"+cedula;
	var chatId 		= "593"+ telefono.slice(1) +"@c.us"; //número del cliente (+ @c.us)
	
	var mensaje1 	= "Hola "+nombres+", tu cita ha sido CONFIRMADA. El día "+fecha+" a las "+hora+" horas en el local '"+local+"'";
	var mensaje2 	= "Consulta el estado de tu cita en:\n\n "+url;

	client.sendMessage(chatId, mensaje1);
	client.sendMessage(chatId, mensaje2);
  
	console.log("Notificación enviada a: "+telefono);
	respuesta_para_django.send("whatsappp_enviado");
});

servidor.get('/cancelarCita', (peticion_desde_django, respuesta_para_django) => {
	const telefono 	= peticion_desde_django.query.telefono;
	const cedula 	= peticion_desde_django.query.cedula;
	const nombres 	= peticion_desde_django.query.nombres;
	const fecha 	= peticion_desde_django.query.fecha;
	const hora	 	= peticion_desde_django.query.hora.substring(0,5);
	const local	 	= peticion_desde_django.query.local;
	var chatId 		= "593"+ telefono.slice(1) +"@c.us";
	var mensaje 	= "Hola "+nombres+", tu cita del día "+fecha+" a las "+hora+" horas en el local '"+local+"' ha sido CANCELADA.";

	client.sendMessage(chatId, mensaje);
  
	console.log("Notificación enviada a: "+telefono);
	respuesta_para_django.send("whatsappp_enviado");
});

