// Variables globales
let atractivos = [];
let gastronomia = [];
let alojamientos = [];
let testimonios = [];
let mapaLeaflet;

// Función para cargar todos los datos
async function cargarDatos() {
    try {
        // Cargar datos de atractivos
        const respAtractivos = await fetch('data/atractivos.json');
        atractivos = await respAtractivos.json();
        
        // Cargar datos de gastronomía
        const respGastronomia = await fetch('data/gastronomia.json');
        gastronomia = await respGastronomia.json();
        
        // Cargar datos de alojamientos
        const respAlojamientos = await fetch('data/alojamiento.json');
        alojamientos = await respAlojamientos.json();
        
        // Cargar datos de testimonios
        const respTestimonios = await fetch('data/testimonios.json');
        testimonios = await respTestimonios.json();
        
        // Inicializar la interfaz con los datos cargados
        inicializarUI();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Inicializar la interfaz con los datos cargados
function inicializarUI() {
    renderizarAtractivos();
    renderizarGastronomia();
    renderizarAlojamientos();
    renderizarTestimonios(testimonios);
    inicializarMapa();
    inicializarFiltros();
    verificarFavoritos();
    inicializarTestimonialSwiper();
}

// Renderizar los atractivos en la página
function renderizarAtractivos() {
    const contenedor = document.querySelector('.attractions-grid');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    atractivos.forEach(atractivo => {
        const card = document.createElement('div');
        card.className = 'attraction-card';
        card.setAttribute('data-category', atractivo.categoria);
        card.setAttribute('data-aos', 'fade-up');
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${atractivo.imagen}" alt="${atractivo.nombre}">
                <div class="favorite-btn" onclick="toggleFavorite(${atractivo.id})">
                    <i class="far fa-heart" id="fav-${atractivo.id}"></i>
                </div>
            </div>
            <div class="card-content">
                <h3>${atractivo.nombre}</h3>
                <p>${atractivo.descripcion}</p>
                <button class="btn-secondary" onclick="mostrarDetalleAtractivo(${atractivo.id})">Ver más</button>
            </div>
        `;
        
        contenedor.appendChild(card);
    });
}

// Renderizar la gastronomía en la página
function renderizarGastronomia() {
    const contenedor = document.querySelector('.food-carousel');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    gastronomia.forEach(plato => {
        const item = document.createElement('div');
        item.className = 'food-item';
        item.setAttribute('data-aos', 'fade-up');
        
        item.innerHTML = `
            <img src="${plato.imagen}" alt="${plato.nombre}">
            <h3>${plato.nombre}</h3>
            <p>${plato.descripcion}</p>
        `;
        
        contenedor.appendChild(item);
    });
}

// Renderizar los alojamientos en la página
function renderizarAlojamientos() {
    const contenedor = document.querySelector('.lodging-options');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    alojamientos.forEach(alojamiento => {
        const card = document.createElement('div');
        card.className = 'lodging-card';
        card.setAttribute('data-aos', 'fade-up');
        
        let serviciosHTML = '';
        alojamiento.servicios.forEach(servicio => {
            let icono = 'fa-check';
            
            // Asignar iconos específicos según el servicio
            if (servicio.includes('WiFi')) icono = 'fa-wifi';
            else if (servicio.includes('Estacionamiento')) icono = 'fa-parking';
            else if (servicio.includes('Restaurante')) icono = 'fa-utensils';
            else if (servicio.includes('Fogata')) icono = 'fa-campground';
            else if (servicio.includes('Senderos')) icono = 'fa-hiking';
            else if (servicio.includes('Vistas')) icono = 'fa-mountain';
            else if (servicio.includes('Alberca')) icono = 'fa-swimming-pool';
            else if (servicio.includes('Gimnasio')) icono = 'fa-dumbbell';
            
            serviciosHTML += `<span><i class="fas ${icono}"></i> ${servicio}</span>`;
        });
        
        card.innerHTML = `
            <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}">
            <h3>${alojamiento.nombre}</h3>
            <p>${alojamiento.descripcion}</p>
            <p class="price"><strong>${alojamiento.precio}</strong></p>
            <div class="lodging-features">
                ${serviciosHTML}
            </div>
        `;
        
        contenedor.appendChild(card);
    });
}

// Renderizar los testimonios en el carrusel
function renderizarTestimonios(testimonios) {
    const contenedor = document.querySelector('.testimonial-swiper .swiper-wrapper');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    testimonios.forEach(testimonio => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <div class="quote-icon">
                        <i class="fas fa-quote-left"></i>
                    </div>
                    <p class="testimonial-text">${testimonio.comentario}</p>
                    <div class="testimonial-rating">
                        ${generarEstrellas(testimonio.calificacion)}
                    </div>
                </div>
                <div class="testimonial-author">
                    <div class="testimonial-info">
                        <h4>${testimonio.nombre}</h4>
                        <p>${testimonio.origen}</p>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.appendChild(slide);
    });
    
    // Inicializar el carrusel una vez que se han cargado los testimonios
    inicializarTestimonialSwiper();
}

// Función auxiliar para generar las estrellas de calificación
function generarEstrellas(calificacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= calificacion) {
            estrellas += '<i class="fas fa-star"></i>'; // Estrella llena
        } else if (i - 0.5 <= calificacion) {
            estrellas += '<i class="fas fa-star-half-alt"></i>'; // Media estrella
        } else {
            estrellas += '<i class="far fa-star"></i>'; // Estrella vacía
        }
    }
    return estrellas;
}

// Inicializar el mapa con los atractivos
function inicializarMapa() {
    const mapaContainer = document.getElementById('map');
    if (!mapaContainer) return;
    
    // Coordenadas de Madera, Chihuahua (aproximadas)
    const coordMadera = [29.19, -108.13];
    
    // Inicializar el mapa
    mapaLeaflet = L.map('map').setView(coordMadera, 13);
    
    // Agregar la capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapaLeaflet);
    
    // Agregar marcadores para cada atractivo
    atractivos.forEach(atractivo => {
        if (atractivo.ubicacion) {
            const marker = L.marker([atractivo.ubicacion.lat, atractivo.ubicacion.lng])
                .addTo(mapaLeaflet)
                .bindPopup(`
                    <strong>${atractivo.nombre}</strong><br>
                    ${atractivo.descripcion}<br>
                    <button onclick="mostrarDetalleAtractivo(${atractivo.id})" class="map-btn">Ver más</button>
                `);
        }
    });
    
    // Agregar marcadores para alojamientos
    alojamientos.forEach(alojamiento => {
        if (alojamiento.ubicacion) {
            const hotelIcon = L.divIcon({
                html: '<i class="fas fa-bed" style="color: #d35400;"></i>',
                className: 'custom-div-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            L.marker([alojamiento.ubicacion.lat, alojamiento.ubicacion.lng], {icon: hotelIcon})
                .addTo(mapaLeaflet)
                .bindPopup(`
                    <strong>${alojamiento.nombre}</strong><br>
                    ${alojamiento.descripcion}<br>
                    <strong>${alojamiento.precio}</strong>
                `);
        }
    });
}

// Inicializar filtros para atractivos
function inicializarFiltros() {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    const tarjetasAtractivos = document.querySelectorAll('.attraction-card');
    
    if (!botonesFiltro.length) return;
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Remover clase active de todos los botones
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');
            
            const filtro = boton.getAttribute('data-filter');
            
            tarjetasAtractivos.forEach(tarjeta => {
                if (filtro === 'all' || tarjeta.getAttribute('data-category') === filtro) {
                    tarjeta.style.display = 'block';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });
}

// Verificar favoritos guardados en localStorage
function verificarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    favoritos.forEach(id => {
        const iconoFav = document.getElementById(`fav-${id}`);
        if (iconoFav) {
            iconoFav.classList.remove('far');
            iconoFav.classList.add('fas');
            iconoFav.classList.add('favorited');
        }
    });
}

// Función para agregar/quitar de favoritos
function toggleFavorite(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const iconoFav = document.getElementById(`fav-${id}`);
    
    if (!iconoFav) return;
    
    // Detener la propagación del evento si es necesario
    event.stopPropagation();
    
    if (favoritos.includes(id)) {
        // Quitar de favoritos
        favoritos = favoritos.filter(favId => favId !== id);
        iconoFav.classList.remove('fas');
        iconoFav.classList.remove('favorited');
        iconoFav.classList.add('far');
    } else {
        // Agregar a favoritos
        favoritos.push(id);
        iconoFav.classList.remove('far');
        iconoFav.classList.add('fas');
        iconoFav.classList.add('favorited');
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    // Añadir efecto visual
    const btnFav = iconoFav.parentElement;
    btnFav.classList.add('pulse');
    setTimeout(() => {
        btnFav.classList.remove('pulse');
    }, 300);
}

// Mostrar detalle completo de un atractivo
function mostrarDetalleAtractivo(id) {
    const atractivo = atractivos.find(a => a.id === id);
    if (!atractivo) return;
    
    // Aquí puedes implementar un modal o redireccionar a una página de detalle
    // Por ahora, mostraremos una alerta con la información
    alert(`
        ${atractivo.nombre}
        
        ${atractivo.detalles}
    `);
    
    // En una implementación real, podrías usar un modal:
    /*
    const modal = document.getElementById('detalleModal');
    modal.querySelector('.modal-title').textContent = atractivo.nombre;
    modal.querySelector('.modal-body').innerHTML = `
        <img src="${atractivo.imagen}" class="img-fluid mb-3" alt="${atractivo.nombre}">
        <p>${atractivo.detalles}</p>
    `;
    // Mostrar modal
    */
}

// Inicializar el carrusel de testimonios con autoplay
function inicializarTestimonialSwiper() {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        effect: 'fade', // Efecto de desvanecimiento entre testimonios
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 1000, // Cambia de testimonio cada 5 segundos
            disableOnInteraction: false, // Continúa incluso después de interacción del usuario
            pauseOnMouseEnter: true // Pausa cuando el mouse está sobre el carrusel
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        grabCursor: true, // Cambia el cursor cuando se pasa por encima
        speed: 800, // Velocidad de transición
        keyboard: {
            enabled: true // Permitir navegación con teclado
        }
    });
}

// Obtener datos del clima usando API
async function obtenerClima() {
    try {
        // Usar una API de clima como OpenWeatherMap
        // Para un proyecto demo, podemos simular los datos
        const temp = Math.floor(Math.random() * 10) - 5; // Temperatura fría entre -5 y 5 grados
        const descripciones = ['Nublado', 'Parcialmente nublado', 'Soleado', 'Nevando', 'Lluvia ligera'];
        const descripcion = descripciones[Math.floor(Math.random() * descripciones.length)];
        const iconos = ['04d', '03d', '01d', '13d', '10d'];
        const icono = iconos[descripciones.indexOf(descripcion)];
        
        document.getElementById('weather-temp').textContent = `${temp}°C`;
        document.getElementById('weather-desc').textContent = descripcion;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${icono}@2x.png`;
        
        // En una implementación real, usarías:
        /*
        const apiKey = 'TU_API_KEY';
        const ciudad = 'Madera,mx';
        const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${apiKey}`);
        const datos = await respuesta.json();
        
        document.getElementById('weather-temp').textContent = `${Math.round(datos.main.temp)}°C`;
        document.getElementById('weather-desc').textContent = datos.weather[0].description;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png`;
        */
    } catch (error) {
        console.error('Error al obtener el clima:', error);
    }
}

// Cambiar modo oscuro/claro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Guardar preferencia en localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
    
    // Cambiar el ícono del botón
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        if (isDarkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    obtenerClima();
    
    // Verificar modo oscuro guardado
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Evento para cambiar tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Evento para menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});