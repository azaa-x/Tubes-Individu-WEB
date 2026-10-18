/* ---------- BAGIAN 1: DATA DUMMY ---------- */

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
               "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const STATUS = {
  belum:   { label: "Belum dikerjakan",  badge: "text-bg-secondary" },
  proses:  { label: "Sedang dikerjakan", badge: "text-bg-warning" },
  selesai: { label: "Selesai",           badge: "text-bg-success" }
};

const matkulAwal = [
  { nama: "Basis Data",                      kode: "CII2B3", dosen: "BDA" },
  { nama: "Perancangan dan Pemrograman Web", kode: "CRI3B3", dosen: "VLY" },
  { nama: "Manajemen Bisnis",                kode: "MBS101", dosen: "MBA" },
  { nama: "Struktur Data",                   kode: "CII2A3", dosen: "STD" },
  { nama: "Pengalaman Pengguna",             kode: "UXD301", dosen: "UXP" }
];

const tugasAwal = [
  {
    id: 1,
    nama: "Tugas 02 HTML",
    matkul: "Perancangan dan Pemrograman Web",
    dosen: "VLY",
    deadline: "2026-09-28T23:59",
    status: "proses",
    deskripsi: "Buat sebuah halaman web sederhana menggunakan HTML dan CSS berdasarkan studi kasus yang diberikan. Kumpulkan hasil pengerjaan dalam format PDF melalui portal kelas.",
    lampiran: "lampiran-tugas.pdf",
    lampiranUrl: "../assets/lampiran-tugas.pdf"
  },
  {
    id: 2,
    nama: "Kuis 02",
    matkul: "Perancangan dan Pemrograman Web",
    dosen: "VLY",
    deadline: "2026-09-30T17:00",
    status: "belum",
    deskripsi: "Kuis singkat materi HTML dan CSS.",
    lampiran: "",
    lampiranUrl: ""
  },
  {
    id: 3,
    nama: "Project 01",
    matkul: "Pengalaman Pengguna",
    dosen: "",
    deadline: "2026-10-01T23:59",
    status: "belum",
    deskripsi: "Project pertama mata kuliah Pengalaman Pengguna.",
    lampiran: "",
    lampiranUrl: ""
  },
  {
    id: 4,
    nama: "Tugas 01 Pengenalan Web",
    matkul: "Perancangan dan Pemrograman Web",
    dosen: "VLY",
    deadline: "2026-09-21T23:59",
    status: "selesai",
    deskripsi: "Tugas pengenalan konsep dasar web.",
    lampiran: "",
    lampiranUrl: ""
  }
];

function ambilData(kunci, dataAwal) {
  const tersimpan = localStorage.getItem(kunci);
  return tersimpan ? JSON.parse(tersimpan) : dataAwal;
}

let daftarTugas = ambilData("dl_tugas", tugasAwal);
let daftarMatkul = ambilData("dl_matkul_v2", matkulAwal);

function simpanData() {
  localStorage.setItem("dl_tugas", JSON.stringify(daftarTugas));
  localStorage.setItem("dl_matkul_v2", JSON.stringify(daftarMatkul));
}


/* ---------- BAGIAN 2: FUNCTION PEMROSES DATA ---------- */

function hitungAktif(daftar) {
  return daftar.filter(t => t.status !== "selesai").length;
}

