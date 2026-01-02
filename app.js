// ===========================================
// XSchool - Simple App
// ===========================================

// Data carousel dari data.json
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

// Data siswa dari data.json
const siswaData = [
  {
    "nama": "Ahmad Fauzi",
    "jk": "Pria",
    "kelas": 10,
    "kegiatan": "IT"
  },
  {
    "nama": "Siti Nurhaliza",
    "jk": "Wanita",
    "kelas": 11,
    "kegiatan": "Seni"
  },
  {
    "nama": "Budi Santoso",
    "jk": "Pria",
    "kelas": 12,
    "kegiatan": "Debat"
  },
  {
    "nama": "Dewi Lestari",
    "jk": "Wanita",
    "kelas": 10,
    "kegiatan": "IT"
  },
  {
    "nama": "Rina Wijaya",
    "jk": "Wanita",
    "kelas": 11,
    "kegiatan": "Seni"
  },
  {
    "nama": "Joko Prasetyo",
    "jk": "Pria",
    "kelas": 12,
    "kegiatan": "Robotik"
  }
];

// Variabel global untuk carousel
let currentIndex = 0;

// Fungsi untuk render carousel dengan navigasi
function renderCarousel() {
  const container = document.getElementById('carouselContainer');
  container.innerHTML = '';
  
  kegiatanData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'carousel-thumb';
    if (index === currentIndex) {
      div.classList.add('active');
    }
    div.innerHTML = `
      <img src="${item.gambar}" alt="${item.nama}" data-index="${index}">
      <div class="thumb-caption">${item.nama}</div>
    `;
    container.appendChild(div);
    
    // Event listener untuk klik gambar carousel
    div.addEventListener('click', () => {
      openCarouselImage(index);
    });
  });
}

// Fungsi untuk navigasi carousel
function setupCarouselNavigation() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + kegiatanData.length) % kegiatanData.length;
    renderCarousel();
    updateCarouselPosition();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % kegiatanData.length;
    renderCarousel();
    updateCarouselPosition();
  });
  
  // Tambahkan drag/swipe untuk mobile
  let startX = 0;
  let endX = 0;
  const carouselSection = document.querySelector('.carousel-section');
  
  carouselSection.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  carouselSection.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe kiri
        currentIndex = (currentIndex + 1) % kegiatanData.length;
      } else {
        // Swipe kanan
        currentIndex = (currentIndex - 1 + kegiatanData.length) % kegiatanData.length;
      }
      renderCarousel();
      updateCarouselPosition();
    }
  }
}

// Fungsi untuk update posisi carousel
function updateCarouselPosition() {
  const container = document.querySelector('.carousel-container');
  const thumbWidth = 120; // Sesuai dengan CSS
  const gap = 8;
  const translateX = -currentIndex * (thumbWidth + gap);
  container.style.transform = `translateX(${translateX}px)`;
}

// Fungsi untuk membuka gambar carousel di modal
function openCarouselImage(index) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  
  modalImage.src = kegiatanData[index].gambar;
  modalCaption.innerHTML = `
    <strong>${kegiatanData[index].nama}</strong><br>
    Kegiatan ekstrakurikuler siswa SMA Negeri 1 Contoh.
  `;
  modal.classList.remove('hidden');
}

