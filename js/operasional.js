function tambahOperasional() {
    modeOperasional = "tambah";
    editOperasionalId = null;

    document.getElementById("judulModalOperasional").textContent = "Tambah Biaya Operasional";
    document.getElementById("keteranganOperasional").value = "";
    document.getElementById("jumlahOperasional").value = "";

    document.getElementById("modalOperasional").classList.add("show");

    setTimeout(function() {
        const input = document.getElementById("keteranganOperasional");
        if (input) input.focus();
    }, 100);
}

function simpanOperasional() {
    const keterangan = document.getElementById("keteranganOperasional").value.trim();
    const jumlah = Number(document.getElementById("jumlahOperasional").value);

    if (keterangan === "") {
        alert("Keterangan biaya harus diisi.");
        return;
    }

    if (!Number.isFinite(jumlah) || jumlah <= 0) {
        alert("Jumlah biaya harus lebih dari 0.");
        return;
    }

    if (modeOperasional === "tambah") {
        daftarOperasional.push({
            id: Date.now(),
            keterangan: keterangan,
            jumlah: jumlah
        });
    } else {
        const item = daftarOperasional.find(function(o) { return o.id === editOperasionalId; });
        if (item) {
            item.keterangan = keterangan;
            item.jumlah = jumlah;
        }
    }

    simpanData("daftarOperasional", daftarOperasional);
    tampilkanOperasional();
    updateDashboard();
    tampilkanLaporan();
    tutupModalOperasional();
}

function tutupModalOperasional() {
    const modal = document.getElementById("modalOperasional");
    if (modal) modal.classList.remove("show");
    modeOperasional = "tambah";
    editOperasionalId = null;
}

function editOperasional(id) {
    const item = daftarOperasional.find(function(o) { return o.id === id; });
    if (!item) return;

    modeOperasional = "edit";
    editOperasionalId = id;

    document.getElementById("judulModalOperasional").textContent = "Edit Biaya Operasional";
    document.getElementById("keteranganOperasional").value = item.keterangan;
    document.getElementById("jumlahOperasional").value = item.jumlah;

    document.getElementById("modalOperasional").classList.add("show");
}

function hapusOperasional(id) {
    if (!confirm("Hapus biaya operasional ini?")) return;

    daftarOperasional = daftarOperasional.filter(function(o) { return o.id !== id; });
    simpanData("daftarOperasional", daftarOperasional);

    tampilkanOperasional();
    updateDashboard();
    tampilkanLaporan();
}

function hitungTotalOperasional() {
    let total = 0;
    daftarOperasional.forEach(function(item) {
        total += Number(item.jumlah) || 0;
    });
    return total;
}

function tampilkanOperasional() {
    const tabel = document.getElementById("tabelOperasional");
    const totalDisplay = document.getElementById("totalOperasionalDisplay");

    if (totalDisplay) totalDisplay.textContent = rupiah(hitungTotalOperasional());
    if (!tabel) return;

    tabel.innerHTML = "";

    if (daftarOperasional.length === 0) {
        tabel.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data biaya operasional</td></tr>`;
        return;
    }

    daftarOperasional.forEach(function(item, index) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHTML(item.keterangan)}</td>
            <td>${rupiah(item.jumlah)}</td>
            <td>
                <button class="btn-edit" onclick="editOperasional(${item.id})">✏️ Edit</button>
                <button class="btn-hapus" onclick="hapusOperasional(${item.id})">🗑️ Hapus</button>
            </td>
        `;
        tabel.appendChild(row);
    });
}
