document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    if (!form || !status) {
        console.error("Formulario o mensaje de estado no encontrados");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();   // evita recargar la página

        const payload = {
            email: form.email.value,
            nombres: form.nombres.value,
            apellidos: form.apellidos.value,
            motivo: form.motivo.value
        };

        try {

            const response = await fetch(
                "https://msgoficial.app.n8n.cloud/webhook/Enviar",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error("Webhook respondió con error");
            }

            // ✅ Mostrar éxito
            status.style.display = "block";
            status.style.color = "#00ff99";
            status.textContent = "¡Mensaje enviado correctamente!";

            // ✅ Limpiar inputs
            form.reset();

            // ✅ Ocultar mensaje
            setTimeout(() => {
                status.style.display = "none";
            }, 5000);

        } catch (error) {
            console.error("Error al enviar:", error);

            // ❌ Mostrar error
            status.style.display = "block";
            status.style.color = "#ff1138";
            status.textContent = "Error al enviar el mensaje. Intenta nuevamente.";

            setTimeout(() => {
                status.style.display = "none";
            }, 5000);
        }

    });

});
