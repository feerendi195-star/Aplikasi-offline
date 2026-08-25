// =====================================================
// DAFTAR BARANG
// =====================================================

function tambahBarang() {
    const nama = prompt("Nama barang:");

    if (nama === null || nama.trim() === "") {
        return;
    }

    const stokInput = prompt("Jumlah stok:");
    if (stokInput === null) {
        return;
    }

    const hargaInput = prompt("Harga barang:");
    if (hargaInput === null) {
        return;
    }

    const stok = Number(stokInput);
    const harga = Number(hargaInput.replace(/\D/g, ""));

    if (!Number.isFinite(stok) || stok < 0) {
        alert("Jumlah stok tidak valid.");
        return;
    }

    if (!Number.isFinite(harga) || harga < 0) {
        alert("Harga tidak valid.");
        return;
    }

    const barang = {
        id: Date.now(),
        nama: nama.trim(),
        stok: stok,
        harga: harga
    };

    daftarBarang.push(barang);

    simpanData("daftarBarang", daftarBarang);
    tampilkanBarang();
}

function tampilkanBarang() {
    const tabel = document.getElementById("tabelBarang");

    if (!tabel) {
        return;
    }

    tabel.innerHTML = "";

    if (daftarBarang.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    Belum ada barang
                </td>
            </tr>
        `;
        return;
    }

    daftarBarang.forEach(function(barang, index) {
        const baris = document.createElement("tr");

        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHTML(barang.nama)}</td>
            <td>${barang.stok}</td>
            <td>${rupiah(barang.harga)}</td>
            <td>
                <button
                    class="btn-hapus"
                    onclick="hapusBarang(${barang.id})"
                >
                    🗑️ Hapus
                </button>
            </td>
        `;

        tabel.appendChild(baris);
    });
}

function hapusBarang(id) {
    if (!confirm("Hapus barang ini?")) {
        return;
    }

    daftarBarang = daftarBarang.filter(function(barang) {
        return barang.id !== id;
    });

    simpanData("daftarBarang", daftarBarang);
    tampilkanBarang();
}