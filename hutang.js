// =====================================================
// HUTANG MANUAL
// =====================================================

function tambahHutangManual() {
    modeHutang = "tambah";
    editHutangId = null;

    document.getElementById("namaHutang").value = "";
    document.getElementById("keteranganHutang").value = "";
    document.getElementById("jumlahHutang").value = "";

    document.getElementById("judulModalHutang").textContent = "Tambah Hutang";
    document.getElementById("modalHutang").classList.add("show");

    setTimeout(function() {
        const input = document.getElementById("namaHutang");
        if (input) {
            input.focus();
        }
    }, 100);
}

function simpanHutangManual() {
    const nama = document.getElementById("namaHutang").value.trim();
    const keterangan = document.getElementById("keteranganHutang").value.trim();
    const jumlah = Number(document.getElementById("jumlahHutang").value);

    if (nama === "") {
        alert("Nama pelanggan harus diisi.");
        return;
    }

    if (keterangan === "") {
        alert("Keterangan harus diisi.");
        return;
    }

    if (!Number.isFinite(jumlah) || jumlah <= 0) {
        alert("Jumlah hutang harus lebih dari 0.");
        return;
    }

    if (modeHutang === "tambah") {
        daftarHutang.push({
            id: Date.now(),
            nama: nama,
            keterangan: keterangan,
            jumlah: jumlah,
            dibayar: 0,
            sisa: jumlah,
            sumber: "Manual"
        });
    } else {
        const hutang = daftarHutang.find(function(item) {
            return item.id === editHutangId;
        });

        if (!hutang) {
            alert("Data hutang tidak ditemukan.");
            return;
        }

        hutang.nama = nama;
        hutang.keterangan = keterangan;
        hutang.jumlah = jumlah;
        hutang.sisa = Math.max(0, jumlah - Number(hutang.dibayar));
    }

    simpanData("daftarHutang", daftarHutang);

    tampilkanHutang();
    updateDashboard();
    tampilkanModal();
    tutupModalHutang();
}

function tutupModalHutang() {
    const modal = document.getElementById("modalHutang");

    if (modal) {
        modal.classList.remove("show");
    }

    modeHutang = "tambah";
    editHutangId = null;
}

function editHutang(id) {
    const hutang = daftarHutang.find(function(item) {
        return item.id === id;
    });

    if (!hutang) {
        alert("Data hutang tidak ditemukan.");
        return;
    }

    modeHutang = "edit";
    editHutangId = id;

    document.getElementById("judulModalHutang").textContent = "Edit Hutang";
    document.getElementById("namaHutang").value = hutang.nama;
    document.getElementById("keteranganHutang").value = hutang.keterangan;
    document.getElementById("jumlahHutang").value = hutang.jumlah;

    document.getElementById("modalHutang").classList.add("show");
}

function hapusHutang(id) {
    if (!confirm("Hapus data hutang ini?")) {
        return;
    }

    daftarHutang = daftarHutang.filter(function(hutang) {
        return hutang.id !== id;
    });

    simpanData("daftarHutang", daftarHutang);

    tampilkanHutang();
    updateDashboard();
    tampilkanModal();
}

function bayarHutangManual(id) {
    const hutang = daftarHutang.find(function(item) {
        return item.id === id;
    });

    if (!hutang) {
        alert("Data hutang tidak ditemukan.");
        return;
    }

    const input = prompt(
        "Masukkan jumlah pembayaran:\n" +
        "Sisa hutang: " + rupiah(hutang.sisa),
        hutang.sisa
    );

    if (input === null) {
        return;
    }

    const jumlahBayar = Number(input.replace(/\D/g, ""));

    if (!Number.isFinite(jumlahBayar) || jumlahBayar <= 0) {
        alert("Jumlah pembayaran tidak valid.");
        return;
    }

    if (jumlahBayar > hutang.sisa) {
        alert("Pembayaran tidak boleh lebih besar dari sisa hutang.");
        return;
    }

    hutang.dibayar = Number(hutang.dibayar) + jumlahBayar;
    hutang.sisa = Math.max(0, Number(hutang.jumlah) - hutang.dibayar);

    simpanData("daftarHutang", daftarHutang);

    tampilkanHutang();
    updateDashboard();
    tampilkanModal();

    alert(
        "Pembayaran berhasil.\n\n" +
        "Dibayar: " + rupiah(jumlahBayar) +
        "\nSisa: " + rupiah(hutang.sisa)
    );
}