function urutkanDeadline(daftar) {
  return [...daftar].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

function filterTugas(daftar, kata, status) {
  const kunci = kata.trim().toLowerCase();
  return daftar.filter(t => {
    const cocokStatus = status === "semua" || t.status === status;
    const cocokKata = t.nama.toLowerCase().includes(kunci) ||
                      t.matkul.toLowerCase().includes(kunci);
    return cocokStatus && cocokKata;
  });
}

function cariMatkul(nama) {
  return daftarMatkul.find(m => m.nama === nama);
}

function formatTanggal(iso) {
  const d = new Date(iso);
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${jam}:${menit}`;
}

function esc(teks) {
  return $("<div>").text(teks).html();
}


/* ---------- BAGIAN 3: FUNCTION PEMBUAT TAMPILAN ---------- */

function kartuTugas(t) {
  const d = new Date(t.deadline);
  const st = STATUS[t.status];
  return `
    <article class="card shadow-sm border-0">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-4 col-sm-3">
            <div class="tanggal-tugas">
              <time datetime="${t.deadline}">
                <span class="angka-tanggal">${d.getDate()}</span>
                <span>${BULAN[d.getMonth()]}</span>
                <span>${d.getFullYear()}</span>
              </time>
            </div>
          </div>
          <div class="col-8 col-sm-6">
            <h3 class="h6 mb-1">${esc(t.nama)}</h3>
            <p class="mb-1">${esc(t.matkul)}</p>
            <span class="badge ${st.badge}">${st.label}</span>
          </div>
          <div class="col-12 col-sm-3 d-flex flex-sm-column gap-2">
            <a class="btn btn-sm btn-outline-brand flex-fill" href="detail.html?id=${t.id}">Lihat detail</a>
            <a class="btn btn-sm btn-outline-brand flex-fill" href="form.html?id=${t.id}">Edit</a>
          </div>
        </div>
      </div>
    </article>`;
}

function barisTugas(t, nomor) {
  const st = STATUS[t.status];
  return `
    <tr>
      <th scope="row">${nomor}</th>
      <td>${esc(t.nama)}</td>
      <td>${esc(t.matkul)}</td>
      <td><time datetime="${t.deadline}">${formatTanggal(t.deadline)}</time></td>
      <td><span class="badge ${st.badge}">${st.label}</span></td>
      <td class="text-end text-nowrap">
        <a class="btn btn-sm btn-outline-brand" href="detail.html?id=${t.id}">Detail</a>
        <a class="btn btn-sm btn-outline-brand" href="form.html?id=${t.id}">Edit</a>
        <button type="button" class="btn btn-sm btn-outline-danger btn-hapus" data-id="${t.id}">Hapus</button>
      </td>
    </tr>`;
}


/* ---------- BAGIAN 4: jQuery ---------- */

function tampilNotifikasi(pesan, tipe) {
  $("#notifikasi")
    .removeClass("alert-success alert-danger alert-warning")
    .addClass("alert-" + tipe)
    .text(pesan)
    .stop(true, true)
    .fadeIn(250).delay(2500).fadeOut(400);
}

function isiPilihanMatkul(terpilih) {
  $("#mata-kuliah").html('<option value="">-- Pilih Mata Kuliah --</option>');
  daftarMatkul.forEach(m => {
    $("#mata-kuliah").append($("<option>").val(m.nama).text(m.nama));
  });
  $("#mata-kuliah").val(terpilih);
}


/* ----- home.html ----- */
function initHome() {
  const aktif = urutkanDeadline(daftarTugas.filter(t => t.status !== "selesai"));

  $("#stat-total").text(hitungAktif(daftarTugas));
  $("#stat-matkul").text(new Set(aktif.map(t => t.matkul)).size);

  if (aktif.length > 0) {
    const mendesak = aktif[0];
    $("#stat-mendesak").html(`<strong>${esc(mendesak.nama)}</strong><br>
      <span class="text-secondary">deadline ${formatTanggal(mendesak.deadline)}</span>`);
    $("#isi-peringatan").html(`Tugas paling mendesak: <strong>${esc(mendesak.nama)}</strong>,
      deadline <time datetime="${mendesak.deadline}">${formatTanggal(mendesak.deadline)}</time>.
      Segera selesaikan sebelum terlambat.`);
    $("#peringatan").slideDown(400);
  } else {
    $("#stat-mendesak").text("Tidak ada tugas");
  }

  let htmlTugas = "";
  for (let i = 0; i < Math.min(3, aktif.length); i++) {
    htmlTugas += kartuTugas(aktif[i]);
  }
  $("#list-tugas-home").html(htmlTugas || '<p class="text-secondary mb-0">Tidak ada tugas aktif.</p>');

  let htmlMatkul = "";
  for (const mk of daftarMatkul) {
    const milik = aktif.filter(t => t.matkul === mk.nama);
    if (milik.length === 0) {
      continue;
    }
    let item = "";
    milik.forEach(t => {
      item += `<a class="list-group-item list-group-item-action" href="detail.html?id=${t.id}">${esc(t.nama)}</a>`;
    });
    htmlMatkul += `
      <article class="kartu-mk mt-3">
        <div class="kartu-mk-header">
          <h3 class="h6 mb-0">${esc(mk.nama)}</h3>
          <span>${milik.length} tugas aktif</span>
        </div>
        <div class="list-group list-group-flush">${item}</div>
      </article>`;
  }
  $("#mk-container").html(htmlMatkul);

  $("#tutup-peringatan").on("click", function () {
    $("#peringatan").slideUp(300);
  });
}


/* ----- tugas.html ----- */
function initTugas() {
  function tampilkan() {
    const hasil = urutkanDeadline(
      filterTugas(daftarTugas, $("#cari-tugas").val(), $("#filter-status").val())
    );
    let html = "";
    hasil.forEach((t, i) => {
      html += barisTugas(t, i + 1);
    });
    $("#tbody-tugas").html(html);

    if (hasil.length === 0) {
      $("#kosong-tugas").show();
    } else {
      $("#kosong-tugas").hide();
    }
  }

  tampilkan();

  $("#cari-tugas").on("keyup", tampilkan);
  $("#filter-status").on("change", tampilkan);

  $("#tbody-tugas").on("click", ".btn-hapus", function () {
    const id = Number($(this).data("id"));
    const tugas = daftarTugas.find(t => t.id === id);
    if (!confirm(`Hapus tugas "${tugas.nama}"?`)) {
      return;
    }
    $(this).closest("tr").fadeOut(300, function () {
      daftarTugas = daftarTugas.filter(t => t.id !== id);
      simpanData();
      tampilkan();
      tampilNotifikasi("Tugas berhasil dihapus.", "danger");
    });
  });
}


/* ----- form.html ----- */
function initForm() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const tugasEdit = daftarTugas.find(t => t.id === id);

  isiPilihanMatkul(tugasEdit ? tugasEdit.matkul : "");

  $("#mata-kuliah").on("change", function () {
    const mk = cariMatkul($(this).val());
    if (mk && $("#dosen").val().trim() === "") {
      $("#dosen").val(mk.dosen);
    }
  });

  if (tugasEdit) {
    const [tanggal, waktu] = tugasEdit.deadline.split("T");
    $("#judul-form").text("Edit Tugas");
    $("#nama-tugas").val(tugasEdit.nama);
    $("#dosen").val(tugasEdit.dosen);
    $("#tanggal-deadline").val(tanggal);
    $("#waktu-deadline").val(waktu);
    $("#status").val(tugasEdit.status);
    $("#deskripsi").val(tugasEdit.deskripsi);
  }

  $("#form-tugas").on("submit", function (e) {
    e.preventDefault();
    $(".is-invalid").removeClass("is-invalid");

    const nama = $("#nama-tugas").val().trim();
    const matkul = $("#mata-kuliah").val();
    const tanggal = $("#tanggal-deadline").val();

    if (nama === "") {
      $("#nama-tugas").addClass("is-invalid");
    }
    if (matkul === "") {
      $("#mata-kuliah").addClass("is-invalid");
    }
    if (tanggal === "") {
      $("#tanggal-deadline").addClass("is-invalid");
    }
    if ($(".is-invalid").length > 0) {
      return;
    }

    const data = {
      nama: nama,
      matkul: matkul,
      dosen: $("#dosen").val().trim(),
      deadline: tanggal + "T" + ($("#waktu-deadline").val() || "23:59"),
      status: $("#status").val(),
      deskripsi: $("#deskripsi").val().trim()
    };
    const berkas = $("#lampiran")[0].files[0];
    if (berkas) {
      data.lampiran = berkas.name;
      data.lampiranUrl = "";
    }

    if (tugasEdit) {
      Object.assign(tugasEdit, data);
    } else {
      daftarTugas.push({ id: Date.now(), lampiran: "", lampiranUrl: "", ...data });
    }
    simpanData();
    window.location.href = "tugas.html";
  });

  $("#form-tugas").on("input change", ".is-invalid", function () {
    $(this).removeClass("is-invalid");
  });
}


/* ----- detail.html ----- */
function initDetail() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const t = daftarTugas.find(x => x.id === id);

  if (!t) {
    $("#konten-detail").hide();
    $("#tidak-ditemukan").show();
    return;
  }

  const st = STATUS[t.status];
  $("#detail-judul").text(t.nama);
  const mk = cariMatkul(t.matkul);
  $("#detail-matkul").text(t.matkul);
  $("#detail-kode").text(mk ? mk.kode : "-");
  $("#detail-dosen").text(t.dosen || "-");
  $("#detail-deadline").attr("datetime", t.deadline).text(formatTanggal(t.deadline));
  $("#detail-status").addClass(st.badge).text(st.label);
  $("#detail-instruksi").text(t.deskripsi || "Tidak ada instruksi.");
  $("#btn-edit").attr("href", "form.html?id=" + t.id);

  if (t.lampiranUrl) {
    $("#detail-lampiran").html(`<a class="btn btn-sm btn-outline-brand" href="${t.lampiranUrl}">Buka lampiran (PDF)</a>`);
  } else {
    $("#detail-lampiran").text(t.lampiran || "Tidak ada lampiran.");
  }

  $("#btn-hapus").on("click", function () {
    if (!confirm(`Hapus tugas "${t.nama}"?`)) {
      return;
    }
    $("#konten-detail").fadeOut(300, function () {
      daftarTugas = daftarTugas.filter(x => x.id !== t.id);
      simpanData();
      window.location.href = "tugas.html";
    });
  });
}


/* ----- matkul.html ----- */
function initMatkul() {
  function tampilkan() {
    let html = "";
    daftarMatkul.forEach((m, i) => {
      const jumlah = daftarTugas.filter(t => t.matkul === m.nama).length;
      html += `
        <tr>
          <th scope="row">${i + 1}</th>
          <td>${esc(m.nama)}</td>
          <td>${esc(m.kode)}</td>
          <td>${esc(m.dosen)}</td>
          <td>${jumlah}</td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-danger btn-hapus-mk" data-index="${i}">Hapus</button>
          </td>
        </tr>`;
    });
    $("#tbody-matkul").html(html);

    if (daftarMatkul.length === 0) {
      $("#kosong-matkul").show();
    } else {
      $("#kosong-matkul").hide();
    }
  }

  tampilkan();

  $("#form-matkul").on("submit", function (e) {
    e.preventDefault();
    $("#form-matkul .is-invalid").removeClass("is-invalid");

    const nama = $("#nama-mk").val().trim();
    const kode = $("#kode-mk").val().trim().toUpperCase();
    const dosen = $("#dosen-mk").val().trim().toUpperCase();

    if (nama === "") {
      $("#error-nama").text("Nama mata kuliah wajib diisi.");
      $("#nama-mk").addClass("is-invalid");
    } else if (daftarMatkul.some(m => m.nama.toLowerCase() === nama.toLowerCase())) {
      $("#error-nama").text("Mata kuliah ini sudah ada.");
      $("#nama-mk").addClass("is-invalid");
    }

    if (kode === "") {
      $("#error-kode").text("Kode mata kuliah wajib diisi.");
      $("#kode-mk").addClass("is-invalid");
    } else if (daftarMatkul.some(m => m.kode === kode)) {
      $("#error-kode").text("Kode ini sudah dipakai mata kuliah lain.");
      $("#kode-mk").addClass("is-invalid");
    }

    if (dosen === "") {
      $("#dosen-mk").addClass("is-invalid");
    }

    if ($("#form-matkul .is-invalid").length > 0) {
      return;
    }

    daftarMatkul.push({ nama: nama, kode: kode, dosen: dosen });
    simpanData();
    $("#form-matkul")[0].reset();
    tampilkan();
    tampilNotifikasi(`"${nama}" berhasil ditambahkan.`, "success");
  });

  $("#form-matkul").on("input", ".is-invalid", function () {
    $(this).removeClass("is-invalid");
  });

  $("#tbody-matkul").on("click", ".btn-hapus-mk", function () {
    const index = Number($(this).data("index"));
    const nama = daftarMatkul[index].nama;

    if (daftarTugas.some(t => t.matkul === nama)) {
      tampilNotifikasi(`"${nama}" masih dipakai tugas, hapus tugasnya dulu.`, "warning");
      return;
    }
    if (!confirm(`Hapus mata kuliah "${nama}"?`)) {
      return;
    }
    $(this).closest("tr").fadeOut(300, function () {
      daftarMatkul.splice(index, 1);
      simpanData();
      tampilkan();
      tampilNotifikasi(`"${nama}" berhasil dihapus.`, "danger");
    });
  });
}


$(document).ready(function () {
  const halaman = $("body").data("halaman");

  if (halaman === "home") {
    initHome();
  } else if (halaman === "tugas") {
    initTugas();
  } else if (halaman === "form") {
    initForm();
  } else if (halaman === "detail") {
    initDetail();
  } else if (halaman === "matkul") {
    initMatkul();
  }
});