$(document).ready(function() {
    setTimeout(function() {
        cargarPeliculas();
    }, 5000);
});

function cargarPeliculas() {
    $.ajax({
        url: 'data/peliculas.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            mostrarPeliculas(data.peliculas);
            $('#spinnerCarga').fadeOut(500, function() {
                $('#galeria').fadeIn(800);
            });
        },
        error: function(error) {
            console.error('Error:', error);
            $('#spinnerCarga').html('<div class="alert alert-danger">Error al cargar películas</div>');
        }
    });
}

function mostrarPeliculas(peliculas) {
    const contenedor = $('#contenedorPeliculas');
    contenedor.empty();

    peliculas.forEach(function(pelicula) {
        const precioInfo = calcularPrecio(pelicula);
        const badgeClass = precioInfo.esEstreno ? 'bg-warning text-dark' : 'bg-success';
        const badgeText = precioInfo.esEstreno ? '⭐ ESTRENO' : '✓ EN CARTELERA';

        const card = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card movie-card h-100">
                    <img src="${pelicula.imagen}" class="card-img-top" alt="${pelicula.titulo}">
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="badge ${badgeClass}">${badgeText}</span>
                        </div>
                        <h5 class="card-title">${pelicula.titulo}</h5>
                        <div class="mb-2">
                            ${pelicula.generos.map(g => `<span class="genre-badge">${g}</span>`).join('')}
                        </div>
                        <p class="card-text text-muted small text-truncate-3 flex-grow-1">
                            ${pelicula.sinopsis}
                        </p>
                        <div class="mb-3">
                            <span class="price">$${precioInfo.precio.toFixed(2)}</span>
                        </div>
                        <div class="mt-auto">
                            <button class="btn btn-primary w-100 mb-2" onclick="verDetalle('${pelicula.id}')">
                                <i class="bi bi-info-circle"></i> Ver Detalles
                            </button>
                            <button class="btn btn-outline-primary w-100" onclick="abrirTrailer('${pelicula.trailer}')">
                                <i class="bi bi-play-circle"></i> Ver Tráiler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.append(card);
    });
    aplicarAnimaciones();
}