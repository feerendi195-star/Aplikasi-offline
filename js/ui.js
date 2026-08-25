// =====================================================
// SIDEBAR
// =====================================================

function toggleSidebar() {
    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("show");
}


// =====================================================
// NAVIGASI HALAMAN
// =====================================================

function showPage(pageId) {
    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const halaman =
        document.getElementById(pageId);

    if (halaman) {
        halaman.classList.add("active");
    }

    // Tutup sidebar di HP
    if (window.innerWidth <= 700) {
        const sidebar =
            document.getElementById("sidebar");

        if (sidebar) {
            sidebar.classList.remove("show");
        }
    }
}
