$(document).ready(function() {
    if (!localStorage.getItem('bienvenidaMostrada')) {
        mostrarModalBienvenida();
        localStorage.setItem('bienvenidaMostrada', 'true');
    }
});

function mostrarModalBienvenida() {
    const modalHTML = `
        <div class="modal fade" id="modalBienvenida" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-star-fill"></i> ¡Bienvenido a CineApp!</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <i class="bi bi-film" style="font-size: 4rem; color: #6366f1;"></i>
                        <h4 class="mt-3">Tu cine favorito en línea</h4>
                        <p class="text-muted">Explora nuestra cartelera, lee reseñas y renta tus películas favoritas.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">¡Comenzar!</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('modalBienvenida'));
    modal.show();
    $('#modalBienvenida').on('hidden.bs.modal', function() { $(this).remove(); });
}

function calcularPrecio(pelicula) {
    const fechaActual = new Date();
    const fechaEstreno = new Date(pelicula.estreno);
    const diferenciaDias = Math.floor((fechaActual - fechaEstreno) / (1000 * 60 * 60 * 24));
    if (diferenciaDias >= 0 && diferenciaDias <= 30) {
        return { precio: pelicula.precios.estreno, esEstreno: true };
    } else {
        return { precio: pelicula.precios.normal, esEstreno: false };
    }
}

function abrirTrailer(url) {
    $('#trailerIframe').attr('src', url);
    const modal = new bootstrap.Modal(document.getElementById('trailerModal'));
    modal.show();
    $('#trailerModal').on('hidden.bs.modal', function() { $('#trailerIframe').attr('src', ''); });
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function verDetalle(peliculaId) {
    sessionStorage.setItem('peliculaIdDetalle', peliculaId);
    window.location.href = 'detalle.html';
}

function aplicarAnimaciones() {
    $('.movie-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
}

function generarEstrellas(calificacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= calificacion) {
            estrellas += '<i class="bi bi-star-fill text-warning"></i>';
        } else {
            estrellas += '<i class="bi bi-star text-muted"></i>';
        }
    }
    return estrellas;
}