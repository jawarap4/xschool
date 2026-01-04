// ===========================================
// XSchool - Simple App
// ===========================================

// Data carousel dari data.json
const kegiatanData = [
  {
    "gambar": "https://ik.imagekit.io/abeS3/Logo%20Baru.jpg?updatedAt=1766926056006?updatedAt=1766945627219",
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
    "nama": "A. Muhtar",
    "jk": "Pria",
    "kelas": 11,
    "kegiatan": "Seni"
  },
];

// Variabel global untuk carousel
let currentIndex = 0;

// ===========================================
// 1. FUNGSI AUTO-OPEN MODAL ADMIN
// ===========================================
function checkAndOpenAdminModal() {
    const adminModal = document.getElementById('adminModal');
    if (!adminModal) return;
    
    // Cek jika URL mengandung ?admin=login
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'login') {
        console.log('🔓 Auto-opening admin login modal...');
        adminModal.classList.remove('hidden');
    }
}

// ===========================================
// 2. FUNGSI UTILITAS
// ===========================================
window.openAdminModal = function() {
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        adminModal.classList.remove('hidden');
        console.log('✅ Admin modal opened');
    }
};

window.closeAdminModal = function() {
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        adminModal.classList.add('hidden');
        console.log('✅ Admin modal closed');
    }
};

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===========================================
// 3. FUNGSI SETUP ADMIN LOGIN (DIPERBARUI)
// ===========================================
function setupAdminLogin() {
    const adminBtn = document.getElementById('adminBtn');
    const adminBtnFooter = document.getElementById('adminBtnFooter');
    const adminModal = document.getElementById('adminModal');
    const adminForm = document.getElementById('adminLoginForm');
    
    if (!adminModal) {
        console.log('❌ Admin modal element not found');
        return;
    }
    
    console.log('🔑 Setting up admin login...');
    
    // Fungsi buka modal
    function openModal() {
        adminModal.classList.remove('hidden');
    }
    
    // Fungsi tutup modal
    function closeModal() {
        adminModal.classList.add('hidden');
    }
    
    // Event listeners untuk tombol admin
    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
    
    if (adminBtnFooter) {
        adminBtnFooter.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
    
    // Handle login form
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername')?.value;
            const password = document.getElementById('adminPassword')?.value;
            
            console.log('Login attempt:', username);
            
            // Login sederhana
            if (username === 'admin' && password === 'password123') {
                console.log('✅ Login successful!');
                
                // Simpan status login dengan timestamp
                const loginData = {
                    status: 'logged_in',
                    timestamp: new Date().toISOString(),
                    username: username
                };
                
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminLoginData', JSON.stringify(loginData));
                localStorage.setItem('adminUser', username);
                
                // Tutup modal
                closeModal();
                
                // Tampilkan notifikasi
                showNotification('✅ Login berhasil! Mengarahkan ke Admin Panel...', 'success');
                
                // Redirect ke admin panel setelah 1.5 detik
                setTimeout(() => {
                    window.location.href = 'admin/index.html';
                }, 1500);
            } else {
                console.log('❌ Login failed');
                showNotification('❌ Username atau password salah! Coba: admin / password123', 'error');
            }
        });
    }
    
    // Close modal dengan X button
    const closeBtn = adminModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal klik di luar
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            closeModal();
        }
    });
    
    // Esc key untuk close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !adminModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ===========================================
// 4. FUNGSI CAROUSEL
// ===========================================
function renderCarousel() {
  const container = document.getElementById('carouselContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  kegiatanData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'carousel-thumb';
    if (index === currentIndex) {
      div.classList.add('active');
    }
    div.innerHTML = `
      <img src="${item.gambar}" alt="${item.nama}" data-index="${index}" loading="lazy">
      <div class="thumb-caption">${item.nama}</div>
    `;
    container.appendChild(div);
    
    // Event listener untuk klik gambar carousel
    div.addEventListener('click', () => {
      openCarouselImage(index);
    });
  });
}

function setupCarouselNavigation() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (!prevBtn || !nextBtn) return;
  
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
  
  if (carouselSection) {
    carouselSection.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    carouselSection.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });
  }
  
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

