// =====================================================
// TITIPAN
// =====================================================

function tambahTitipan() {
    modeTitipan = "tambah";
    editTitipanId = null;
    barangTitipanForm = [];

    document.getElementById("judulModalTitipan").textContent = "Tambah Titipan";
    document.getElementById("namaPelanggan").value = "";
    document.getElementById("uangTitipan").value = "";

    kosongkanFormBarangTitipan();
    tampilkanBarangTitipanForm();

    document.getElementById("modalTitipan").classList.add("show");

    setTimeout(function() {
        const input = document.getElementById("namaPelanggan");
        if (input) {
            input.focus();
        }
    }, 100);
}

function kosongkanFormBarangTitipan() {
    document.getElementById("barangTitipan").value = "";
    document.getElementById("qtyTitipan").value = "";
    document.getElementById("satuanTitipan").value = "";
    document.getElementById("hargaTitipan").value = "";
}

function tambahBarangTitipan() {
    const nama = document.getElementById("barangTitipan").value.trim();
    const qty = Number(document.getElementById("qtyTitipan").value);
    const satuan = document.getElementById("satuanTitipan").value.trim();
    const harga = Number(document.getElementById("hargaTitipan").value);

    if (nama === "") {
        alert("Nama barang harus diisi.");
        return;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
        alert("Qty harus lebih dari 0.");
        return;
    }

    if (satuan === "") {
        alert("Satuan harus diisi.");
        return;
    }

    if (!Number.isFinite(harga) || harga <= 0) {
        alert("Harga harus lebih dari 0.");
        return;
    }

    barangTitipanForm.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        nama: nama,
        qty: qty,
        satuan: satuan,
        harga: harga,
        total: qty * harga
    });

    kosongkanFormBarangTitipan();
    tampilkanBarangTitipanForm();
}

