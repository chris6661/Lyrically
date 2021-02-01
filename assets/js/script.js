var songSearchEl = document.querySelector("#song");
var artistSearchEl = document.querySelector("#artist");
var searchSongBtn = document.querySelector("#searchSong");
var songInfo = document.querySelector("#songInfo");
var lyricsDisplay = document.querySelector("#lyricsDisplay");
//replay previous song
var replay = document.getElementById("previousVideo");
//var video = document.querySelector("#video");

var previousSong = document.getElementById("previousSong");
var previousArtist = document.getElementById("previousArtist");

var testLyric = "";
var localSong = localStorage.getItem("song");
var localArtist = localStorage.getItem("artist");
//var song = "";
//var artist = "";
let song = previousSong.innerHTML;
let artist = previousArtist.innerHTML;
var previousSongcard = document.getElementById("previousSongcard");
// On load we want to set Previous Artist & Song if it exists in local Storage

window.addEventListener('load', (event) => {
    if (localSong && localArtist){
        previousSongcard.classList.remove('is-hidden');
        previousSong.innerHTML = localSong;
        previousArtist.innerHTML = localArtist;
    }
})

replay.addEventListener('click', (event) => {
// let song = previousSong.innerHTML;
// let artist = previousArtist.innerHTML;
    songSearch(localSong, localArtist) 
})

var formSubmitHandler = function (event) {
    event.preventDefault();
    //removes error message from page
    resetSearchError();

    //local storage for previsou song and artist
    previousSong.innerHTML = localStorage.getItem("song");
    previousArtist.innerHTML =  localStorage.getItem("artist");

    let song = songSearchEl.value.trim();
    let artist = artistSearchEl.value.trim();

    //local storage for previous song and artist
    
    localStorage.setItem("song", song);
    localStorage.setItem("artist", artist);


    if (song, artist) {
        songSearch(song, artist);
        songInfo.textContent = song.toUpperCase() + " BY " + artist.toUpperCase();
        songSearchEl.value = "";
        artistSearchEl.value = "";
    } else {
        document.getElementById('error').value = '';
        showSearchError("Please enter a song title and artist name.");
    }
}


//search error and empty searches
function resetSearchError() {
    //removes class from container using NES
    document.getElementById('error').classList.remove('nes-container');
    document.getElementById('error').textContent = '';
}

function showSearchError(message) {
    //adds class to container using NES
    document.getElementById('error').classList.add('nes-container');
    document.getElementById('error').textContent = message;
}


var songSearch = function (song, artist) {
    var apiURL = "https://api.lyrics.ovh/v1/" + artist + "/" + song;
    fetch(apiURL).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayLyrics(data);
                })
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (event) {
            alert("Unable to connect to Lyrics API");
        })


}

 

var displayLyrics = function (data) {
    if (data.lyrics.length === 0) {
        console.log("no lyrics found");
        lyricsDisplay.textContent = "No Lyrics Found";
        document.getElementById("video").src = "https://www.youtube.com/embed/";
        return;
    } else {
        lyricsDisplay.textContent = "";
        var lyricText = data.lyrics.split("\n");
        console.log(data.lyrics);
        console.log(lyricText);

        for (var i = 0; i < lyricText.length; i++) {
            lyricText[i] = lyricText[i] + "<br>";
        }
        lyricText = lyricText.join("");
        document.getElementById("lyricsDisplay").innerHTML = lyricText;

        // YOUTUBE
        var YoutubeApi = "AIzaSyDmjBtZUutKjG2725gC5lcGoV_jzDwbR7o";
        fetch("https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=" + song + " " + artist + "&type=video&videoCaption=closedCaption&key=" + YoutubeApi)

            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        //console.log(data);
                        debugger
                        var videoId = data.items[0].id.videoId;
                        document.getElementById("video").src = "https://www.youtube.com/embed/" + videoId;
                    })
                } else {
                    alert("Error: " + response.statusText);
                }
            })
    }
}


// video.addEventListener("timeupdate", function (e) {
//     syncData.forEach(function (element, index, array) {
//         if (videoPlayer.currentTime >= element.start && videoPlayer.currentTime <= element.end)
//             subtitles.children[index].style.background = 'yellow';
//     });
// });
// (window, document);


searchSongBtn.addEventListener("click", formSubmitHandler);