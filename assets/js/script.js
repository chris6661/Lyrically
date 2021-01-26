var songSearchEl = document.querySelector("#song");
var artistSearchEl = document.querySelector("#artist");
var searchSongBtn = document.querySelector("#searchSong");
var songInfo = document.querySelector("#songInfo");
var lyricsDisplay = document.querySelector("#lyricsDisplay");
var song = "";
var artist = "";
var testLyric = "";

if (localStorage.getItem("lyrics") != null) {
    document.getElementById("lyricsDisplay").innerHTML = localStorage.getItem("lyrics");
    document.getElementById("video").src = localStorage.getItem("video");
    songInfo.textContent = localStorage.getItem("songInfo");
}

var formSubmitHandler = function (event) {  
    event.preventDefault();

    song = songSearchEl.value.trim();
    artist = artistSearchEl.value.trim();

    if (song, artist) {
        songSearch(song, artist);
        songInfo.textContent = song.toUpperCase() + " BY " + artist.toUpperCase();
        localStorage.setItem("songInfo", song.toUpperCase() + " BY " + artist.toUpperCase());
        songSearchEl.value = "";
        artistSearchEl.value = "";
    } else {
        alert("Please Enter A Song Title And Artist Name");
    }
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
        
        for (var i =0; i < lyricText.length; i++) {
            lyricText[i] = lyricText[i] + "<br>";
        }
        lyricText = lyricText.join("");
        localStorage.setItem("lyrics", lyricText);
        document.getElementById("lyricsDisplay").innerHTML = lyricText;

        // YOUTUBE
        var YoutubeApi = "AIzaSyDmjBtZUutKjG2725gC5lcGoV_jzDwbR7o";
        fetch("https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=" + song + " " + artist + "&type=video&videoCaption=closedCaption&key=" + YoutubeApi)

        .then(function (response) {  
            if (response.ok) {
                response.json().then(function (data) {  
                    //console.log(data);
                    var videoId = data.items[0].id.videoId;
                    document.getElementById("video").src = "https://www.youtube.com/embed/" + videoId;
                    localStorage.setItem("video", "https://www.youtube.com/embed/" + videoId);
                })
            } else {
                alert("Error: " + response.statusText);
            }
        })
    }
}

searchSongBtn.addEventListener("click", formSubmitHandler);