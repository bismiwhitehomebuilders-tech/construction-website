const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const player = document.getElementById("player");

searchBtn.addEventListener("click", searchSongs);


  try {
    // 🔥 Use YouTube search API (no key method)
    const res = await fetch(`https://ytsearch.g3d.xyz/api/search?q=${query}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("No video found");
      return;
    }

function playFull(title, artist) {
  const query = encodeURIComponent(title + " " + artist);

  player.innerHTML = `
    <div style="position:fixed;bottom:0;width:100%;background:#000;">
      <iframe 
        width="100%" 
        height="200" 
        src="https://www.youtube.com/embed?listType=search&list=${query}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>
    </div>
  `;
}
  } catch (err) {
    console.log(err);
    alert("❌ Failed to load full song");
  }
}

    results.appendChild(card);
  });
}

// ✅ 30 sec preview
function playPreview(preview, title, artist) {
  player.innerHTML = `
    <div style="position:fixed;bottom:0;width:100%;background:#111;padding:10px;">
      <b>${title} - ${artist}</b><br>
      <audio controls autoplay src="${preview}" style="width:100%"></audio>
    </div>
  `;
}

// 🔥 FULL SONG (INSIDE APP via YouTube embed)
function playFull(title, artist) {
  const query = encodeURIComponent(title + " " + artist);

  player.innerHTML = `
    <div style="position:fixed;bottom:0;width:100%;background:#000;">
      <iframe 
        width="100%" 
        height="200" 
        src="https://www.youtube.com/embed?listType=search&list=${query}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>
    </div>
  `;
}
