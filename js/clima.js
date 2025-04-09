async function obtenerClima() {
    try {
        // Usamos la localidad de Madera, Chihuahua
        const ciudad = 'Madera,Chihuahua';
        
        // Obtenemos los datos del clima en formato JSON
        const respuesta = await fetch(`https://wttr.in/${ciudad}?format=j1`);
        
        // Si la respuesta no es correcta, lanzamos un error
        if (!respuesta.ok) {
            throw new Error('No se pudo obtener información del clima');
        }
        
        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        
        // Extraemos la información relevante
        const temperatura = datos.current_condition[0].temp_C;
        const descripcion = datos.current_condition[0].weatherDesc[0].value;
        const sensacionTermica = datos.current_condition[0].FeelsLikeC;
        const humedad = datos.current_condition[0].humidity;
        const velocidadViento = datos.current_condition[0].windspeedKmph;
        const direccionViento = datos.current_condition[0].winddir16Point;
        
        // Obtener temperaturas máxima y mínima del día actual
        const tempMaxima = datos.weather[0].maxtempC;
        const tempMinima = datos.weather[0].mintempC;
        
        // Código para determinar el icono apropiado
        const codigoClima = datos.current_condition[0].weatherCode;
        const horaActual = new Date().getHours();
        const esDeNoche = horaActual >= 19 || horaActual < 7; // Considera noche entre 7pm y 7am
        
        // Actualizamos la interfaz de usuario
        document.getElementById('weather-temp').textContent = `${temperatura}°C`;
        document.getElementById('weather-desc').textContent = descripcion;
        
        // Actualizar temperaturas máxima y mínima
        document.getElementById('weather-temp-max').textContent = `Máx: ${tempMaxima}°C`;
        document.getElementById('weather-temp-min').textContent = `Mín: ${tempMinima}°C`;
        
        document.getElementById('weather-feels').textContent = `Sensación: ${sensacionTermica}°C`;
        document.getElementById('weather-humidity').textContent = `Humedad: ${humedad}%`;
        document.getElementById('weather-wind').textContent = `Viento: ${velocidadViento} km/h ${direccionViento}`;
        
        // Para el icono, usamos Font Awesome
        const iconoElemento = document.getElementById('weather-icon');
        if (iconoElemento) {
            // Eliminar cualquier contenido previo
            iconoElemento.innerHTML = '';
            
            // Crear un elemento i para el icono de Font Awesome
            const icono = document.createElement('i');
            icono.className = obtenerIconoFontAwesome(codigoClima, esDeNoche);
            
            // Añadir el icono al contenedor
            iconoElemento.appendChild(icono);
        }
        
        // También podemos actualizar el fondo de la sección de clima según las condiciones
        actualizarEstiloClima(codigoClima, esDeNoche);
        
    } catch (error) {
        console.error('Error al obtener datos del clima:', error);
        
        // Mostrar mensaje de error en la interfaz
        document.getElementById('weather-temp').textContent = '--°C';
        document.getElementById('weather-desc').textContent = 'No disponible';
        
        // Ocultar elementos adicionales si existen
        const elementosAdicionales = ['weather-feels', 'weather-humidity', 'weather-wind', 'weather-temp-max', 'weather-temp-min'];
        elementosAdicionales.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.style.display = 'none';
        });
    }
}

/**
 * Función para determinar el icono climático según el código de wttr.in
 * @param {string} codigo - Código de condición climática
 * @param {boolean} esNoche - Indica si es de noche
 * @returns {string} - Nombre del archivo de icono
 */
function obtenerIconoClima(codigo, esNoche) {
    // Mapeo básico de códigos climáticos a iconos
    // Códigos completos en: https://www.worldweatheronline.com/developer/api/docs/weather-icons.aspx
    const iconos = {
        '113': esNoche ? 'night_clear' : 'day_clear',
        '116': esNoche ? 'night_partial_cloud' : 'day_partial_cloud',
        '119': 'cloudy',
        '122': 'very_cloudy',
        '143': 'mist',
        '176': 'patchy_rain',
        '179': 'patchy_snow',
        '182': 'patchy_sleet',
        '185': 'patchy_freezing_drizzle',
        '200': 'thundery_outbreaks',
        '227': 'blowing_snow',
        '230': 'blizzard',
        '248': 'fog',
        '260': 'freezing_fog',
        '263': 'patchy_light_drizzle',
        '266': 'light_drizzle',
        '281': 'freezing_drizzle',
        '284': 'heavy_freezing_drizzle',
        '293': 'patchy_light_rain',
        '296': 'light_rain',
        '299': 'moderate_rain_at_times',
        '302': 'moderate_rain',
        '305': 'heavy_rain_at_times',
        '308': 'heavy_rain',
        '311': 'light_freezing_rain',
        '314': 'moderate_or_heavy_freezing_rain',
        '317': 'light_sleet',
        '320': 'moderate_or_heavy_sleet',
        '323': 'patchy_light_snow',
        '326': 'light_snow',
        '329': 'patchy_moderate_snow',
        '332': 'moderate_snow',
        '335': 'patchy_heavy_snow',
        '338': 'heavy_snow',
        '350': 'ice_pellets',
        '353': 'light_rain_shower',
        '356': 'moderate_or_heavy_rain_shower',
        '359': 'torrential_rain_shower',
        '362': 'light_sleet_showers',
        '365': 'moderate_or_heavy_sleet_showers',
        '368': 'light_snow_showers',
        '371': 'moderate_or_heavy_snow_showers',
        '374': 'light_showers_of_ice_pellets',
        '377': 'moderate_or_heavy_showers_of_ice_pellets',
        '386': esNoche ? 'night_thundery_outbreaks' : 'day_thundery_outbreaks',
        '389': esNoche ? 'night_thundery_heavy_rain' : 'day_thundery_heavy_rain',
        '392': esNoche ? 'night_thundery_snow' : 'day_thundery_snow',
        '395': 'heavy_snow'
    };
    
    // Devolver el icono correspondiente o uno predeterminado
    return iconos[codigo] || (esNoche ? 'night_clear' : 'day_clear');
}

