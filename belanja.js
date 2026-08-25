// =====================================================
// BELANJA
// =====================================================

function tambahBelanja() {
    modeBelanja = "tambah";
    editBelanjaId = null;

    document.getElementById("judulModalBelanja").textContent = "Tambah Belanja";
    document.getElementById("namaBelanja").value = "";
    document.getElementById("jumlahBelanja").value = "";
    document.getElementById("hargaBelanja").value = "";

    document.getElementById("modalBelanja").classList.add("show");

    setTimeout(function() {
        const input = document.getElementById("namaBelanja");
        if (input) {
            input.focus();
        }
    }, 100);
}

function editBelanja(id) {
    const belanja = daftarBelanja.find(function(item) {
        return item.id === id;
    });

    if (!belanja) {
        alert("Data belanja tidak ditemukan.");
        return;
    }

    modeBelanja = "edit";
    editBelanjaId = id;

    document.getElementById("judulModalBelanja").textContent = "Edit Belanja";
    document.getElementById("namaBelanja").value = belanja.nama;
    document.getElementById("jumlahBelanja").value = belanja.jumlah;
    document.getElementById("hargaBelanja").value = belanja.harga;

    document.getElementById("modalBelanja").classList.add("show");
}

function simpanBelanja() {
    const nama = document.getElementById("namaBelanja").value.trim();
    const jumlah = Number(document.getElementById("jumlahBelanja").value);
    const harga = Number(document.getElementById("hargaBelanja").value);

    if (nama === "") {
        alert("Nama barang harus diisi.");
        return;
    }

    if (!Number.isFinite(jumlah) || jumlah <= 0) {
        alert("Jumlah harus lebih dari 0.");
        return;
    }

    if (!Number.isFinite(harga) || harga <= 0) {
        alert("Harga harus lebih dari 0.");
        return;
    }

    const total = jumlah * harga;

    if (modeBelanja === "tambah") {
        daftarBelanja.push({
            id: Date.now(),
            nama: nama,
            jumlah: jumlah,
            harga: harga,
            total: total
        });
    } else {
        const belanja = daftarBelanja.find(function(item) {
            return item.id === editBelanjaId;
        });

        if (!belanja) {
            alert("Data belanja tidak ditemukan.");
            return;
        }

        belanja.nama = nama;
        belanja.jumlah = jumlah;
        belanja.harga = harga;
        belanja.total = total;
    }

    simpanData("daftarBelanja", daftarBelanja);

    tampilkanBelanja();
    tampilkanLaporan();
    updateDashboard();
    tampilkanModal();
    tutupModalBelanja();
}

function tutupModalBelanja() {
    const modal = document.getElementById("modalBelanja");

    if (modal) {
        modal.classList.remove("show");
    }

    modeBelanja = "tambah";
    editBelanjaId = null;
}

function tampilkanBelanja() {
    const tabel = document.getElementById("tabelBelanja");
    const totalElement = document.getElementById("totalBelanja");

    if (!tabel) {
        return;
    }

    tabel.innerHTML = "";
    let totalSemua = 0;

    if (daftarBelanja.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    Belum ada data belanja
                </td>
            </tr>
        `;
    } else {
        daftarBelanja.forEach(function(belanja, index) {
            totalSemua += Number(belanja.total) || 0;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(belanja.nama)}</td>
                <td>${belanja.jumlah}</td>
                <td>${rupiah(belanja.harga)}</td>
                <td>${rupiah(belanja.total)}</td>
                <td>
                    <button class="btn-edit" onclick="editBelanja(${belanja.id})">✏️ Edit</button>
                    <button class="btn-hapus" onclick="hapusBelanja(${belanja.id})">🗑️ Hapus</button>
                </td>
            `;

            tabel.appendChild(row);
        });
    }

    if (totalElement) {
        totalElement.textContent = rupiah(totalSemua);
    }
}

function hapusBelanja(id) {
    if (!confirm("Hapus transaksi belanja ini?")) {
        return;
    }

    daftarBelanja = daftarBelanja.filter(function(item) {
        return item.id !== id;
    });

    simpanData("daftarBelanja", daftarBelanja);

    tampilkanBelanja();
    tampilkanLaporan();
    updateDashboard();
    tampilkanModal();
}