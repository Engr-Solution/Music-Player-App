// Declaring Variables
let classes = (classes) => {
  return document.getElementsByClassName(classes);
};
let id = (id) => {
  return document.getElementById(id);
};
// Declaring Variables
const audio = id("audio");
const seekBar = id("seek_bar");
const totalTime = id("total-time");
const disk = id("disk");
const volume = id("volume-range");
const playBtns = [...classes("playBtn")];
const prevBtns = [...classes("prev")];
const nextBtns = [...classes("next")];
const artistNames = [...classes("song-title")];
const songsTitles = [...classes("song-artist")];
const playlist = [...classes("playlist_item")];

let songIndex = 0;
let playing = false;

onload = () => {
  let playlistWrap = id('playlist_list');
  for (var i = 0; i <= songs.length - 1; i++) {
    playlistWrap.insertAdjacentHTML('beforeend', `<div class="playlist_item">
    <span class="playlist_song-info">
      <p class="playlist_song-title">${songs[i].title}</p>
      <p class="playlist_song-artist">${songs[i].artist}</p>
    </span>
    <audio src="${songs[i].src}" class="playlistAudio"></audio>
    <span class="playlist-song_duration">00:00</span>`);
  }
  // console.log(playlistWrap);
};
setTimeout(() => {
  let items = [...classes('playlist_item')];
  items.forEach((item, i) => {
    var dur = item.querySelector('.playlistAudio').duration;
    item.querySelector('.playlist-song_duration').innerText = formatTime(dur);
    // 
    item.addEventListener('click', () => {
      songIndex = i;
      setSongs(songIndex);
      setPlaylist();
      play();
    });
  })
}, 800);
// Playlist Open
id("openBtn").addEventListener("click", () => {
  id("songs_list").classList.add("open");
});

// Playlist Close
id("closeBtn").addEventListener("click", () => {
  id("songs_list").classList.remove("open");
});

// time format
const formatTime = (time) => {
  var min = Math.floor(time / 60);
  if (min < 10) min = "0" + min;
  var sec = Math.floor(time % 60);
  if (sec < 10) sec = "0" + sec;
  return `${min}:${sec}`;
};
// play() & pause()
const play = () => {
  playing = true;
  playBtns[0].querySelector("span").innerText = "pause";
  playBtns[1].querySelector("span").innerText = "pause";
  disk.style.animationPlayState = 'running';
  audio.play();
  // console.log(playing);
};
const pause = () => {
  playing = false;
  playBtns[0].querySelector("span").innerText = "play_arrow";
  playBtns[1].querySelector("span").innerText = "play_arrow";
  disk.style.animationPlayState = 'paused';
  audio.pause();
  // console.log(playing);
};
// setSongs()
const setSongs = (index) => {
  audio.src = songs[index].src;
  artistNames.forEach((elem) => (elem.innerText = songs[index].artist));
  songsTitles.forEach((elem) => (elem.innerText = songs[index].title));
  disk.style.background = `url(${songs[index].bg})`;
  audio.addEventListener("loadeddata", () => {
    let duration = formatTime(audio.duration);
    totalTime.innerText = duration;
  });
};
playBtns.forEach((elem, i) => {
  elem.addEventListener('click', () => {
    if (playing) {
      pause();
    } else {
      play();
      elem.querySelector("span").innerText = "pause";
      // console.log(playing, i)
    }
  });
});

// Generate songIndex
const generateIndex = () => {
  let getText = id("repeat").innerText;
  switch (getText) {
    case "repeat":
      songIndex++;
      songIndex = songIndex >= songs.length ? (songIndex = 0) : songIndex;
      break;
    case "repeat_one":
      songIndex;
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * songs.length);
      do {
        randIndex = Math.floor(Math.random() * songs.length);
      } while (songIndex == randIndex);
      songIndex = randIndex;
      break;
  }
  // console.log(songIndex);
  return songIndex;
};
// 
const setPlaylist = () => {
  var playlist = [...classes("playlist_item")];
  for (var i = 0; i < songs.length; i++) {
    // console.log(i);
    if (playlist[i].classList.contains("playing")) {playlist[i].classList.remove("playing")};
  }
  playlist[songIndex].classList.add("playing");
};

// Prev() & Next()
const prev = () => {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  setSongs(songIndex);
  setPlaylist();
  play();
};
const next = () => {
  songIndex = generateIndex();
  // console.log(songIndex);
  setSongs(songIndex);
  setPlaylist();
  play();
};
// Prev & Next event
prevBtns.forEach((btn) => {
  btn.addEventListener("click", prev);
});
nextBtns.forEach((btn) => {
  btn.addEventListener("click", next);
});
// Pla next song when current song ends
audio.addEventListener("ended", () => {
  next();
});
// forward the music duration by clicking the seek bar
id("progress-area").addEventListener("click", (e) => {
  let progressWidth = id("progress-area").clientWidth;
  let clickedOffsetX = e.offsetX;
  let duration = audio.duration;
  audio.currentTime = (clickedOffsetX / progressWidth) * duration;
});

//
id("volume").addEventListener("click", () => {
  volume.classList.toggle("active");
});
volume.addEventListener("input", () => {
  if(volume.value == 0) id("volume").innerHTML = 'volume_off';
    else id("volume").innerHTML = 'volume_up';
  audio.volume = volume.value;
});

//Update Current time every 500ms
setInterval(() => {
  id("current-time").innerText = formatTime(audio.currentTime);
  id("progress-bar").style.width =
    (audio.currentTime / audio.duration) * 100 + "%";
}, 500);
// loop, repeat and shuffle 
id("repeat").addEventListener("click", () => {
  let loop = id("repeat").innerText;
  switch (loop) {
    case "repeat":
      loop = "repeat_one";
      id("repeat").setAttribute("title", loop);
      id("repeat").innerText = loop;
      // console.log(loop);
      break;
    case "repeat_one":
      loop = "shuffle";
      id("repeat").setAttribute("title", loop);
      id("repeat").innerText = loop;
      // console.log(loop);
      break;
    case "shuffle":
      loop = "repeat";
      id("repeat").setAttribute("title", loop);
      id("repeat").innerText = loop;
      // console.log(loop);
      break;
  }
});

id("repeat").addEventListener("click", generateIndex);
setSongs(songIndex);
setTimeout(setPlaylist, 300);