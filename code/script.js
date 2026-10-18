const KUNCI_DATA = "deadlinein_tugas";
const KUNCI_PESAN = "deadlinein_pesan";

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MATA_KULIAH = {
  "manajemen-proyek": { nama: "Manajemen Proyek", kode: "CRI3B1" },
  "perancangan-dan-pemrograman-web": { nama: "Perancangan dan Pemrograman Web", kode: "CRI3B3" },
  "manajemen-bisnis": { nama: "Manajemen Bisnis", kode: "CRI3B2" },
  "pengalaman-pengguna": { nama: "Pengalaman Pengguna", kode: "CRI3B1" },
  "lainnya": { nama: "Lainnya", kode: "-" }
};

const STATUS = {
  belum: { label: "Belum dikerjakan", badge: "text-bg-secondary" },
  proses: { label: "Sedang dikerjakan", badge: "text-bg-warning" },
  selesai: { label: "Selesai", badge: "text-bg-success" }
};

function pad(angka) {
  return String(angka).padStart(2, "0");
}

function isoRelatif(hari, jam = 23, menit = 59) {
  const d = new Date();
  d.setDate(d.getDate() + hari);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(jam)}:${pad(menit)}`;
}

function buatDataAwal() {
  return [
    {
      id: 1,
      nama: "Tugas 02 HTML",
      matkul: "perancangan-dan-pemrograman-web",
      dosen: "VLY",
      deadline: isoRelatif(2, 23, 59),
      status: "proses",
      deskripsi: "Buat sebuah halaman web sederhana menggunakan HTML dan CSS berdasarkan studi kasus yang diberikan. Mencakup pembuatan struktur dasar HTML, penggunaan elemen HTML, penerapan CSS untuk mengatur tampilan dan tata letak halaman, serta implementasi halaman web sesuai dengan desain yang ditentukan. Kumpulkan hasil pengerjaan dalam format PDF melalui portal kelas.",
      lampiran: "lampiran-tugas.pdf",
      lampiranUrl: "../assets/lampiran-tugas.pdf"
    },
    {
      id: 2,
      nama: "Kuis 02",
      matkul: "perancangan-dan-pemrograman-web",
      dosen: "VLY",
      deadline: isoRelatif(4, 17, 0),
      status: "belum",
      deskripsi: "Kuis singkat mencakup materi HTML dan CSS dari pertemuan sebelumnya.",
      lampiran: "",
      lampiranUrl: ""
    },
    {
      id: 3,
      nama: "Project 01",
      matkul: "pengalaman-pengguna",
      dosen: "BWW",
      deadline: isoRelatif(5, 23, 59),
      status: "belum",
      deskripsi: "Project pertama mata kuliah Pengalaman Pengguna.",
      lampiran: "",
      lampiranUrl: ""
    },
    {
      id: 4,
      nama: "Tugas 01 Pengenalan Web",
      matkul: "perancangan-dan-pemrograman-web",
      dosen: "VLY",
      deadline: isoRelatif(-5, 23, 59),
      status: "selesai",
      deskripsi: "Tugas pengenalan konsep dasar web.",
      lampiran: "",
      lampiranUrl: ""
    }
  ];
}

function simpanTugas(daftar) {
  try {
    localStorage.setItem(KUNCI_DATA, JSON.stringify(daftar));
  } catch (err) {
    console.warn("Penyimpanan browser tidak tersedia:", err);
  }
}

function muatTugas() {
  try {
    const mentah = localStorage.getItem(KUNCI_DATA);
    if (mentah) {
      return JSON.parse(mentah);
    }
  } catch (err) {
    console.warn("Gagal membaca data tersimpan, memakai data awal.", err);
  }
  const awal = buatDataAwal();
  simpanTugas(awal);
  return awal;
}

let semuaTugas = muatTugas();

function namaMatkul(kode) {
  return MATA_KULIAH[kode] ? MATA_KULIAH[kode].nama : "Lainnya";
}

function cariTugas(id) {
  return semuaTugas.find(t => t.id === id);
}

function hapusTugasById(id) {
  semuaTugas = semuaTugas.filter(t => t.id !== id);
  simpanTugas(semuaTugas);
}

function ambilAktif(daftar) {
  return daftar.filter(t => t.status !== "selesai");
}

function hitungAktif(daftar) {
  return ambilAktif(daftar).length;
}

function urutkanTugas(daftar, cara = "deadline-asc") {
  const salinan = [...daftar];
  switch (cara) {
    case "deadline-desc":
      salinan.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      break;
    case "nama":
      salinan.sort((a, b) => a.nama.localeCompare(b.nama));
      break;
    default:
      salinan.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }
  return salinan;
}

function filterTugas(daftar, { kata = "", status = "semua" } = {}) {
  const kunci = kata.trim().toLowerCase();
  return daftar.filter(t => {
    const cocokStatus = status === "semua" || t.status === status;
    const cocokKata =
      kunci === "" ||
      t.nama.toLowerCase().includes(kunci) ||
      namaMatkul(t.matkul).toLowerCase().includes(kunci);
    return cocokStatus && cocokKata;
  });
}

function kelompokkanPerMatkul(daftar) {
  const hasil = {};
  for (const t of daftar) {
    if (!hasil[t.matkul]) {
      hasil[t.matkul] = [];
    }
    hasil[t.matkul].push(t);
  }
  return hasil;
}

function hitungSisaHari(iso) {
  const sekarang = new Date();
  const hariIni = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());
  const d = new Date(iso);
  const hariDeadline = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((hariDeadline - hariIni) / 86400000);
}

function labelSisaWaktu(iso) {
  const sisa = hitungSisaHari(iso);
  if (sisa < 0) {
    return `Terlambat ${Math.abs(sisa)} hari`;
  } else if (sisa === 0) {
    return "Hari ini";
  } else if (sisa === 1) {
    return "Besok";
  }
  return `${sisa} hari lagi`;
}

function jamMenit(iso) {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTanggalSingkat(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]}`;
}

