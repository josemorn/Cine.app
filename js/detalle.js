$(document).ready(function() {
    const peliculaId = sessionStorage.getItem('peliculaIdDetalle');
    if (!peliculaId) {
        $('#detallePelicula').html('<div class="alert alert-warning">No se seleccionó película. <a href="index.html">Volver</a></div>');
        return;
    }
    cargarDetallePelicula(peliculaId);
});

function cargarDetallePelicula(peliculaId) {
    $.ajax({
        url: 'data/peliculas.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const pelicula = data.peliculas.find(p => p.id === peliculaId);
            if (!pelicula) {
                $('#detallePelicula').html('<div class="alert alert-danger">Película no encontrada.</div>');
                return;
            }
            $.ajax({
                url: 'data/resenas.json',
                method: 'GET',
                dataType: 'json',
                success: function(resenasData) {
                    const resenas = resenasData.resenas[peliculaId] || [];
                    mostrarDetalle(pelicula, resenas);
                },
                error: function() {
                    mostrarDetalle(pelicula, []);
                }
            });
        }
    });
}

function mostrarDetalle(pelicula, resenas) {
    const precioInfo = calcularPrecio(pelicula);
    const badgeClass = precioInfo.esEstreno ? 'bg-warning text-dark' : 'bg-success';
    const badgeText = precioInfo.esEstreno ? '⭐ ESTRENO' : '✓ EN CARTELERA';

    let resenasHTML = '';
    if (resenas.length > 0) {
        resenasHTML = '<h3 class="mt-5 mb-4">Reseñas de Usuarios</h3>';
        resenas.forEach(function(resena) {
            const estrellas = generarEstrellas(resena.calificacion);
            resenasHTML += `
                <div class="review-card">
                    <div class="d-flex justify-content-between mb-2">
                        <h6 class="mb-0"><strong>${resena.autor}</strong></h6>
                        <small class="text-muted">${formatearFecha(resena.fecha)}</small>
                    </div>
                    <div class="stars mb-2">${estrellas}</div>
                    <p class="mb-0">${resena.comentario}</p>
                </div>
            `;
        });
    }

    const contenido = `
        <div class="card shadow-lg">
            <div class="card-body p-4">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${pelicula.imagen}" class="img-fluid rounded shadow" alt="${pelicula.titulo}">
                    </div>
                    <div class="col-md-8">
                        <h2 class="mb-3">${pelicula.titulo}</h2>
                        <div class="mb-3"><span class="badge ${badgeClass} fs-6">${badgeText}</span></div>
                        <div class="mb-3"><strong>Géneros:</strong><br>${pelicula.generos.map(g => `<span class="genre-badge">${g}</span>`).join('')}</div>
                        <div class="mb-3"><strong>Fecha de Estreno:</strong> ${formatearFecha(pelicula.estreno)}</div>
                        <div class="mb-3"><strong>Precio:</strong> <span class="price">$${precioInfo.precio.toFixed(2)}</span></div>
                        <div class="mb-4"><strong>Sinopsis:</strong><p class="mt-2">${pelicula.sinopsis}</p></div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="abrirTrailer('${pelicula.trailer}')">Ver Tráiler</button>
                            <a href="index.html" class="btn btn-outline-secondary">Volver</a>
                        </div>
                    </div>
                </div>
                <hr class="my-4">
                ${resenasHTML}
            </div>
        </div>
    `;
    $('#detallePelicula').html(contenido);
}