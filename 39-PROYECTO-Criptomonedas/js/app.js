const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
	moneda: '',
	criptomoneda: '',
};
// crear promise
const obtenerCriptomonedas = (criptomonedas) =>
	new Promise((resolve) => {
		resolve(criptomonedas);
	});

document.addEventListener('DOMContentLoaded', () => {
	consultarCriptomonedas();
	formulario.addEventListener('submit', submitFormulario);
	criptoSelect.addEventListener('change', leerValor);
	monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
	const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

	fetch(url)
		.then((respuesta) => {
			return respuesta.json();
		})
		.then((resultado) => {
			// console.log(resultado.Data);
			return obtenerCriptomonedas(resultado.Data);
		})
		.then((criptomonedas) => {
			selectCriptomonedas(criptomonedas);
		});
}

function selectCriptomonedas(criptomonedas) {
	criptomonedas.forEach((cripto) => {
		const { Name, FullName } = cripto.CoinInfo;
		const option = document.createElement('option');
		option.value = Name;
		option.textContent = FullName;

		criptoSelect.appendChild(option);
	});
}

function leerValor(e) {
	objBusqueda[e.target.name] = e.target.value;
	console.log(objBusqueda);
}

function submitFormulario(e) {
	e.preventDefault();

	//Validar
	const { moneda, criptomoneda } = objBusqueda;
	if (moneda === '' || criptomoneda === '') {
		limpiarHTML(resultado);
		mostrarAlerta('Ambos casos son obligatorios');
		return;
	}

	// Consultar API
	consultarAPI();
}

function mostrarAlerta(mensaje) {
	if (!document.querySelector('.error')) {
		const divMensaje = document.createElement('div');
		divMensaje.classList.add('error');
		divMensaje.textContent = mensaje;

		formulario.appendChild(divMensaje);

		setTimeout(() => {
			divMensaje.remove();
		}, 3000);
	}
}
function consultarAPI() {
	const { moneda, criptomoneda } = objBusqueda;
	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

	mostrarSpinner();

	fetch(url).then((respuesta) => respuesta.json()).then((cotizacion) => {
		mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
	});
}

function mostrarCotizacionHTML(cotizacion) {
	limpiarHTML(resultado);
	const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

	const precio = document.createElement('p');
	precio.classList.add('precio');
	precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

	const precioAlto = document.createElement('p');
	precioAlto.innerHTML = `Precio más alto del día <span>${HIGHDAY}</span>`;

	const precioBajo = document.createElement('p');
	precioBajo.innerHTML = `Precio más bajo del día <span>${LOWDAY}</span>`;

	const ultimasHoras = document.createElement('p');
	ultimasHoras.innerHTML = `Validación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

	const ultimaActualizacion = document.createElement('p');
	ultimaActualizacion.innerHTML = `Última actualización <span>${LASTUPDATE}</span>`;

	resultado.appendChild(precio);
	resultado.appendChild(precioAlto);
	resultado.appendChild(precioBajo);
	resultado.appendChild(ultimasHoras);
	resultado.appendChild(ultimaActualizacion);
	//limpiarObj();
}

function limpiarObj() {
	objBusqueda.moneda = '';
	objBusqueda.criptomoneda = '';
}

function limpiarHTML(etiqueta) {
	while (etiqueta.firstChild) {
		etiqueta.removeChild(etiqueta.firstChild);
	}
}

function mostrarSpinner() {
	const spinner = document.createElement('p');
	spinner.classList.add('spinner');

	spinner.innerHTML = `
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	`;
	resultado.appendChild(spinner);
}