// Fungsi untuk render tabel siswa
function renderSiswaTable(data = siswaData) {
  const tbody = document.querySelector('#siswaTable tbody');
  tbody.innerHTML = '';
  
  data.forEach((siswa, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${siswa.nama}</strong></td>
      <td>${siswa.jk}</td>
      <td>Kelas ${siswa.kelas}</td>
      <td><span class="badge kegiatan-${siswa.kegiatan.toLowerCase()}">${siswa.kegiatan}</span></td>
    `;
    tbody.appendChild(row);
  });
}

// Fungsi untuk toggle data siswa (JSON)
function setupDataToggle() {
  const toggleBtn = document.getElementById('toggleDataBtn');
  const dataContainer = document.getElementById('dataContainer');
  const jsonDisplay = document.getElementById('jsonDataDisplay');
  
  // Tampilkan data JSON lengkap
  jsonDisplay.textContent = JSON.stringify({ 
    siswa: siswaData,
    total: siswaData.length,
    last_update: new Date().toLocaleString()
  }, null, 2);
  
  toggleBtn.addEventListener('click', () => {
    if (dataContainer.classList.contains('hidden')) {
      dataContainer.classList.remove('hidden');
      toggleBtn.innerHTML = '<i class="fas fa-times"></i> Tutup Data JSON';
    } else {
      dataContainer.classList.add('hidden');
      toggleBtn.innerHTML = '<i class="fas fa-database"></i> Tampilkan Data JSON';
    }
  });
}

// Fungsi untuk setup modal utama
function setupModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.querySelector('.close-btn');
  
  // Klik gambar utama
  document.querySelector('.main-image img').addEventListener('click', () => {
    modalImage.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";
    modalCaption.innerHTML = `
      <strong>Ekstrakurikuler Robotik</strong><br>
      Tim robotik SMA Negeri 1 Contoh berhasil meraih juara 1 dalam kompetisi robotik nasional yang diadakan di Jakarta. Robot pemadam api yang dirancang siswa kelas 11 berhasil mengalahkan 50 tim dari seluruh Indonesia.
    `;
    modal.classList.remove('hidden');
  });
  
  // Klik tombol close
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  // Klik di luar modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// Fungsi untuk setup filter form
function setupFilterForm() {
  const form = document.getElementById('filterForm');
  const resetBtn = document.getElementById('resetFilter');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const gender = document.getElementById('jenisKelamin').value;
    const kelas = document.getElementById('kelas').value;
    const kegiatan = document.getElementById('kegiatan').value;
    
    // Filter data
    let filtered = [...siswaData];
    
    if (gender) {
      filtered = filtered.filter(s => s.jk === gender);
    }
    
    if (kelas) {
      filtered = filtered.filter(s => s.kelas === parseInt(kelas));
    }
    
    if (kegiatan) {
      filtered = filtered.filter(s => s.kegiatan.toLowerCase().includes(kegiatan.toLowerCase()));
    }
    
    // Update tabel dan JSON display
    renderSiswaTable(filtered);
    updateJsonDisplay(filtered);
  });
  
  resetBtn.addEventListener('click', () => {
    form.reset();
    renderSiswaTable(siswaData);
    updateJsonDisplay(siswaData);
  });
}

// Fungsi untuk update JSON display
function updateJsonDisplay(data) {
  const jsonDisplay = document.getElementById('jsonDataDisplay');
  jsonDisplay.textContent = JSON.stringify({ 
    siswa: data,
    total: data.length,
    filtered: true,
    last_update: new Date().toLocaleString()
  }, null, 2);
}

// Fungsi untuk setup admin login
function setupAdminLogin() {
  const adminBtn = document.getElementById('adminBtn');
  const adminBtnFooter = document.getElementById('adminBtnFooter');
  const adminModal = document.getElementById('adminModal');
  const adminCloseBtn = document.querySelector('.admin-close');
  const adminForm = document.getElementById('adminLoginForm');
  
  // Buka modal admin
  function openAdminModal() {
    adminModal.classList.remove('hidden');
  }
  
  // Tutup modal admin
  function closeAdminModal() {
    adminModal.classList.add('hidden');
  }
  
  // Event listeners
  adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAdminModal();
  });
  
  adminBtnFooter.addEventListener('click', (e) => {
    e.preventDefault();
    openAdminModal();
  });
  
  adminCloseBtn.addEventListener('click', closeAdminModal);
  
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      closeAdminModal();
    }
  });
  
  // Handle login form
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Login sederhana
    if (username === 'admin' && password === 'password123') {
      alert('Login berhasil! (Simulasi)');
      closeAdminModal();
      // Di sini bisa redirect ke halaman admin jika ada
      window.location.href = '#admin';
    } else {
      alert('Username atau password salah!');
    }
  });
}

// Initialize semua fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  console.log('XSchool App Dimuat!');
  
  renderCarousel();
  setupCarouselNavigation();
  renderSiswaTable();
  setupDataToggle();
  setupModal();
  setupFilterForm();
  setupAdminLogin();
  
  // Tambahkan efek loading
  const body = document.body;
  body.style.opacity = '0';
  body.style.transition = 'opacity 0.5s ease-in';
  
  setTimeout(() => {
    body.style.opacity = '1';
    
    // Animasi untuk carousel
    const carousel = document.querySelector('.carousel-container');
    carousel.style.transition = 'transform 0.5s ease';
    updateCarouselPosition();
  }, 100);
});