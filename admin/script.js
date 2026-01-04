// Admin Panel Script - XSchool
// Sinkronisasi dengan app.js dan data.json
document.addEventListener('DOMContentLoaded', function() { 
    const adminModal = document.getElementById('adminModal');

    // Deklarasi fungsi global
    window.openAdminModal = function() { 
        if (adminModal) {
            adminModal.classList.remove('hidden');
        }
    };

    // Menjalankan fungsi jika hash sesuai
    if (window.location.hash === '#adminBtn') {
        window.openAdminModal();
    }

    // Cek Status Login
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true' || 
                      localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Anda harus login sebagai admin terlebih dahulu!');
        window.location.href = '../index.html#adminBtn';
        return;
    }

    // Panggil fungsi inisialisasi di dalam DOMContentLoaded
    initializeAdminPanel();
    setupEventListeners();
}); // <--- PENUTUP YANG BENAR HANYA DI SINI

function initializeAdminPanel() {
    console.log('Admin Panel XSchool Dimuat!');
    
    // Load initial data
    loadSiswaData();
    loadKegiatanData();
    updateStatistics();
    
    // Setup modal
    setupEditModal();
}

function setupEventListeners() {
    // Tambahkan logika setup event listener di sini
    console.log('Event Listeners disiapkan');
}

// Tambahkan fungsi pendukung lainnya agar tidak error saat dipanggil
function loadSiswaData() { console.log('Memuat data siswa...'); }
function loadKegiatanData() { console.log('Memuat data kegiatan...'); }
function updateStatistics() { console.log('Memperbarui statistik...'); }
function setupEditModal() { console.log('Menyiapkan modal edit...'); }


function setupEventListeners() {
    // Form tambah siswa
    document.getElementById('formTambahSiswa').addEventListener('submit', function(e) {
        e.preventDefault();
        tambahSiswa();
    });
    
    // Form tambah kegiatan
    document.getElementById('formTambahKegiatan').addEventListener('submit', function(e) {
        e.preventDefault();
        tambahKegiatan();
    });
    
    // Reset localStorage button
    document.getElementById('btnResetLocalStorage').addEventListener('click', function() {
        if (confirm('Yakin ingin menghapus SEMUA data simulasi di localStorage? Data tidak dapat dikembalikan!')) {
            localStorage.removeItem('siswa_extra');
            localStorage.removeItem('kegiatan_extra');
            alert('✅ Semua data simulasi di localStorage telah direset.');
            loadSiswaData();
            loadKegiatanData();
            updateStatistics();
        }
    });
    
    // Edit form submission
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEdit();
    });
}

// Data dari app.js (replicated untuk admin panel)
const kegiatanData = [
    {
        "gambar": "https://ik.imagekit.io/abeS3/border-15.jpg?updatedAt=1766945627219",
        "nama": "Kaligrafi Frame"
    },
    {
        "gambar": "https://ik.imagekit.io/abeS3/waw10.jpg?updatedAt=1766945626979",
        "nama": "Debat Bahasa"
    },
    {
        "gambar": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        "nama": "Hackathon"
    },
    {
        "gambar": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        "nama": "Pentas Seni"
    }
];

const siswaData = [
    {
        "id": 1,
        "nama": "Ahmad Nasichun Ism",
        "jk": "Pria",
        "kelas": 10,
        "kegiatan": "IT"
    },
    {
        "id": 2,
        "nama": "Itmamul Wafa",
        "jk": "Pria",
        "kelas": 11,
        "kegiatan": "Seni"
    },
    {
        "id": 3,
        "nama": "Ainul Fitri",
        "jk": "Pria",
        "kelas": 12,
        "kegiatan": "Debat"
    },
    {
        "id": 4,
        "nama": "Dewi Lestari",
        "jk": "Wanita",
        "kelas": 10,
        "kegiatan": "IT"
    },
    {
        "id": 5,
        "nama": "Rina Wijaya",
        "jk": "Wanita",
        "kelas": 11,
        "kegiatan": "Seni"
    },
    {
        "id": 6,
        "nama": "A.Muhtar",
        "jk": "Pria",
        "kelas": 12,
        "kegiatan": "Robotik"
    }
];

