/*!
=========================================================
* FoodHut Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* El aviso anterior debe permanecer en las copias.
*/

// smooth scroll + cerrar menú en móvil
$(document).ready(function(){
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    const nav = document.querySelector("nav");
    const links = navbarCollapse ? navbarCollapse.querySelectorAll("a.nav-link, .btn") : [];

    let bsCollapse = null;
    if (navbarCollapse && typeof bootstrap !== "undefined" && bootstrap.Collapse) {
        bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
    }

    if (navbarCollapse) {
        navbarCollapse.addEventListener("shown.bs.collapse", function () {
            nav.classList.add("menu-open");
        });
        navbarCollapse.addEventListener("hidden.bs.collapse", function () {
            nav.classList.remove("menu-open");
        });
    }

    links.forEach((el) => {
        el.addEventListener("click", function (e) {
            if (this.hash !== "" && document.querySelector(this.hash)) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                const navbarHeight = window.innerWidth > 991 ? nav.offsetHeight : 0;

                $("html, body").animate(
                    { scrollTop: $(target).offset().top - navbarHeight },
                    700,
                    function () {
                        window.location.hash = el.hash;
                        if (window.innerWidth <= 991 && bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                );
            } else {
                if (window.innerWidth <= 991 && bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
});

new WOW().init();

/* =====================
   GOOGLE MAPS
===================== */
function initMap() {
    var bogota = { lat: 4.648594, lng: -74.104466 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: bogota,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    var customIcon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#ff5477" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 
                0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 
                2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        `),
        scaledSize: new google.maps.Size(45, 45),
        anchor: new google.maps.Point(22, 45)
    };

    new google.maps.Marker({
        position: bogota,
        map: map,
        icon: customIcon
    });
}


/* ======================================================
   GALERÍA + MODAL (CON VIDEO INTEGRADO)
====================================================== */
document.addEventListener('DOMContentLoaded', function () {

    /* FILTRO */
    const buttons = document.querySelectorAll('button.menu-filter-btn');
    const items = document.querySelectorAll('.gallary-item');

    function setActiveButton(activeBtn) {
        buttons.forEach(b => b.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');
    }

    function filterGroup(filter) {
        items.forEach(item => {
            const group = item.dataset.group;

            if (filter === 'all' || group === filter) {
                item.classList.remove('hidden');
                setTimeout(() => item.classList.remove('hiding'), 20);
            } else {
                item.classList.add('hiding');
                setTimeout(() => item.classList.add('hidden'), 350);
            }
        });
    }

    filterGroup('all');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const filter = btn.getAttribute('data-filter');
            filterGroup(filter);
            setActiveButton(btn);
            e.preventDefault();
        });
    });


    /* ======================================
       MODAL DE IMAGEN + INFO + VIDEO
    ====================================== */
    document.querySelectorAll(".gallary-img").forEach(img => {
        img.addEventListener("click", function () {

            const modal = document.getElementById("imageModal");
            const modalImg = document.getElementById("modalImg");
            const modalTitle = document.getElementById("modalTitle");
            const modalDescription = document.getElementById("modalDescription");
            const modalSocial = document.getElementById("modalSocial");
            const modalLogo = document.getElementById("modalLogo");
            const modalVideo = document.getElementById("modalVideo");

            // IMAGEN + TEXTO
            modalImg.src = this.src;
            modalTitle.textContent = this.dataset.title || "";
            modalDescription.textContent = this.dataset.desc || "";
            modalLogo.src = this.dataset.logo || "assets/imgs/logo-msg.png";

            // LIMPIAR REDES
            modalSocial.innerHTML = "";

            // REDES SOCIALES
            let socialData = [];
            try {
                socialData = JSON.parse(this.dataset.social || "[]");
            } catch (e) {
                console.error("Error en data-social:", e);
            }

            socialData.forEach(s => {
                const link = document.createElement("a");
                link.href = s.url;
                link.target = "_blank";

                let iconSVG = "";
                switch (s.icon.toLowerCase()) {
                    case "instagram": iconSVG = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg"; break;
                    case "twitch": iconSVG = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitch.svg"; break;
                    case "twitter": iconSVG = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg"; break;
                    case "youtube": iconSVG = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg"; break;
                    case "tiktok": iconSVG = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg"; break;
                }

                link.innerHTML = `<img src="${iconSVG}" width="28" style="filter:invert(1)">`;
                modalSocial.appendChild(link);
            });

            /* ==============================
               VIDEO
            ============================== */
            const videoUrl = this.dataset.video || "";

            if (videoUrl) {
                modalVideo.src = videoUrl + "?autoplay=1";
                modalVideo.style.display = "block";
            } else {
                modalVideo.src = "";
                modalVideo.style.display = "none";
            }

            modal.classList.add("active");
        });
    });

    /* Cerrar modal + detener video */
    document.getElementById("imageModal").addEventListener("click", function (e) {
        if (e.target === this) {
            document.getElementById("modalVideo").src = "";
            this.classList.remove("active");
        }
    });

});
// --- FUNCIÓN GENERAL PARA FILTRAR ---
function filtrarPorGrupo(grupo) {
    const items = document.querySelectorAll(".gallary-item");
    const buttons = document.querySelectorAll(".menu-filter-btn");

    items.forEach(item => {
        item.style.display =
            item.getAttribute("data-group") === grupo ? "block" : "none";
    });

    buttons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.getAttribute("data-filter") === grupo
        );
    });
}

// --- ACTIVAR FILTRO POR DEFECTO ---
document.addEventListener("DOMContentLoaded", () => {
    const defaultFilter = "1";  // <--- Grupo por defecto
    filtrarPorGrupo(defaultFilter);
});

// --- EVENTO DE CLIC PARA LOS BOTONES ---
document.querySelectorAll(".menu-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const grupo = btn.getAttribute("data-filter");
        filtrarPorGrupo(grupo);
    });
});