function bayarHutangTitipan(id) {
    const titipan = daftarTitipan.find(function(item) {
        return item.id === id;
    });

    if (!titipan) {
        alert("Data titipan tidak ditemukan.");
        return;
    }

    if (Number(titipan.sisa) >= 0) {
        alert("Titipan ini tidak memiliki hutang.");
        return;
    }

    const sisaHutang = Math.abs(Number(titipan.sisa));

    const input = prompt(
        "Masukkan jumlah pembayaran:\n" +
        "Sisa hutang: " + rupiah(sisaHutang),
        sisaHutang
    );

    if (input === null) {
        return;
    }

    const jumlahBayar = Number(input.replace(/\D/g, ""));

    if (!Number.isFinite(jumlahBayar) || jumlahBayar <= 0) {
        alert("Jumlah pembayaran tidak valid.");
        return;
    }

    if (jumlahBayar > sisaHutang) {
        alert("Pembayaran tidak boleh lebih besar dari sisa hutang.");
        return;
    }

    titipan.sisa = Number(titipan.sisa) + jumlahBayar;

    simpanData("daftarTitipan", daftarTitipan);

    tampilkanTitipan();
    tampilkanHutang();
    updateDashboard();
    tampilkanModal();

    alert(
        "Pembayaran berhasil.\n\n" +
        "Dibayar: " + rupiah(jumlahBayar) +
        "\nSisa hutang: " + rupiah(Math.abs(Number(titipan.sisa)))
    );
}

function tampilkanHutang() {
    const tabel = document.getElementById("tabelHutang");
    const totalHutangDisplay = document.getElementById("totalHutangDisplay");
    const totalDibayarDisplay = document.getElementById("totalDibayarDisplay");
    const totalSisaHutangDisplay = document.getElementById("totalSisaHutangDisplay");

    let totalHutang = 0;
    let totalDibayar = 0;
    let totalSisa = 0;

    daftarHutang.forEach(function(hutang) {
        totalHutang += Number(hutang.jumlah) || 0;
        totalDibayar += Number(hutang.dibayar) || 0;
        totalSisa += Number(hutang.sisa) || 0;
    });

    daftarTitipan.forEach(function(titipan) {
        if (Number(titipan.sisa) < 0) {
            totalHutang += Math.abs(Number(titipan.sisa));
            totalSisa += Math.abs(Number(titipan.sisa));
        }
    });

    if (totalHutangDisplay) {
        totalHutangDisplay.textContent = rupiah(totalHutang);
    }
    if (totalDibayarDisplay) {
        totalDibayarDisplay.textContent = rupiah(totalDibayar);
    }
    if (totalSisaHutangDisplay) {
        totalSisaHutangDisplay.textContent = rupiah(totalSisa);
    }

    if (!tabel) {
        return;
    }

    tabel.innerHTML = "";
    let nomor = 1;

    daftarTitipan.forEach(function(titipan) {
        if (Number(titipan.sisa) >= 0) {
            return;
        }

        const jumlah = Math.abs(Number(titipan.sisa));
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${nomor++}</td>
            <td>${escapeHTML(titipan.nama)}</td>
            <td>Kekurangan pembayaran titipan</td>
            <td>${rupiah(jumlah)}</td>
            <td>Rp 0</td>
            <td class="hutang">${rupiah(jumlah)}</td>
            <td>Titipan</td>
            <td>
                <button class="btn-edit" onclick="bayarHutangTitipan(${titipan.id})">💵 Bayar</button>
            </td>
        `;

        tabel.appendChild(row);
    });

    daftarHutang.forEach(function(hutang) {
        if (Number(hutang.sisa) <= 0) {
            return;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${nomor++}</td>
            <td>${escapeHTML(hutang.nama)}</td>
            <td>${escapeHTML(hutang.keterangan)}</td>
            <td>${rupiah(hutang.jumlah)}</td>
            <td>${rupiah(hutang.dibayar)}</td>
            <td class="hutang">${rupiah(hutang.sisa)}</td>
            <td>Manual</td>
            <td>
                <button class="btn-edit" onclick="bayarHutangManual(${hutang.id})">💵 Bayar</button>
                <button class="btn-edit" onclick="editHutang(${hutang.id})">✏️</button>
                <button class="btn-hapus" onclick="hapusHutang(${hutang.id})">🗑️</button>
            </td>
        `;

        tabel.appendChild(row);
    });

    if (nomor === 1) {
        tabel.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    Tidak ada hutang aktif
                </td>
            </tr>
        `;
    }
}