async function loadSiswaData() {
    try {
        // Load data from multiple sources
        let allSiswa = [...siswaData];
        
        // Load from data.json if available
        try {
            const response = await fetch('../data.json');
            if (response.ok) {
                const data = await response.json();
                if (data.students) {
                    // Map data.json students to our format
                    const mappedStudents = data.students.map(s => ({
                        id: s.id,
                        nama: s.name,
                        jk: s.gender,
                        kelas: s.class,
                        kegiatan: s.activity
                    }));
                    allSiswa = [...allSiswa, ...mappedStudents];
                }
            }
        } catch (error) {
            console.log('data.json tidak tersedia, menggunakan data lokal saja');
        }
        
        // Load from localStorage (user added data)
        const siswaExtra = localStorage.getItem('siswa_extra');
        if (siswaExtra) {
            const extra = JSON.parse(siswaExtra);
            allSiswa = [...allSiswa, ...extra];
        }
        
        // Remove duplicates based on id
        const uniqueSiswa = Array.from(new Map(allSiswa.map(s => [s.id, s])).values());
        
        // Render tabel
        renderTabelSiswa(uniqueSiswa);
        
        // Update statistics
        updateStatistics();
    } catch (error) {
        console.error('Gagal memuat data siswa:', error);
        document.getElementById('siswaTableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle"></i> Gagal memuat data siswa. Error: ${error.message}
                </td>
            </tr>
        `;
    }
}

function renderTabelSiswa(siswa) {
    const tbody = document.getElementById('siswaTableBody');
    
    if (siswa.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-users-slash"></i> Tidak ada data siswa.
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    siswa.forEach((s, index) => {
        const jkColor = s.jk === 'Pria' ? 'badge-info' : 'badge-warning';
        const kegiatanColor = getKegiatanColor(s.kegiatan);
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${s.nama}</strong></td>
                <td><span class="badge ${jkColor}">${s.jk}</span></td>
                <td>${s.kelas}</td>
                <td><span class="badge ${kegiatanColor}">${s.kegiatan}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" onclick="editSiswa(${s.id}, '${s.nama}', '${s.jk}', ${s.kelas}, '${s.kegiatan}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-action delete" onclick="deleteSiswa(${s.id})">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

async function loadKegiatanData() {
    try {
        // Load data from multiple sources
        let allKegiatan = [...kegiatanData];
        
        // Load from data.json if available
        try {
            const response = await fetch('../data.json');
            if (response.ok) {
                const data = await response.json();
                if (data.carousel) {
                    // Map data.json carousel to our format
                    const mappedCarousel = data.carousel.map(k => ({
                        id: k.id,
                        gambar: k.image,
                        nama: k.title
                    }));
                    allKegiatan = [...allKegiatan, ...mappedCarousel];
                }
            }
        } catch (error) {
            console.log('data.json tidak tersedia, menggunakan data lokal saja');
        }
        
        // Load from localStorage (user added data)
        const kegiatanExtra = localStorage.getItem('kegiatan_extra');
        if (kegiatanExtra) {
            const extra = JSON.parse(kegiatanExtra);
            allKegiatan = [...allKegiatan, ...extra];
        }
        
        // Remove duplicates based on id
        const uniqueKegiatan = Array.from(new Map(allKegiatan.map(k => [k.id, k])).values());
        
        // Render tabel
        renderTabelKegiatan(uniqueKegiatan);
        
        // Update statistics
        updateStatistics();
    } catch (error) {
        console.error('Gagal memuat data kegiatan:', error);
        document.getElementById('kegiatanTableBody').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 30px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle"></i> Gagal memuat data kegiatan. Error: ${error.message}
                </td>
            </tr>
        `;
    }
}

function renderTabelKegiatan(kegiatan) {
    const tbody = document.getElementById('kegiatanTableBody');
    
    if (kegiatan.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-calendar-times"></i> Tidak ada data kegiatan.
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    kegiatan.forEach((k, index) => {
        // Check if image exists
        const imageUrl = k.gambar || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${k.nama}</strong></td>
                <td>
                    <img src="${imageUrl}" 
                         alt="${k.nama}" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
                         onerror="this.src='https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'">
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" onclick="editKegiatan(${k.id}, '${k.nama}', '${k.gambar}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-action delete" onclick="deleteKegiatan(${k.id})">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function updateStatistics() {
    // Get all students
    let allSiswa = [...siswaData];
    
    // Add from localStorage
    const siswaExtra = localStorage.getItem('siswa_extra');
    if (siswaExtra) {
        const extra = JSON.parse(siswaExtra);
        allSiswa = [...allSiswa, ...extra];
    }
    
    // Calculate statistics
    const totalSiswa = allSiswa.length;
    const totalPria = allSiswa.filter(s => s.jk === 'Pria').length;
    const totalWanita = allSiswa.filter(s => s.jk === 'Wanita').length;
    
    // Get all activities
    let allKegiatan = [...kegiatanData];
    
    // Add from localStorage
    const kegiatanExtra = localStorage.getItem('kegiatan_extra');
    if (kegiatanExtra) {
        const extra = JSON.parse(kegiatanExtra);
        allKegiatan = [...allKegiatan, ...extra];
    }
    
    const totalKegiatan = allKegiatan.length;
    
    // Update DOM
    document.getElementById('totalSiswa').textContent = totalSiswa;
    document.getElementById('totalKegiatan').textContent = totalKegiatan;
    document.getElementById('totalPria').textContent = totalPria;
    document.getElementById('totalWanita').textContent = totalWanita;
}

function tambahSiswa() {
    const nama = document.getElementById('nama').value;
    const jk = document.getElementById('jk').value;
    const kelas = parseInt(document.getElementById('kelas').value);
    const kegiatan = document.getElementById('kegiatan').value;
    const prestasi = document.getElementById('prestasi').value;
    
    if (!nama || !jk || !kelas || !kegiatan) {
        alert('Harap lengkapi semua field yang wajib diisi!');
        return;
    }
    
    // Ambil data yang sudah ada di localStorage
    let siswaExtra = localStorage.getItem('siswa_extra');
    if (!siswaExtra) {
        siswaExtra = [];
    } else {
        siswaExtra = JSON.parse(siswaExtra);
    }
    
    // Generate new ID
    const newId = siswaExtra.length > 0 ? 
                  Math.max(...siswaExtra.map(s => s.id)) + 1 : 
                  1000;
    
    // Create new student object
    const newSiswa = {
        id: newId,
        nama: nama,
        jk: jk,
        kelas: kelas,
        kegiatan: kegiatan,
        prestasi: prestasi || '',
        tanggal_daftar: new Date().toISOString().split('T')[0]
    };
    
    // Add to localStorage
    siswaExtra.push(newSiswa);
    localStorage.setItem('siswa_extra', JSON.stringify(siswaExtra));
    
    // Show success message
    alert(`✅ Siswa "${nama}" berhasil ditambahkan ke dalam simulasi (localStorage).`);
    
    // Reset form
    document.getElementById('formTambahSiswa').reset();
    
    // Reload data
    loadSiswaData();
}

function tambahKegiatan() {
    const nama = document.getElementById('namaKegiatan').value;
    const gambar = document.getElementById('gambarKegiatan').value;
    const deskripsi = document.getElementById('deskripsiKegiatan').value;
    
    if (!nama || !gambar) {
        alert('Harap lengkapi nama kegiatan dan URL gambar!');
        return;
    }
    
    // Validate URL
    try {
        new URL(gambar);
    } catch (error) {
        alert('URL gambar tidak valid! Harap masukkan URL yang benar.');
        return;
    }
    
    // Ambil data yang sudah ada di localStorage
    let kegiatanExtra = localStorage.getItem('kegiatan_extra');
    if (!kegiatanExtra) {
        kegiatanExtra = [];
    } else {
        kegiatanExtra = JSON.parse(kegiatanExtra);
    }
    
    // Generate new ID
    const newId = kegiatanExtra.length > 0 ? 
                  Math.max(...kegiatanExtra.map(k => k.id)) + 1 : 
                  2000;
    
    // Create new activity object
    const newKegiatan = {
        id: newId,
        gambar: gambar,
        nama: nama,
        deskripsi: deskripsi || '',
        tanggal_dibuat: new Date().toISOString().split('T')[0]
    };
    
    // Add to localStorage
    kegiatanExtra.push(newKegiatan);
    localStorage.setItem('kegiatan_extra', JSON.stringify(kegiatanExtra));
    
    // Show success message
    alert(`✅ Kegiatan "${nama}" berhasil ditambahkan ke dalam simulasi (localStorage).`);
    
    // Reset form
    document.getElementById('formTambahKegiatan').reset();
    
    // Reload data
    loadKegiatanData();
}

function editSiswa(id, nama, jk, kelas, kegiatan) {
    // Open edit modal
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');
    
    // Fill form
    document.getElementById('editNama').value = nama;
    document.getElementById('editJK').value = jk;
    document.getElementById('editKelas').value = kelas;
    document.getElementById('editKegiatan').value = kegiatan;
    document.getElementById('editId').value = id;
    document.getElementById('editType').value = 'siswa';
}

function editKegiatan(id, nama, gambar) {
    // Open edit modal
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');
    
    // Fill form - For now, we only have basic edit for kegiatan
    // In a real app, you'd have a proper form for kegiatan
    alert('Edit detail kegiatan belum tersedia. Fitur akan datang!');
    modal.classList.add('hidden');
}

function setupEditModal() {
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('#editModal .close-btn');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

function saveEdit() {
    const id = parseInt(document.getElementById('editId').value);
    const type = document.getElementById('editType').value;
    const modal = document.getElementById('editModal');
    
    if (type === 'siswa') {
        const nama = document.getElementById('editNama').value;
        const jk = document.getElementById('editJK').value;
        const kelas = parseInt(document.getElementById('editKelas').value);
        const kegiatan = document.getElementById('editKegiatan').value;
        
        // Get data from localStorage
        let siswaExtra = localStorage.getItem('siswa_extra');
        if (siswaExtra) {
            siswaExtra = JSON.parse(siswaExtra);
            
            // Find and update the student
            const index = siswaExtra.findIndex(s => s.id === id);
            if (index !== -1) {
                siswaExtra[index] = {
                    ...siswaExtra[index],
                    nama: nama,
                    jk: jk,
                    kelas: kelas,
                    kegiatan: kegiatan
                };
                
                // Save back to localStorage
                localStorage.setItem('siswa_extra', JSON.stringify(siswaExtra));
                alert('✅ Data siswa berhasil diperbarui!');
            }
        }
    }
    
    // Close modal
    modal.classList.add('hidden');
    
    // Reload data
    if (type === 'siswa') {
        loadSiswaData();
    } else if (type === 'kegiatan') {
        loadKegiatanData();
    }
}

function deleteSiswa(id) {
    if (!confirm('Yakin ingin menghapus siswa ini dari data simulasi?')) {
        return;
    }
    
    // Get data from localStorage
    let siswaExtra = localStorage.getItem('siswa_extra');
    if (siswaExtra) {
        siswaExtra = JSON.parse(siswaExtra);
        
        // Filter out the student to delete
        const updatedSiswa = siswaExtra.filter(s => s.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('siswa_extra', JSON.stringify(updatedSiswa));
        alert('✅ Siswa berhasil dihapus dari data simulasi!');
        
        // Reload data
        loadSiswaData();
    }
}

function deleteKegiatan(id) {
    if (!confirm('Yakin ingin menghapus kegiatan ini dari data simulasi?')) {
        return;
    }
    
    // Get data from localStorage
    let kegiatanExtra = localStorage.getItem('kegiatan_extra');
    if (kegiatanExtra) {
        kegiatanExtra = JSON.parse(kegiatanExtra);
        
        // Filter out the activity to delete
        const updatedKegiatan = kegiatanExtra.filter(k => k.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('kegiatan_extra', JSON.stringify(updatedKegiatan));
        alert('✅ Kegiatan berhasil dihapus dari data simulasi!');
        
        // Reload data
        loadKegiatanData();
    }
}
function getKegiatanColor(kegiatan) {
    const colors = {
        'Robotik': 'badge-info',
        'IT': 'badge-success',
        'Seni': 'badge-warning',
        'Debat': 'badge-info',
        'Sains': 'badge-success',
        'Olahraga': 'badge-warning',
        'Sosial': 'badge-info',
        'IT & Programming': 'badge-success',
        'Seni Tari & Musik': 'badge-warning'
    };
    
    return colors[kegiatan] || 'badge-info';
}

// Export function untuk digunakan di app.js
window.syncAdminData = function() {
    // Fungsi ini bisa dipanggil dari app.js untuk sinkronisasi data
    console.log('Admin data sync function available');
};
// --- FUNGSI HAPUS ---
window.deleteSiswa = function(id) {
    if (confirm('Yakin ingin menghapus siswa ini?')) {
        let extra = JSON.parse(localStorage.getItem('siswa_extra')) || [];
        
        // Cek apakah data ada di localStorage
        const isExtra = extra.some(s => s.id === id);
        
        if (isExtra) {
            extra = extra.filter(s => s.id !== id);
            localStorage.setItem('siswa_extra', JSON.stringify(extra));
            alert('✅ Data berhasil dihapus dari penyimpanan lokal.');
        } else {
            alert('⚠️ Data bawaan (sistem) tidak dapat dihapus, hanya data tambahan yang bisa dihapus.');
        }
        loadSiswaData(); // Refresh tabel
    }
};