function formatTanggalPendek(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()].slice(0, 3)} ${d.getFullYear()}, ${jamMenit(iso)}`;
}

function formatTanggalPanjang(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}, ${jamMenit(iso)}`;
}

function esc(teks = "") {
  const peta = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(teks).replace(/[&<>"']/g, huruf => peta[huruf]);
}

function kartuTugasHome(t) {
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
                <span>${NAMA_BULAN[d.getMonth()]}</span>
                <span>${d.getFullYear()}</span>
              </time>
            </div>
          </div>
          <div class="col-8 col-sm-6">
            <h3 class="h6 mb-1">${esc(t.nama)}</h3>
            <p class="mb-1">${esc(namaMatkul(t.matkul))}</p>
            <span class="badge ${st.badge}">${st.label}</span>
            <small class="text-secondary d-block mt-1">Deadline pukul ${jamMenit(t.deadline)} &middot; ${labelSisaWaktu(t.deadline)}</small>
          </div>
          <div class="col-12 col-sm-3 d-flex flex-sm-column gap-2">
            <a class="btn btn-sm btn-outline-brand flex-fill" href="detail.html?id=${t.id}">Lihat detail</a>
            <a class="btn btn-sm btn-outline-brand flex-fill" href="form.html?id=${t.id}">Edit</a>
          </div>
        </div>
      </div>
    </article>`;
}

function kartuMatkul(kodeMatkul, daftarTugas) {
  let itemTugas = "";
  for (let i = 0; i < daftarTugas.length; i++) {
    itemTugas += `<a class="list-group-item list-group-item-action" href="detail.html?id=${daftarTugas[i].id}">${esc(daftarTugas[i].nama)}</a>`;
  }
  return `
    <article class="kartu-mk mt-3">
      <div class="kartu-mk-header" title="Klik untuk membuka/menutup daftar tugas">
        <h3 class="h6 mb-0">${esc(namaMatkul(kodeMatkul))}</h3>
        <span>${daftarTugas.length} tugas aktif</span>
      </div>
      <div class="list-group list-group-flush">${itemTugas}</div>
    </article>`;
}

function barisTugas(t, nomor) {
  const st = STATUS[t.status];
  return `
    <tr>
      <th scope="row">${nomor}</th>
      <td>${esc(t.nama)}</td>
      <td>${esc(namaMatkul(t.matkul))}</td>
      <td>
        <time datetime="${t.deadline}">${formatTanggalPendek(t.deadline)}</time>
        <small class="text-secondary d-block">${labelSisaWaktu(t.deadline)}</small>
      </td>
      <td><span class="badge ${st.badge}">${st.label}</span></td>
      <td class="text-end text-nowrap">
        <a class="btn btn-sm btn-outline-brand" href="detail.html?id=${t.id}">Detail</a>
        <a class="btn btn-sm btn-outline-brand" href="form.html?id=${t.id}">Edit</a>
        <button type="button" class="btn btn-sm btn-outline-danger btn-hapus" data-id="${t.id}">Hapus</button>
      </td>
    </tr>`;
}

function tampilNotifikasi(pesan, tipe = "success") {
  const $notif = $("#notifikasi");
  if ($notif.length === 0) {
    return;
  }
  $notif
    .removeClass("alert-success alert-danger alert-info alert-warning")
    .addClass(`alert-${tipe}`)
    .text(pesan)
    .stop(true, true)
    .fadeIn(250)
    .delay(1000)
    .fadeOut(400);
}

function simpanPesan(pesan) {
  try {
    sessionStorage.setItem(KUNCI_PESAN, pesan);
  } catch (err) {
    console.warn(err);
  }
}

function tampilPesanTersimpan() {
  try {
    const pesan = sessionStorage.getItem(KUNCI_PESAN);
    if (pesan) {
      sessionStorage.removeItem(KUNCI_PESAN);
      tampilNotifikasi(pesan);
    }
  } catch (err) {
    console.warn(err);
  }
}


/* ---------- home ---------- */
function initHome() {
  const aktif = urutkanTugas(ambilAktif(semuaTugas));

  $("#stat-total").text(hitungAktif(semuaTugas));

  if (aktif.length > 0) {
    $("#stat-mendesak").html(
      `<strong>${esc(aktif[0].nama)}</strong><br>` +
      `<span class="text-secondary">deadline ${formatTanggalSingkat(aktif[0].deadline)}</span>`
    );
  } else {
    $("#stat-mendesak").html('<span class="text-secondary">Tidak ada tugas mendesak</span>');
  }

  const kelompok = kelompokkanPerMatkul(aktif);
  $("#stat-matkul").text(Object.keys(kelompok).length);

  const mendekati = aktif.filter(t => hitungSisaHari(t.deadline) <= 3);
  if (mendekati.length > 0) {
    const daftarNama = mendekati.map(t => `<strong>${esc(t.nama)}</strong>`).join(", ");
    $("#isi-peringatan").html(
      `Ada <strong>${mendekati.length} tugas</strong> yang mendekati batas waktu: ${daftarNama}. ` +
      `Deadline terdekat <time datetime="${mendekati[0].deadline}">${formatTanggalPanjang(mendekati[0].deadline)}</time> ` +
      `(${labelSisaWaktu(mendekati[0].deadline)}). Segera selesaikan sebelum terlambat.`
    );
    $("#peringatan").slideDown(400); // efek jQuery: muncul dengan animasi
  }

  let htmlTugas = "";
  const batas = Math.min(3, aktif.length);
  for (let i = 0; i < batas; i++) {
    htmlTugas += kartuTugasHome(aktif[i]);
  }
  if (aktif.length === 0) {
    htmlTugas = '<p class="text-secondary mb-0">Tidak ada tugas aktif. Semua beres! 🎉</p>';
  }
  $("#list-tugas-home").html(htmlTugas);

  let htmlMatkul = "";
  for (const kode in kelompok) {
    htmlMatkul += kartuMatkul(kode, kelompok[kode]);
  }
  if (htmlMatkul === "") {
    htmlMatkul = '<p class="text-secondary mt-3 mb-0">Belum ada mata kuliah aktif.</p>';
  }
  $("#mk-container").html(htmlMatkul);

  $("#tutup-peringatan").on("click", function () {
    $("#peringatan").slideUp(300);
  });

  $("#mk-container").on("click", ".kartu-mk-header", function () {
    $(this).next(".list-group").slideToggle(250);
  });
}


/* ---------- datar tugas ---------- */
function initTugas() {
  function render() {
    const terfilter = filterTugas(semuaTugas, {
      kata: $("#cari-tugas").val(),
      status: $("#filter-status").val()
    });
    const hasil = urutkanTugas(terfilter, $("#urutan-tugas").val());

    let html = "";
    hasil.forEach((t, indeks) => {
      html += barisTugas(t, indeks + 1);
    });
    $("#tbody-tugas").html(html);
    $("#info-jumlah").text(`Menampilkan ${hasil.length} dari ${semuaTugas.length} tugas`);

    if (hasil.length === 0) {
      $("#kosong-tugas").fadeIn(200);
    } else {
      $("#kosong-tugas").hide();
    }
  }
  render();

  $("#cari-tugas").on("keyup", render);
  $("#filter-status, #urutan-tugas").on("change", render);

  $("#tbody-tugas").on("click", ".btn-hapus", function () {
    const id = Number($(this).data("id"));
    const tugas = cariTugas(id);
    if (!tugas) {
      return;
    }
    if (!confirm(`Hapus tugas "${tugas.nama}"?`)) {
      return;
    }
    // baris memudar dulu (fadeOut), baru data dihapus dan tabel digambar ulang
    $(this).closest("tr").fadeOut(300, function () {
      hapusTugasById(id);
      render();
      tampilNotifikasi(`Tugas "${tugas.nama}" berhasil dihapus.`, "danger");
    });
  });

  $("#btn-reset-data").on("click", function () {
    if (!confirm("Kembalikan semua data ke data dummy awal?")) {
      return;
    }
    semuaTugas = buatDataAwal();
    simpanTugas(semuaTugas);
    render();
    tampilNotifikasi("Data dikembalikan ke data dummy awal.", "info");
  });
}


/* ---------- form ---------- */
function initForm() {
  const idEdit = Number(new URLSearchParams(window.location.search).get("id"));
  const tugasEdit = idEdit ? cariTugas(idEdit) : null;

  if (tugasEdit) {
    const [tanggal, waktu] = tugasEdit.deadline.split("T"); 
    $("#judul-form").text("Edit Tugas");
    $("#btn-simpan").text("Simpan Perubahan");
    $("#nama-tugas").val(tugasEdit.nama);
    $("#mata-kuliah").val(tugasEdit.matkul);
    $("#dosen").val(tugasEdit.dosen);
    $("#tanggal-deadline").val(tanggal);
    $("#waktu-deadline").val(waktu);
    $("#status").val(tugasEdit.status);
    $("#deskripsi").val(tugasEdit.deskripsi);
    if (tugasEdit.lampiran) {
      $("#info-lampiran").text(`Lampiran saat ini: ${tugasEdit.lampiran}`).show();
    }
  }

  $("#form-tugas").on("submit", function (e) {
    e.preventDefault(); // cegah reload halaman

    const nama = $("#nama-tugas").val().trim();
    const matkul = $("#mata-kuliah").val();
    const tanggal = $("#tanggal-deadline").val();
    const waktu = $("#waktu-deadline").val();

    const daftarError = [];

    if (nama.length < 3) {
      daftarError.push("Nama tugas wajib diisi (minimal 3 karakter).");
      $("#nama-tugas").addClass("is-invalid");
    }
    if (matkul === "") {
      daftarError.push("Mata kuliah belum dipilih.");
      $("#mata-kuliah").addClass("is-invalid");
    }
    if (tanggal === "") {
      daftarError.push("Tanggal deadline wajib diisi.");
      $("#tanggal-deadline").addClass("is-invalid");
    }

    if (daftarError.length > 0) {
      let item = "";
      for (let i = 0; i < daftarError.length; i++) {
        item += `<li>${daftarError[i]}</li>`;
      }
      $("#ringkasan-error")
        .html(`<strong>Data belum lengkap:</strong><ul class="mb-0">${item}</ul>`)
        .slideDown(250);
      return;
    }

    $("#ringkasan-error").slideUp(150);

    const deadline = `${tanggal}T${waktu || "23:59"}`;
    const berkas = $("#lampiran")[0].files[0];
    let pesan;

    if (tugasEdit) {
      tugasEdit.nama = nama;
      tugasEdit.matkul = matkul;
      tugasEdit.dosen = $("#dosen").val().trim();
      tugasEdit.deadline = deadline;
      tugasEdit.status = $("#status").val();
      tugasEdit.deskripsi = $("#deskripsi").val().trim();
      if (berkas) {
        tugasEdit.lampiran = berkas.name;
        tugasEdit.lampiranUrl = "";
      }
      pesan = `Tugas "${nama}" berhasil diperbarui.`;
    } else {
      const idBaru = semuaTugas.reduce((maks, t) => Math.max(maks, t.id), 0) + 1;
      semuaTugas.push({
        id: idBaru,
        nama,
        matkul,
        dosen: $("#dosen").val().trim(),
        deadline,
        status: $("#status").val(),
        deskripsi: $("#deskripsi").val().trim(),
        lampiran: berkas ? berkas.name : "",
        lampiranUrl: ""
      });
      pesan = `Tugas "${nama}" berhasil ditambahkan.`;
    }

    simpanTugas(semuaTugas);
    simpanPesan(pesan);
    $("#btn-simpan").prop("disabled", true);
    window.location.href = "tugas.html";
  });

  $("#form-tugas").on("input change", ".is-invalid", function () {
    $(this).removeClass("is-invalid");
  });

  $("#form-tugas").on("reset", function () {
    $(".is-invalid").removeClass("is-invalid");
    $("#ringkasan-error").slideUp(150);
  });
}


/* ---------- detail tugas ---------- */
function initDetail() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  let tugas = cariTugas(id);

  if (!tugas) {
    $("#konten-detail").hide();
    $("#tidak-ditemukan").show();
    return;
  }

  function renderDetail() {
    const st = STATUS[tugas.status];
    const mk = MATA_KULIAH[tugas.matkul] || MATA_KULIAH["lainnya"];

    $("#detail-judul").text(tugas.nama);
    $("#detail-matkul").text(mk.nama);
    $("#detail-kode").text(mk.kode);
    $("#detail-dosen").text(tugas.dosen || "-");
    $("#detail-deadline").attr("datetime", tugas.deadline).text(formatTanggalPanjang(tugas.deadline));
    $("#detail-sisa").text(labelSisaWaktu(tugas.deadline));
    $("#detail-status").attr("class", `badge ${st.badge}`).text(st.label);
    $("#detail-instruksi").text(tugas.deskripsi || "Tidak ada instruksi.");
    $("#btn-edit").attr("href", `form.html?id=${tugas.id}`);

    if (tugas.lampiranUrl) {
      $("#detail-lampiran").html(
        `<a class="btn btn-sm btn-outline-brand" href="${esc(tugas.lampiranUrl)}">Buka lampiran (PDF)</a>`
      );
    } else if (tugas.lampiran) {
      $("#detail-lampiran").text(tugas.lampiran);
    } else {
      $("#detail-lampiran").text("Tidak ada lampiran.");
    }

    $("#btn-selesai").toggle(tugas.status !== "selesai");
  }
  renderDetail();

  $("#btn-toggle-instruksi").on("click", function () {
    const $kotak = $("#isi-instruksi");
    $kotak.slideToggle(250, function () {
      $("#btn-toggle-instruksi").text($kotak.is(":visible") ? "Sembunyikan" : "Tampilkan");
    });
  });

  $("#btn-selesai").on("click", function () {
    tugas.status = "selesai";
    simpanTugas(semuaTugas);
    renderDetail();
    tampilNotifikasi(`"${tugas.nama}" ditandai selesai.`);
  });

  $("#btn-hapus").on("click", function () {
    if (!confirm(`Hapus tugas "${tugas.nama}"?`)) {
      return;
    }
    $("#konten-detail").fadeOut(300, function () {
      hapusTugasById(tugas.id);
      simpanPesan(`Tugas "${tugas.nama}" berhasil dihapus.`);
      window.location.href = "tugas.html";
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
  }

  tampilPesanTersimpan();
});