function tampilkanBarangTitipanForm() {
    const tabel = document.getElementById("daftarBarangTitipanForm");

    if (!tabel) {
        return;
    }

    tabel.innerHTML = "";
    let total = 0;

    barangTitipanForm.forEach(function(barang) {
        total += Number(barang.total) || 0;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(barang.nama)}</td>
            <td>${barang.qty}</td>
            <td>${escapeHTML(barang.satuan)}</td>
            <td>${rupiah(barang.harga)}</td>
            <td>${rupiah(barang.total)}</td>
            <td>
                <button type="button" class="btn-hapus" onclick="hapusBarangTitipanForm(${barang.id})">✕</button>
            </td>
        `;

        tabel.appendChild(row);
    });

    const uang = Number(document.getElementById("uangTitipan").value) || 0;
    const totalElement = document.getElementById("totalTitipanForm");
    const uangElement = document.getElementById("uangTitipanForm");
    const sisaElement = document.getElementById("sisaTitipanForm");

    if (totalElement) {
        totalElement.textContent = rupiah(total);
    }

    if (uangElement) {
        uangElement.textContent = rupiah(uang);
    }

    if (sisaElement) {
        const selisih = uang - total;

        if (selisih >= 0) {
            sisaElement.textContent = rupiah(selisih);
            sisaElement.classList.remove("hutang");
        } else {
            sisaElement.textContent = "Hutang " + rupiah(Math.abs(selisih));
            sisaElement.classList.add("hutang");
        }
    }
}

function hapusBarangTitipanForm(id) {
    barangTitipanForm = barangTitipanForm.filter(function(barang) {
        return barang.id !== id;
    });

    tampilkanBarangTitipanForm();
}

document.addEventListener("input", function(event) {
    if (event.target.id === "uangTitipan") {
        tampilkanBarangTitipanForm();
    }
});

function simpanTitipan() {
    const nama = document.getElementById("namaPelanggan").value.trim();
    const uang = Number(document.getElementById("uangTitipan").value);

    if (nama === "") {
        alert("Nama pelanggan harus diisi.");
        return;
    }

    if (!Number.isFinite(uang) || uang < 0) {
        alert("Uang titipan tidak valid.");
        return;
    }

    if (barangTitipanForm.length === 0) {
        alert("Tambahkan minimal satu barang.");
        return;
    }

    let total = 0;
    barangTitipanForm.forEach(function(barang) {
        total += Number(barang.total) || 0;
    });

    const sisa = uang - total;

    if (modeTitipan === "tambah") {
        daftarTitipan.push({
            id: Date.now(),
            nama: nama,
            uangTitipan: uang,
            barang: JSON.parse(JSON.stringify(barangTitipanForm)),
            total: total,
            sisa: sisa
        });
    } else {
        const titipan = daftarTitipan.find(function(item) {
            return item.id === editTitipanId;
        });

        if (!titipan) {
            alert("Data titipan tidak ditemukan.");
            return;
        }

        titipan.nama = nama;
        titipan.uangTitipan = uang;
        titipan.barang = JSON.parse(JSON.stringify(barangTitipanForm));
        titipan.total = total;
        titipan.sisa = sisa;
    }

    simpanData("daftarTitipan", daftarTitipan);

    tampilkanTitipan();
    tampilkanHutang();
    updateDashboard();
    tampilkanModal();
    tutupModalTitipan();
}

function editTitipan(id) {
    const titipan = daftarTitipan.find(function(item) {
        return item.id === id;
    });

    if (!titipan) {
        alert("Data titipan tidak ditemukan.");
        return;
    }

    modeTitipan = "edit";
    editTitipanId = id;

    document.getElementById("judulModalTitipan").textContent = "Edit Titipan";
    document.getElementById("namaPelanggan").value = titipan.nama;
    document.getElementById("uangTitipan").value = titipan.uangTitipan;

    barangTitipanForm = JSON.parse(JSON.stringify(titipan.barang || []));

    tampilkanBarangTitipanForm();

    document.getElementById("modalTitipan").classList.add("show");
}

function hapusTitipan(id) {
    if (!confirm("Hapus titipan ini?")) {
        return;
    }

    daftarTitipan = daftarTitipan.filter(function(item) {
        return item.id !== id;
    });

    simpanData("daftarTitipan", daftarTitipan);

    tampilkanTitipan();
    tampilkanHutang();
    updateDashboard();
    tampilkanModal();
}

function tutupModalTitipan() {
    const modal = document.getElementById("modalTitipan");

    if (modal) {
        modal.classList.remove("show");
    }

    modeTitipan = "tambah";
    editTitipanId = null;
    barangTitipanForm = [];
}

function tampilkanTitipan() {
    const tabel = document.getElementById("tabelTitipan");

    if (!tabel) {
        return;
    }

    tabel.innerHTML = "";

    if (daftarTitipan.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;">
                    Belum ada titipan
                </td>
            </tr>
        `;
        return;
    }

    daftarTitipan.forEach(function(titipan) {
        const barangList = titipan.barang || [];

        if (barangList.length === 0) {
            return;
        }

        barangList.forEach(function(barang, barangIndex) {
            const row = document.createElement("tr");

            let namaCell = "";
            let uangCell = "";
            let sisaCell = "";
            let aksiCell = "";

            if (barangIndex === 0) {
                namaCell = `<td rowspan="${barangList.length}">${escapeHTML(titipan.nama)}</td>`;
                uangCell = `<td rowspan="${barangList.length}">${rupiah(titipan.uangTitipan)}</td>`;

                if (Number(titipan.sisa) < 0) {
                    sisaCell = `<td rowspan="${barangList.length}" class="hutang">Hutang ${rupiah(Math.abs(titipan.sisa))}</td>`;
                } else {
                    sisaCell = `<td rowspan="${barangList.length}">${rupiah(titipan.sisa)}</td>`;
                }

                aksiCell = `
                    <td rowspan="${barangList.length}">
                        <button class="btn-edit" onclick="editTitipan(${titipan.id})">✏️ Edit</button>
                        <button class="btn-hapus" onclick="hapusTitipan(${titipan.id})">🗑️ Hapus</button>
                    </td>
                `;
            }

            row.innerHTML = `
                <td>${barangIndex === 0 ? daftarTitipan.indexOf(titipan) + 1 : ""}</td>
                ${namaCell}
                ${uangCell}
                <td>${escapeHTML(barang.nama)}</td>
                <td>${barang.qty}</td>
                <td>${escapeHTML(barang.satuan)}</td>
                <td>${rupiah(barang.harga)}</td>
                <td>${rupiah(barang.total)}</td>
                ${sisaCell}
                ${aksiCell}
            `;

            tabel.appendChild(row);
        });
    });
}