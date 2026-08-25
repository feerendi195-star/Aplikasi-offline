// =====================================================
// DATA UTAMA
// =====================================================

let modalAwal =
    Number(localStorage.getItem("modalAwal")) || 0;

let daftarBarang =
    ambilData("daftarBarang", []);

let daftarBelanja =
    ambilData("daftarBelanja", []);

let daftarTitipan =
    ambilData("daftarTitipan", []);

let daftarHutang =
    ambilData("daftarHutang", []);


// =====================================================
// DATA MODAL / EDIT
// =====================================================

let modeBelanja = "tambah";
let editBelanjaId = null;

let modeTitipan = "tambah";
let editTitipanId = null;

let modeHutang = "tambah";
let editHutangId = null;

let barangTitipanForm = [];
let daftarOperasional = ambilData("daftarOperasional", []);
let modeOperasional = "tambah";
let editOperasionalId = null;