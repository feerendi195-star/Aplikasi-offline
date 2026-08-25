// =====================================================
// MODAL AWAL & SALDO
// =====================================================

function tampilkanModal() {
    const modalDisplay =
        document.getElementById("modalDisplay");

    const saldoDisplay =
        document.getElementById("saldoDisplay");

    if (modalDisplay) {
        modalDisplay.textContent =
            rupiah(modalAwal);
    }

    if (saldoDisplay) {
        saldoDisplay.textContent =
            rupiah(hitungSaldo());
    }
}

function inputModal() {
    let nilai =
        prompt("Masukkan Modal Awal:", modalAwal || "");

    if (nilai === null) {
        return;
    }

    nilai = nilai.replace(/\D/g, "");

    if (nilai === "") {
        alert("Masukkan angka yang benar.");
        return;
    }

    modalAwal = Number(nilai);

    localStorage.setItem("modalAwal", modalAwal);

    tampilkanModal();
    tampilkanLaporan();
}

// =====================================================
// FUNGSI PERHITUNGAN
// =====================================================

function hitungTotalBelanja() {
    let total = 0;

    daftarBelanja.forEach(function(item) {
        total += Number(item.total) || 0;
    });

    return total;
}

function hitungTotalHutang() {
    let total = 0;

    // Hutang manual
    daftarHutang.forEach(function(hutang) {
        total += Number(hutang.sisa) || 0;
    });

    // Hutang dari titipan
    daftarTitipan.forEach(function(titipan) {
        if (Number(titipan.sisa) < 0) {
            total += Math.abs(Number(titipan.sisa));
        }
    });

    return total;
}

function hitungSaldo() {
    const totalBelanja = hitungTotalBelanja();
    const totalOperasional = hitungTotalOperasional();
    return modalAwal - totalBelanja - totalOperasional;
}

// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {
    const totalBelanja = hitungTotalBelanja();
    const totalHutang = hitungTotalHutang();

    const dashboardBelanja =
        document.getElementById("dashboardBelanja");

    const dashboardHutang =
        document.getElementById("dashboardHutang");

    const saldoDisplay =
        document.getElementById("saldoDisplay");

    if (dashboardBelanja) {
        dashboardBelanja.textContent =
            rupiah(totalBelanja);
    }

    if (dashboardHutang) {
        dashboardHutang.textContent =
            rupiah(totalHutang);
    }

    if (saldoDisplay) {
        saldoDisplay.textContent =
            rupiah(hitungSaldo());
    }
}

// =====================================================
// LAPORAN
// =====================================================

function tampilkanLaporan() {
    const laporanModal =
        document.getElementById("laporanModal");

    const laporanBelanja =
        document.getElementById("laporanBelanja");

    const laporanSaldo =
        document.getElementById("laporanSaldo");

    if (laporanModal) {
        laporanModal.textContent =
            rupiah(modalAwal);
    }

    if (laporanBelanja) {
        laporanBelanja.textContent =
            rupiah(hitungTotalBelanja());
    }

    if (laporanSaldo) {
        laporanSaldo.textContent =
            rupiah(hitungSaldo());
    }
}
