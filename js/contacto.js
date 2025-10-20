$(document).ready(function() {
    $('#mensaje').on('input', function() {
        const length = $(this).val().length;
        $('#charCount').text(length);
        if (length < 20 || length > 50) {
            $(this).addClass('is-invalid').removeClass('is-valid');
        } else {
            $(this).addClass('is-valid').removeClass('is-invalid');
        }
    });

    $('#formContacto').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        const nombre = $('#nombre').val().trim();
        if (nombre === '' || nombre.length < 3) {
            $('#nombre').addClass('is-invalid');
            isValid = false;
        } else {
            $('#nombre').addClass('is-valid').removeClass('is-invalid');
        }
        
        const correo = $('#correo').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            $('#correo').addClass('is-invalid');
            isValid = false;
        } else {
            $('#correo').addClass('is-valid').removeClass('is-invalid');
        }
        
        const mensaje = $('#mensaje').val().trim();
        if (mensaje.length < 20 || mensaje.length > 50) {
            $('#mensaje').addClass('is-invalid');
            isValid = false;
        } else {
            $('#mensaje').addClass('is-valid').removeClass('is-invalid');
        }
        
        if (isValid) {
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            this.reset();
            $('.form-control').removeClass('is-valid is-invalid');
            $('#charCount').text('0');
        }
    });
});