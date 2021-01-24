var songSearchEl = document.querySelector("#song");
var artistSearchEl = document.querySelector("#artist");
var searchSongBtn = document.querySelector("#searchSong");
var songInfo = document.querySelector("#songInfo");
var lyricsDisplay = document.querySelector("#lyricsDisplay");
var song = "";
var artist = "";

var formSubmitHandler = function (event) {  
    event.preventDefault();

    var song = songSearchEl.value.trim();
    var artist = artistSearchEl.value.trim();

    if (song, artist) {
        songSearch(song, artist);
        songInfo.textContent = song + " by " + artist;
        songSearchEl.value = "";
        artistSearchEl.value = "";
    } else {
        alert("Please Enter A Song Title And Artist Name");
    }
    console.log(song);
    console.log(artist);
}

var songSearch = function (song, artist) { 
    console.log(song, artist);
    var apiURL = "https://api.lyrics.ovh/v1/" + artist + "/" + song;
    console.log(apiURL);
    fetch(apiURL).then(function (response) {  
        if (response.ok) {
            response.json().then(function (data) {  
                console.log(data.lyrics);
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
        return;
    }
    lyricsDisplay.textContent = "";
    lyricsDisplay.textContent = data.lyrics;
}


searchSongBtn.addEventListener("click", formSubmitHandler);
