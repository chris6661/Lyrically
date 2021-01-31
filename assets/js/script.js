var songSearchEl = document.querySelector("#song");
var artistSearchEl = document.querySelector("#artist");
var searchSongBtn = document.querySelector("#searchSong");
var songInfo = document.querySelector("#songInfo");
var lyricsDisplay = document.querySelector("#lyricsDisplay");
var searchContainer = document.querySelector("#searchHistory");
var showHistoryBtn = document.querySelector("#showHistory");
var historyLog = [];
var conditional = "";
var song = "";
var artist = "";
var testLyric = "";
var counter = 1;

if (localStorage.getItem("lyrics") != null) {
    document.getElementById("lyricsDisplay").innerHTML = localStorage.getItem("lyrics");
    document.getElementById("video").src = localStorage.getItem("video");
    songInfo.textContent = localStorage.getItem("songInfo");
}

var formSubmitHandler = function (event) {  
    event.preventDefault();
    resetSearchError();

    song = songSearchEl.value.trim();
    artist = artistSearchEl.value.trim();

    if (song, artist) {
        songSearch(song, artist);
        songSearchEl.value = "";
        artistSearchEl.value = "";
    } else {
        document.getElementById("error").value = "";
        showSearchError("Please enter a song title and artist name!");
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
                songInfo.textContent = song.toUpperCase() + " BY " + artist.toUpperCase();
                localStorage.setItem("songInfo", song.toUpperCase() + " BY " + artist.toUpperCase()); 
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
                    var videoId = data.items[0].id.videoId;
                    document.getElementById("video").src = "https://www.youtube.com/embed/" + videoId;
                    localStorage.setItem("video", "https://www.youtube.com/embed/" + videoId);
                    searchHistoy();
                })
            } else {
                alert("Error: " + response.statusText);
            }
        })
    }
}

// Creates search history log
var searchHistoy = function(){
    // Determining if previous search is already in the history log
    if (historyLog.includes(localStorage.getItem("songInfo"))){
        conditional = "yes";
    } else {
        conditional = "no"
        historyLog.push(localStorage.getItem("songInfo"));
    }
    
    // If previous search is not in the history log, create new entry
    if (historyLog.length === 0 || conditional === "no"){
        var historyField = document.createElement("div");
        historyField.className = "historyField field has-addons";
        historyField.style.height = "41px";
        historyField.style.maxWidth = "inherit";
        var historySongField = document.createElement("p");
        historySongField.className = "control";
        var historySongBtn = document.createElement("a");
        historySongBtn.className = "historyBtn button is-primary is-outlined";
        historySongBtn.textContent = localStorage.getItem("songInfo");
        historySongField.appendChild(historySongBtn);
        var deleteField = document.createElement("p");
        deleteField.className = "control";
        var deleteBtn = document.createElement("a");
        deleteBtn.className = "deleteBtn button is-danger is-outlined";
        deleteBtn.textContent = "X";
        deleteField.appendChild(deleteBtn);
        historyField.appendChild(historySongField);
        historyField.appendChild(deleteField);
        searchContainer.appendChild(historyField);
    } 
}

// If a song in search history is clicked reload that song
$("#searchHistory").on("click", ".historyBtn", function(){
    var split = this.textContent.split(" BY ");
    song = split[0].trim();
    artist = split[1].trim();
    songSearch(song, artist);
})

// Removes a previous search from search history when delete button clicked
$("#searchHistory").on("click", ".deleteBtn", function(){
    $(this).closest(".historyField").remove();
})

// Hides or shows search history
$("#showHistory").click(function(){
    var $this = $(this);
    if ($this.text() === "Show Search History"){
        $this.text("Hide Search History");
        $("#searchHistory").show();
        
    } else {
        $this.text("Show Search History");
        $("#searchHistory").hide();
    }
});

// when search button is clicked
searchSongBtn.addEventListener("click", formSubmitHandler);