const input = document.querySelector('#input')
const elegirMoneda = document.querySelector('#select')
const resultado = document.querySelector('#resultado')
const convertir = document.querySelector('#buscar')
let chart = null

async function getDatos() {
    try {
        const res = await fetch('https://mindicador.cl/api/')
        const datos = await res.json()
        return datos
    } catch (e) {
        const conversor = document.querySelector('.conversor')
        if (conversor) conversor.remove()
        alert(`Ocurrió un error, intenta más tarde 🥹: ${e.message}`)
    }}

const configurarChart = (monedas) => {
    const fechas = monedas.serie.map((moneda) => 
    moneda.fecha.slice(0, 10)).slice(0, 10).reverse()

    const valores = monedas.serie.map((moneda) => 
    Number(moneda.valor)).slice(0, 10).reverse()
    const colorMoneda = monedas.codigo === 'euro' ? 'purple' : 'green'

    return {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: monedas.codigo,
                borderColor: colorMoneda,
                data: valores
            }]}}
}

async function getChart(moneda) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}`)
        return await res.json()
    } catch (e) {
        console.log(`No se puede obtener el gráfico: ${e.message}`)
    }
}

async function renderChart(moneda) {
    const monedas = await getChart(moneda)
    const config = configurarChart(monedas)
    const chartDom = document.querySelector('#grafico')
    chartDom.style.backgroundColor = 'white'
    chartDom.style.borderRadius = '10px'

    if (chart) chart.destroy()
    chart = new Chart(chartDom, config)
    chart.resize(800, 800)
}

convertir.addEventListener('click', async () => {
    try {
        const monedas = await getDatos()
        const cambio = elegirMoneda.value
        const pesoCLP = parseFloat(input.value)

        if (isNaN(pesoCLP) || pesoCLP <= 0) {
            resultado.textContent = 'Ingresa un valor válido'
            return
        }

        const valorCambio = monedas[cambio].valor;
        const result = (pesoCLP / valorCambio).toFixed(2)

        resultado.innerHTML = cambio === 'dolar' ? `$${result}` : `€${result}`
        renderChart(cambio)
    } catch (e) {
        console.log(`${e.message}`)
    }
});
