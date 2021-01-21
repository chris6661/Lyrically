// when i type in an song/artists name in the search BarProp, the music plays in the spotify side and the lyrics are displayed in the box next to it and they play at the same time

// --functions you will need!!!--
// --search bar takes text input and pulls song/artist from spotify
// --song plays when play button is clicked, paused when pause button is clicked
// --scrub function for when songs are playing
// --error for search box if empty entry 
// --local storage for people who search for things
// --api to pull info from spotify
// --albun/song cover from spotify to fill box //spotify logo based off time constraints

const pressed = [];
const secretCode = 'coding';

window.addEventListener('keyup', (e) => {
    console.log(e.key);
    pressed.push(e.key);
    pressed.splice(-secretCode.length-1, pressed.length - secretCode.length);
    if (pressed.join('').includes(secretCode)) {
      console.log('DING DING!');
      cornify_add(); //adds unicorns at random lolololol
    }
    console.log(pressed);
  }); 