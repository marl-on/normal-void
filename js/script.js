!(async function main() {
  "use strict";

  const dom = {
    lyric: document.querySelector(".lyric"),
    player: document.querySelector(".player"),
    albumImg: document.querySelector(".album-img"),
    songTitle: document.querySelector(".song-title"),
    songArtist: document.querySelector(".song-artist"),
    lyricView: document.querySelector(".lyric-view"),
    albumView: document.querySelector(".album-view"),
    playlistView: document.querySelector(".playlist-view"),
  };

  // HERE GOES ALL THE SONGS
  const playlist = [
    {
      title: "Buen día",
      artist: "PXNDX",
      audio: "https://www.dropbox.com/scl/fi/2ofsnzjk4d0tgbm32wurp/Buen-Dia.mp3?rlkey=njbg7aw2h93or3nbbbp6o8dz5&st=a7mcxp04&dl=1",
      lrc: "src/lrc/Buen-Dia.lrc",
      cover: "src/img/ArrozConLeche.jpg",
    },
    /*{
      title: "...",
      artist: "...",
      audio: "...",
      lrc: "...",
      cover: "...",
    },
    {
      ...
    },*/
  ];

  let currentSongIndex = 0;
  let currentLyrics = [];
  let currentView = "playlist"; // VIEWS: "PLAYLIST", "ALBUM", "LYRIC"
  let previousView = "album"; // TO STORE THE LAST VIEW WHEN OPENING THE PLAYLIST VIEW

  // LOAD INITIAL SONG
  await loadSong(currentSongIndex);

  // START ON PLAYLIST VIEW
  showView("playlist");

  // UPDATE SYNCED LYRIC
  dom.player.ontimeupdate = () => {
    if (currentView !== "lyric") return; // JUST UPDATE WHEN LYRIC VIEW IS ACTIVE

    const time = dom.player.currentTime;
    const index = syncLyric(currentLyrics, time);

    if (index == null) return;

    // LYRICS APPEAR WORD BY WORD
    animateWords(currentLyrics[index].text);
  };

  // ONCE FINISHED GO TO NEXT SONG
  dom.player.onended = () => {
    nextSong();
  };

  // METHOD: LOAD SONG
  async function loadSong(index) {
    const song = playlist[index];

    // UPDATE SONG INFO
    dom.songTitle.textContent = song.title;
    dom.songArtist.textContent = song.artist;
    dom.albumImg.src = song.cover;

    // LOAD AUDIO
    dom.player.src = song.audio;

    // LOAD LYRICS
    try {
      const res = await fetch(song.lrc);
      const lrc = await res.text();
      currentLyrics = parseLyric(lrc);
      dom.lyric.innerHTML = ""; // Limpiar letra anterior
    } catch (error) {
      console.error("Error cargando letra:", error);
      currentLyrics = [];
      dom.lyric.innerHTML = "♪ ♫ ♪";
    }
  }

  // METHOD: NEXT SONG
  async function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    await loadSong(currentSongIndex);
    dom.player.play();
  }

  // METHOD: PREVIOUS SONG
  async function prevSong() {
    currentSongIndex =
      (currentSongIndex - 1 + playlist.length) % playlist.length;
    await loadSong(currentSongIndex);
    dom.player.play();
  }

  function showView(view) {
    currentView = view;

    // HIDE ALL VIEWS
    dom.playlistView.style.setProperty("display", "none", "important");
    dom.albumView.style.setProperty("display", "none", "important");
    dom.lyricView.style.setProperty("display", "none", "important");

    // SHOW THE REQUESTED VIEW
    if (view == "playlist") {
      dom.playlistView.style.setProperty("display", "flex", "important");
    } else if (view == "album") {
      dom.albumView.style.setProperty("display", "flex", "important");
    } else if (view == "lyric") {
      dom.lyricView.style.setProperty("display", "flex", "important");
    }
  }

  // CONTROL BUTTONS
  const btnPlay = document.querySelector(".play-btn");
  const btnPrev = document.querySelector(".prev-btn");
  const btnNext = document.querySelector(".next-btn");
  const btnCenter = document.querySelector(".center");
  const btnMenu = document.querySelector(".menu-btn");

  btnPlay.onclick = () => {
    if (dom.player.paused) {
      dom.player.play();
    } else {
      dom.player.pause();
    }
  };

  btnPrev.onclick = async () => {
    // IF UNDER THE FIRST 3 SECONDS, GO TO PREVIOUS SONG
    if (dom.player.currentTime < 3) {
      await prevSong();
    } else {
      // IF NOT, RESTARTS CURRENT SONG
      dom.player.currentTime = 0;
      dom.player.play();
    }
  };

  btnNext.onclick = async () => {
    await nextSong();
  };

  // CENTRAL BUTTON: CHANGES VIEW BETWEEN LYRICS VIEW AND SONG INFO
  btnCenter.onclick = () => {
    if (currentView == "playlist") {
      // IF ON PLAYLIST VIEW, CHANGES TO SONG INFO
      showView("album");
      previousView = "album";
    } else if (currentView == "album") {
      // IF ON SONG INFO, CHANGES TO LYRIC VIEW
      showView("lyric");
      previousView = "lyric";
    } else if (currentView == "lyric") {
      // IF ON LYRIC VIEW, CHANGES TO SONG INFO
      showView("album");
      previousView = "album";
    }
  };

  // MENU BUTTON: TOGGLE PLAYLIST VIEW
  btnMenu.onclick = () => {
    if (currentView === "playlist") {
      // WHEN ON PLAYLIST VIEW, GO TO THE PREVIOUS VIEW
      showView(previousView);
    } else {
      // WHEN ON SONG INFO OR LYRIC VIEW, SAVES CURRENT VIEW THEN CHANGE TO PLAYLIST VIEW
      previousView = currentView;
      showView("playlist");
    }
  };

  // SELECT SONG FROM THE PLAYLIST VIEW
  const song_0 = document.querySelector(".song-0");
  /*const song_1 = document.querySelector(".song-1");*/


  song_0.onclick = async () => {
    currentSongIndex = 0;
    await loadSong(currentSongIndex);
    previousView = "lyric";
    dom.player.play();
    showView("album");
  };

  /*song_1.onclick = async () => {
    currentSongIndex = 1;
    await loadSong(currentSongIndex);
    showView("album");
    previousView = "lyric";
    dom.player.play();
  };*/

  // METHOD: ANIMATE LYRICS WORD BY WORD
  let currentAnimationText = "";

  function animateWords(text) {
    // IF THE SAME LYRICS, DON'T ANIMATE AGAIN
    if (currentAnimationText === text) return;
    currentAnimationText = text;

    // CLEN CONTENT
    dom.lyric.innerHTML = "";

    // SEPARATE INTO WORDS
    const words = text.split(" ");

    // ANIMATE EACH WORD
    words.forEach((word, i) => {
      setTimeout(() => {
        if (i > 0) dom.lyric.innerHTML += " ";
        dom.lyric.innerHTML += word;
      }, i * 300); // 300ms BETWEEN WORDS
    });
  }
})();

/**
 * Lyric Synchronizer Module
 * Original Author: mcanam
 * Source: https://dev.to/mcanam/javascript-lyric-synchronizer-4i15
 */

// lrc (String) - lrc file text
function parseLyric(lrc) {
  const regex = /^\[(?<time>\d{2}:\d{2}(.\d{2})?)\](?<text>.*)/;
  const lines = lrc.split("\n");
  const output = [];

  lines.forEach((line) => {
    const matches = line.match(regex);
    if (matches == null) return;

    const { time, text } = matches.groups;

    output.push({
      time: parseTime(time),
      text: text.trim(),
    });
  });

  function parseTime(time) {
    const minsec = time.split(":");
    const min = parseInt(minsec[0]) * 60;
    const sec = parseFloat(minsec[1]);
    return min + sec;
  }

  return output;
}

// lyrics (Array) - output from parseLyric function
// time (Number) - current time from audio player
function syncLyric(lyrics, time) {
  const scores = [];

  lyrics.forEach((lyric) => {
    const score = time - lyric.time;
    if (score >= 0) scores.push(score);
  });

  if (scores.length == 0) return null;

  const closest = Math.min(...scores);
  return scores.indexOf(closest);
}
