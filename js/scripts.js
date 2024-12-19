// Import Firestore dari firebase.js
import { db } from './firebase.js'; // Mengimpor konfigurasi Firebase
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // Metode Firestore

// Fungsi untuk menambah data pemain ke Firestore
const addPlayerData = async (player) => {
  try {
    await addDoc(collection(db, "players"), player);
    console.log(`Data pemain "${player.name}" berhasil ditambahkan.`);
  } catch (error) {
    console.error("Gagal menambahkan data pemain:", error);
  }
};

// Inisialisasi data tugas statis
const staticTasks = [
  { img: "assets/icon/projectmanagement.png", title: "Project Management", link: "https://hariyanto89.github.io/Quest.ID/tasks/ProjectManagement.html" },
  { img: "assets/icon/gamechapter2.jpg", title: "Gelombang Aset Tani", link: "game2.html" },
  { img: "assets/icon/gamechapter3.jpg", title: "Menghias Aset Tani", link: "game3.html" },
  { img: "assets/badges/merigi_badge4.png", title: "Judul Tugas 4", link: "game4.html" },
  { img: "assets/badges/merigi_badge5.png", title: "Judul Tugas 5", link: "game5.html" },
  { img: "assets/badges/merigi_badge6.png", title: "Judul Tugas 6", link: "game6.html" },
  { img: "assets/badges/merigi_badge7.png", title: "Judul Tugas 7", link: "game7.html" },
];

// Event DOMContentLoaded untuk menjalankan kode setelah halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.card-container'); // Kontainer kartu tugas
  const prevBtn = document.getElementById('prev-btn'); // Tombol halaman sebelumnya
  const nextBtn = document.getElementById('next-btn'); // Tombol halaman berikutnya
  const cardsPerPage = 8; // Jumlah kartu per halaman
  let currentPage = 0; // Halaman saat ini dimulai dari 0

  // Fungsi untuk merender kartu tugas
  const renderCards = () => {
    container.innerHTML = ''; // Bersihkan kartu sebelumnya
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    const visibleTasks = staticTasks.slice(start, end);

    visibleTasks.forEach((task) => {
      const card = document.createElement('div');
      card.className = 'card game-card';
      card.innerHTML = `
        <img src="${task.img}" alt="Badge">
        <h3>${task.title}</h3>
        <a href="${task.link}" class="read-btn">Pelajari</a>
      `;
      container.appendChild(card);
    });

    // Perbarui status tombol pagination
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= Math.ceil(staticTasks.length / cardsPerPage) - 1;
  };

  // Event untuk tombol halaman sebelumnya
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderCards();
    }
  });

  // Event untuk tombol halaman berikutnya
  nextBtn.addEventListener('click', () => {
    if (currentPage < Math.ceil(staticTasks.length / cardsPerPage) - 1) {
      currentPage++;
      renderCards();
    }
  });

  // Render awal kartu tugas
  renderCards();

  // Simpan data pemain contoh ke Firebase (contoh statis, bisa disesuaikan dengan input pengguna)
  const samplePlayer = {
    id: "12345",
    name: "Pemain 1",
    level: 10,
    xp: 2500,
    tokens: 100,
    lives: 3,
    badges: ["badge1", "badge2"],
    certificates: ["cert1"],
    history: ["game1", "game2"]
  };

  // Tambahkan data pemain ke Firebase
  addPlayerData(samplePlayer);
});

document.getElementById('submit-answers').addEventListener('click', async () => {
  const answers = [...document.querySelectorAll('.question input')].map(input => input.value);
  const taskId = 'task1'; // Sesuaikan ID tugas
  const playerId = 'player123'; // ID pemain dari sesi
  
  try {
    await addDoc(collection(db, 'task_results'), {
      playerId,
      taskId,
      answers,
      timestamp: new Date(),
    });
    alert('Jawaban disimpan. Lanjutkan ke tugas berikutnya.');
    window.location.href = 'task2.html'; // Navigasi ke tugas berikutnya
  } catch (error) {
    console.error('Gagal menyimpan jawaban:', error);
  }
});

// task1.json
{
  "answers": ["jawaban1", "jawaban2"]
}

const validateAnswers = async () => {
  const response = await fetch('task1.json');
  const data = await response.json();
  const correctAnswers = data.answers;
  const userAnswers = [...document.querySelectorAll('.question input')].map(input => input.value);

  return correctAnswers.every((answer, index) => answer === userAnswers[index]);
};

document.getElementById('submit-answers').addEventListener('click', async () => {
  if (await validateAnswers()) {
    alert('Semua jawaban benar! Lanjutkan ke tugas berikutnya.');
    window.location.href = 'task2.html';
  } else {
    alert('Jawaban Anda belum benar. Coba lagi.');
  }
});