function updateCarouselPosition() {
  const container = document.querySelector('.carousel-container');
  if (!container) return;
  
  const thumbWidth = 120; // Sesuai dengan CSS
  const gap = 8;
  const translateX = -currentIndex * (thumbWidth + gap);
  container.style.transform = `translateX(${translateX}px)`;
}

function openCarouselImage(index) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  
  if (!modal || !modalImage || !modalCaption) return;
  
  modalImage.src = kegiatanData[index].gambar;
  modalCaption.innerHTML = `
    <strong>${kegiatanData[index].nama}</strong><br>
    Kegiatan ekstrakurikuler siswa SMA Negeri 1 Contoh.
  `;
  modal.classList.remove('hidden');
}

// ===========================================
// 5. FUNGSI SISWA & TABEL
// ===========================================
function renderSiswaTable(data = siswaData) {
  const tbody = document.querySelector('#siswaTable tbody');
  if (!tbody) return;
  
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

// ===========================================
// 6. FUNGSI DATA TOGGLE
// ===========================================
function setupDataToggle() {
  const toggleBtn = document.getElementById('toggleDataBtn');
  const dataContainer = document.getElementById('dataContainer');
  const jsonDisplay = document.getElementById('jsonDataDisplay');
  
  if (!toggleBtn || !dataContainer || !jsonDisplay) return;
  
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

// ===========================================
// 7. FUNGSI MODAL UTAMA
// ===========================================
function setupModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.querySelector('.close-btn');
  const mainImage = document.querySelector('.main-image img');
  
  if (!modal || !modalImage || !modalCaption || !closeBtn || !mainImage) return;
  
  // Klik gambar utama
  mainImage.addEventListener('click', () => {
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

// ===========================================
// 8. FUNGSI FILTER FORM
// ===========================================
function setupFilterForm() {
  const form = document.getElementById('filterForm');
  const resetBtn = document.getElementById('resetFilter');
  
  if (!form || !resetBtn) return;
  
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

function updateJsonDisplay(data) {
  const jsonDisplay = document.getElementById('jsonDataDisplay');
  if (!jsonDisplay) return;
  
  jsonDisplay.textContent = JSON.stringify({ 
    siswa: data,
    total: data.length,
    filtered: true,
    last_update: new Date().toLocaleString()
  }, null, 2);
}

// ===========================================
// 9. FUNGSI UTAMA - INITIALIZE
// ===========================================
function initializeApp() {
  console.log('🚀 XSchool App Initializing...');
  
  // Tambahkan animasi CSS untuk notifikasi
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Setup semua fungsi
  renderCarousel();
  setupCarouselNavigation();
  renderSiswaTable();
  setupDataToggle();
  setupModal();
  setupFilterForm();
  setupAdminLogin();
  checkAndOpenAdminModal();
  
  // Efek loading
  const body = document.body;
  body.style.opacity = '0';
  body.style.transition = 'opacity 0.5s ease-in';
  
  setTimeout(() => {
    body.style.opacity = '1';
    
    // Animasi untuk carousel
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
      carousel.style.transition = 'transform 0.5s ease';
      updateCarouselPosition();
    }
  }, 100);
  
  console.log('✅ XSchool App Initialized Successfully!');
}

// ===========================================
// 10. EVENT LISTENER UNTUK MEMUAT APLIKASI
// ===========================================

document.addEventListener('DOMContentLoaded', initializeApp);
});

// Fungsi global untuk debugging
window.debugAdmin = function() {
  console.log('=== DEBUG ADMIN ===');
  console.log('localStorage adminLoggedIn:', localStorage.getItem('adminLoggedIn'));
  console.log('localStorage adminUser:', localStorage.getItem('adminUser'));
  console.log('URL Params:', new URLSearchParams(window.location.search).toString());
  
  // Test login
  localStorage.setItem('adminLoggedIn', 'true');
  localStorage.setItem('adminUser', 'admin');
  console.log('✅ Debug: Admin login set');
  
  showNotification('Debug: Admin login set. Redirecting...', 'success');
  
  setTimeout(() => {
    window.location.href = 'admin/index.html';
  }, 1000);
  
  )};
}
  
// =====================================================================
//--- FUNGSI HAPUS ---
// =====================================================================
  
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
