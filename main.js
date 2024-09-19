function validarIngreso(valor) {
    return !isNaN(valor) && valor >= 0;
}

function guardarEnStorage(data) {
    localStorage.setItem('datosFinancieros', JSON.stringify(data));
}

function cargarDeStorage() {
    const datosGuardados = localStorage.getItem('datosFinancieros');
    return datosGuardados ? JSON.parse(datosGuardados) : null;
}

function reiniciarDatos() {
    localStorage.removeItem('datosFinancieros');
    alert("Los datos han sido reiniciados.");
    window.location.reload();
}

function mostrarResumen(ingresos, presupuesto, ahorros, gastosTotales) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h2>Resumen Financiero</h2>
        <p>Ingresos: $${ingresos}</p>
        <p>Gastos Totales: $${gastosTotales}</p>
        <p>Ahorros: $${ahorros}</p>
    `;
}

function calcularAhorros(ingresos, presupuesto) {
    const gastosTotales = Object.values(presupuesto).reduce((total, gasto) => total + gasto, 0);
    return { ahorros: ingresos - gastosTotales, gastosTotales };
}

function simuladorFinanciero() {
    const ingresos = parseFloat(document.getElementById('ingresos').value);
    const categorias = ['vivienda', 'alimentacion', 'transporte', 'entretenimiento', 'salud'];
    const presupuesto = {};

    let datosValidos = true;

    categorias.forEach(categoria => {
        const valor = parseFloat(document.getElementById(categoria).value);
        if (!validarIngreso(valor)) {
            alert(`Por favor, ingresa un valor válido para ${categoria}`);
            datosValidos = false;
        } else {
            presupuesto[categoria] = valor;
        }
    });

    if (validarIngreso(ingresos) && datosValidos) {
        const { ahorros, gastosTotales } = calcularAhorros(ingresos, presupuesto);
        mostrarResumen(ingresos, presupuesto, ahorros, gastosTotales);

        guardarEnStorage({ ingresos, presupuesto, ahorros, gastosTotales });
    } else {
        alert("Por favor, ingresa valores válidos en todos los campos.");
    }
}

function initSimulador() {
    const datosGuardados = cargarDeStorage();

    if (datosGuardados) {
        document.getElementById('ingresos').value = datosGuardados.ingresos;
        for (let categoria in datosGuardados.presupuesto) {
            document.getElementById(categoria).value = datosGuardados.presupuesto[categoria];
        }
        mostrarResumen(datosGuardados.ingresos, datosGuardados.presupuesto, datosGuardados.ahorros, datosGuardados.gastosTotales);
    }
}

document.getElementById('reiniciar').addEventListener('click', reiniciarDatos);

document.getElementById('calcular').addEventListener('click', simuladorFinanciero);
initSimulador();
