# web-iPod
An iPod-style web music player with LRC file and playlist support.  
I'm currently a student so it is not perfect but it's a little project I wanted to make.

### Controls
* **MENU**: Opens the playlist screen to see and select songs.
* **Central button**: Toggles between the Lyrics view and Song Info.
* **Next**: Skips to the next track.
* **Previous**: Restarts the current song (**if played for >3s**) or goes to the previous track.
* **Play/Pause**: Plays or pauses the current song.

### How to use
* LRC files: Place them in the `src/lrc/` directory.
* Album covers: Place them in the `src/img/` directory.
* Song Data: All song information is defined at the beginning of script.js. I recommend hosting the audio files externally rather than storing them in the project folder.
* HTML Setup: For each song, you must create a `playlist-item` container inside the `playlist-view` container to ensure they display correctly.

## Credits
* **[Lyric-Synchronizer](https://dev.to/mcanam/javascript-lyric-synchronizer-4i15)** by **mcanam** — Used for handling synchronized lyric playback.
* Also check out the **[Liricle](https://github.com/mcanam/liricle)** library by the same author, which is based on this logic.
