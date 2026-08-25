// =====================================================
// LOCAL STORAGE
// =====================================================

function ambilData(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) {
            return defaultValue;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return defaultValue;
    }
}

function simpanData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// =====================================================
// FORMAT RUPIAH
// =====================================================

function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(angka) || 0);
}

// =====================================================
// AMANKAN HTML
// =====================================================

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML;
}
