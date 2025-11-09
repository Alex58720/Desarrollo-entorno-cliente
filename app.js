import { CrearGasto, listarGastos, anyadirGasto, borrarGasto, calcularTotalGastos, calcularBalance, mostrarPresupuesto, actualizarPresupuesto } from './js/gestionpresupuesto.js';

function loadPresupuesto() {
    const storedPresupuesto = localStorage.getItem('presupuesto');
    if (storedPresupuesto) {
        actualizarPresupuesto(parseFloat(storedPresupuesto));
    }
    updatePresupuestoDisplay();
}

function savePresupuesto() {
    localStorage.setItem('presupuesto', mostrarPresupuesto());
}

function loadExpenses() {
    const storedExpenses = localStorage.getItem('gastos');
    if (storedExpenses) {
        const gastosData = JSON.parse(storedExpenses);
        gastosData.forEach(gastoData => {
            const gasto = new CrearGasto(gastoData.descripcion, gastoData.valor, new Date(gastoData.fecha).toISOString(), ...gastoData.etiquetas);
            gasto.id = gastoData.id;
            anyadirGasto(gasto);
        });
    }
    displayExpenses();
    updateTotal();
}

function saveExpenses() {
    const gastos = listarGastos();
    localStorage.setItem('gastos', JSON.stringify(gastos.map(gasto => ({
        id: gasto.id,
        descripcion: gasto.descripcion,
        valor: gasto.valor,
        fecha: gasto.fecha,
        etiquetas: gasto.etiquetas
    }))));
}

function addExpense() {
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const tags = document.getElementById('tags').value.trim().split(',').map(tag => tag.trim()).filter(tag => tag);

    if (description && !isNaN(amount) && amount > 0) {
        const newExpense = new CrearGasto(description, amount, date, ...tags);
        anyadirGasto(newExpense);
        saveExpenses();
        displayExpenses();
        updateTotal();
        // Clear form
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
        document.getElementById('tags').value = '';
    } else {
        alert('Por favor, completa la descripción y un monto válido mayor a 0.');
    }
}

function displayExpenses() {
    const list = document.getElementById('expense-list');
    list.innerHTML = ''; // Clear existing list

    const gastos = listarGastos();
    gastos.forEach(gasto => {
        const li = document.createElement('li');
        const tagsText = gasto.etiquetas.length > 0 ? ` (Etiquetas: ${gasto.etiquetas.join(', ')})` : '';
        const dateText = `Fecha: ${new Date(gasto.fecha).toLocaleDateString()}`;
        li.innerHTML = `
            <strong>${gasto.descripcion}</strong>: ${gasto.valor.toFixed(2)} €<br>
            <small>${dateText}${tagsText}</small>
            <button onclick="deleteExpense(${gasto.id})">Eliminar</button>
        `;
        list.appendChild(li);
    });
}

function deleteExpense(id) {
    borrarGasto(id);
    saveExpenses();
    displayExpenses();
    updateTotal();
}

function updateTotal() {
    const total = calcularTotalGastos();
    const balance = calcularBalance();
    document.getElementById('total-amount').textContent = total.toFixed(2);
    document.getElementById('balance-amount').textContent = balance.toFixed(2);
}

function updatePresupuesto() {
    const presupuesto = parseFloat(document.getElementById('presupuesto').value);
    if (!isNaN(presupuesto) && presupuesto >= 0) {
        actualizarPresupuesto(presupuesto);
        savePresupuesto();
        updatePresupuestoDisplay();
        updateTotal();
    } else {
        alert('Por favor, ingresa un presupuesto válido.');
    }
}

function updatePresupuestoDisplay() {
    document.getElementById('presupuesto-amount').textContent = mostrarPresupuesto().toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPresupuesto();
    loadExpenses();
});
