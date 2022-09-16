// viendo el proyecto funcionando podemos ver que vamos a definir 2 objetos

// CONSTRUCTORES
// creamos la estructura de nuestro objeto
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};

// vamos a crear un proto del seguro que realiza la cotizacion con los datos cargados
Seguro.prototype.cotizarSeguro = function() {
    /* tenemos los valores porcentuales segun la marca
        1= americano 1.15
        2= asiatico 1.05
        3= europeo 1.35
    */

    // creamos dos variables, una base del presupuesto para todos y una cantidad final que devuelve
    let cantidad;
    const base = 2000;

    // utilizamos un switch con este tipo de casos, tiene como obligatorio poner al final un default break y en cada case tambien va break
    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    };

    // leemos el año y por cada año que bajamos se le resta un 3% a la cotizacion

    // tenemos que sacar la diferencia de años, con esa diferencia sabemos cuanto descontar
    const diferencia = new Date().getFullYear() - this.year;
    
    cantidad -= ((diferencia * 3) * cantidad) / 100;


    // si el seguro es basico se multiplica por un 30% mas
    // si el seguro es completo se multiplica por 50% mas
    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    };

    // console.log(cantidad);
    // console.log(this.marca);

    return cantidad;
};

// el otro objeto es de la interfaz de usuario y como no tiene ninguna propiedad en su objeto no hace falta poner function en el proto creado
function UI() {};

// creamos un proto para llenar opciones, al no hacer uso de this se puede utilizar un arrow, esto es para el campo de años para que se llenen automaticamente con la fecha actual hasta 20 años de antiguedad
UI.prototype.llenarOpciones = function() {

    // los años que van a ir dentro del select
    const max = new Date().getFullYear(),
          min = max - 20;
    
    // vamos a llenar el select de los años
    const selectYear = document.querySelector('#year');
    
    // ahora con un for vamos a iterar sobre los años y mostrarlos en el select
    for(let i = max; i >= min; i--) {
        let option = document.createElement('option'); // creamos los options que van adentro del select
        option.value = i; // en los options va el value
        option.textContent = i;
        selectYear.appendChild(option);
    };
};

// este proto es para mostrar mensajes
UI.prototype.mostrarMensaje = function(mensaje, tipoAlerta) {
    const div = document.createElement('div');
    
    // aca comprobamos el tipo de mensaje
    if(tipoAlerta === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    };
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // ahora lo insertamos en el formulario
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
};

// creamos el proto para mostrar el resultado
UI.prototype.mostrarResultado = function(seguro, total) {
    // aca vamos a obtener todos los datos del seguro que pasamos, del objeto seguro un destructuring
    const {marca, year, tipo} = seguro;

    let auto;
    // para las marcas usamos un switch
    switch(marca) {
        case '1':
            auto = 'Americano';
            break;
        case '2':
            auto = 'Asiatico';
            break;
        case '3':
            auto = 'Europeo';
            break;
        default:
            break;
    };

    // vamos a mostrar el resultado todo creado en un div
    const div = document.createElement('div');
    div.classList.add('mt-10');

    // creamos el html que vamos a insertar dentro del div resultado
    div.innerHTML = `  
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${auto}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo Seguro: <span class="font-normal">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
        `;
    
    // seleccionamos el div de resultado donde vamos a crearlo
    const resultadoDiv = document.querySelector('#resultado');
    

    // aca vamos a mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
        // ejecutamos el codigo de agregar al html una vez eliminado el spinner y el cartel de cotizando
        resultadoDiv.appendChild(div);
    }, 3000);

};

//  instanciar el select de los años
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
});

// aca los event listeners
eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
};

// creamos la funcion de cotizar, NO OLVIDARSE DEL PREVENT DEFAULT
function cotizarSeguro(e) {
    e.preventDefault();

    // leer la marca seleccionada
    const marca =  document.querySelector('#marca').value; // ACORDARSEEEEE EL VALUE DEVUELVE EL VALOR DE LA SELECCION
   
    // leer el año seleccionado
    const year = document.querySelector('#year').value;


    // leer el tipo de poliza seleccionado
    const tipo = document.querySelector('input[name="tipo"]:checked').value; // este es un selector de css y que este checked

    // aca colocamos si pasa la validacion
    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Seleccione en todos los campos', 'error');
        return;
    }

    // si no cumple el if, pasa para esta parte
    ui.mostrarMensaje('cotizando....', 'correcto');

    // aca eliminamos si hay resultados previos , seleccionamos div dentro del div resultado, si hay un div ahi quiere decir que ya hubo cotizacion
    const resultados = document.querySelector('#resultado div');
    if(resultados != null) {
        resultados.remove();
    };

    // si pasa para esta parte tendriamos que instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    // console.log(seguro);
    const total = seguro.cotizarSeguro();
 
    // utilizar el prototype que va a cotizar el seguro
    ui.mostrarResultado(seguro, total);
};