/**
 * Función para obtener la clase de icono Font Awesome según el código de clima
 * @param {string} codigo - Código de condición climática
 * @param {boolean} esNoche - Indica si es de noche
 * @returns {string} - Clase CSS para el icono Font Awesome
 */
function obtenerIconoFontAwesome(codigo, esNoche) {
    // Mapeo básico de códigos a iconos de Font Awesome
    let iconoBase = 'fas ';
    
    if (esNoche) {
        // Iconos para la noche
        if (codigo === '113') return iconoBase + 'fa-moon';
        if (codigo === '116') return iconoBase + 'fa-cloud-moon';
        if (codigo >= '386' && codigo <= '392') return iconoBase + 'fa-bolt';
    } else {
        // Iconos para el día
        if (codigo === '113') return iconoBase + 'fa-sun';
        if (codigo === '116') return iconoBase + 'fa-cloud-sun';
        if (codigo >= '386' && codigo <= '392') return iconoBase + 'fa-bolt';
    }
    
    // Iconos generales independientes del día/noche
    if (['119', '122'].includes(codigo)) return iconoBase + 'fa-cloud';
    if (['143', '248', '260'].includes(codigo)) return iconoBase + 'fa-smog';
    if (codigo >= '176' && codigo <= '321') return iconoBase + 'fa-cloud-rain';
    if (codigo >= '323' && codigo <= '368') return iconoBase + 'fa-snowflake';
    if (codigo >= '371' && codigo <= '377') return iconoBase + 'fa-icicles';
    if (codigo >= '389' && codigo <= '395') return iconoBase + 'fa-poo-storm';
    
    // Icono predeterminado
    return iconoBase + (esNoche ? 'fa-moon' : 'fa-sun');
}

/**
 * Actualiza el estilo de la sección del clima según las condiciones
 * @param {string} codigo - Código de condición climática
 * @param {boolean} esNoche - Indica si es de noche
 */
function actualizarEstiloClima(codigo, esNoche) {
    const seccionClima = document.querySelector('.weather-info');
    if (!seccionClima) return;
    
    // Remover clases anteriores
    seccionClima.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'night');
    
    // Añadir clase según el código
    if (esNoche) {
        seccionClima.classList.add('night');
    } else if (codigo === '113' || codigo === '116') {
        seccionClima.classList.add('sunny');
    } else if (['119', '122', '143', '248', '260'].includes(codigo)) {
        seccionClima.classList.add('cloudy');
    } else if (codigo >= '176' && codigo <= '321') {
        seccionClima.classList.add('rainy');
    } else if (codigo >= '323' && codigo <= '368') {
        seccionClima.classList.add('snowy');
    } else if (codigo >= '386' && codigo <= '395') {
        seccionClima.classList.add('stormy');
    }
}

/**
 * Muestra el pronóstico del tiempo para los próximos días
 * @param {Array} pronostico - Datos de pronóstico de wttr.in
 */
function mostrarPronostico(pronostico) {
    const contenedorPronostico = document.getElementById('weather-forecast');
    if (!contenedorPronostico || !pronostico || pronostico.length === 0) return;
    
    // Limpiar el contenedor
    contenedorPronostico.innerHTML = '';
    
    // Mostrar pronóstico para los próximos 3 días (el actual y 2 más)
    for (let i = 0; i < Math.min(3, pronostico.length); i++) {
        const dia = pronostico[i];
        const fecha = new Date(dia.date);
        const nombreDia = obtenerNombreDia(fecha.getDay());
        
        // Crear elemento para el día
        const elementoDia = document.createElement('div');
        elementoDia.className = 'forecast-day';
        
        // Temperatura máxima y mínima
        const maxC = dia.maxtempC;
        const minC = dia.mintempC;
        
        // Condición promedio (tomamos la del mediodía)
        const condicion = dia.hourly[4].weatherDesc[0].value;
        const codigoCondicion = dia.hourly[4].weatherCode;
        
        // Crear contenido HTML
        elementoDia.innerHTML = `
            <div class="forecast-date">${nombreDia}</div>
            <img src="https://wttr.in/images/v2/${obtenerIconoClima(codigoCondicion, false)}.png" alt="${condicion}" class="forecast-icon">
            <div class="forecast-temp">${minC}°C / ${maxC}°C</div>
            <div class="forecast-condition">${condicion}</div>
        `;
        
        // Añadir al contenedor
        contenedorPronostico.appendChild(elementoDia);
    }
}

/**
 * Obtiene el nombre del día de la semana
 * @param {number} numeroDia - Número del día (0-6)
 * @returns {string} - Nombre del día en español
 */
function obtenerNombreDia(numeroDia) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[numeroDia];
}

// Ejecutar la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    obtenerClima();
    
    // Actualizar cada 30 minutos (1800000 ms)
    setInterval(obtenerClima, 1800000);
});