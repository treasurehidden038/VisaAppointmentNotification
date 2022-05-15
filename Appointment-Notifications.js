var lastMessage = '';
var continueReading = 0;

// TODO: You need to setup local webserver and replace below video link with it.
var videoURL = "http://127.0.0.1:8181/Sample-Video.mp4";
var song_video = 'song_video';
var songElement_video;

var divElements1 = document.getElementById("MiddleColumn");

if (typeof(divElements1) != 'undefined' && divElements1 != null) 
    divElements1.setAttribute("style", "background-color:black");

var divElements2= document.getElementById( 'middle-column-bg' );
if (typeof(divElements2) != 'undefined' && divElements2 != null) 
    divElements2.parentNode.removeChild( divElements2);

var divElements3 = document.getElementsByClassName("chat-list");
if (typeof(divElements3 ) != 'undefined' && divElements3 != null && divElements3.length > 0) 
    divElements3[0].setAttribute("style", "background-color:black");

function createVideoControl(mediaPath, mediaType, mediaId, divElement) {

    var media = document.getElementById(mediaId);

    if (typeof(media) != 'undefined' && media != null) {
        media.parentNode.removeChild(media);
    }
    
    media = document.createElement('video');
    // Set the attributes of the video
    media.id = mediaId;
    media.src      = mediaPath;
    media.controls = true;
    media.setAttribute('height', '200');
    media.setAttribute('width', '300');
    media.volume = 0.0;
    media.loop = true;
    media.load();

    divElement.appendChild(media);

    return document.getElementById(mediaId);
}

function createSongControl(mediaPath, mediaType, mediaId, divElement) {
    var media = document.getElementById(mediaId);

    if (typeof(media) != 'undefined' && media != null) {
        media.parentNode.removeChild(media);
    }
    
    media = document.createElement('audio');

    media.id       = mediaId;
    media.controls = 'controls';
    media.src      = mediaPath;
    media.type     = mediaType;
    // media.hidden = 1;
    media.volume = 0.0;

    media.loop = true;
    media.load();

    divElement.appendChild(media);

    return document.getElementById(mediaId);
}

songElement_video = createVideoControl(videoURL, 'video/mp4', song_video, divElements1);

function readMessage(message) {
  let speaknow = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.speak(speaknow);
}

function playSong(audioElement) {
    audioElement.volume = 1.0;
    audioElement.currentTime = 0;

    if (audioElement.paused)
        audioElement.play();
}

function stopSong(audioElement) {
    audioElement.volume = 0.0;
}

function readAndPlay(message, audioElement) {
    playSong(audioElement);
    setTimeout(() => {
        stopSong(audioElement);

        readMessage ("Attention!!");

        readMessage (message);
    }, 7000);
}

function myLoad() {
  var ele = document.getElementsByClassName("last-message");

  if (typeof(ele) != 'undefined' && ele != null
        && ele.length > 0) {
    
    var newMsg = ele[0].innerText;
    if (newMsg == lastMessage)
        return;
    lastMessage = newMsg;

    var parts = newMsg.split(":");
    var played = false;

    if (parts.length > 1) {
        var newPart = parts[1].toUpperCase();

        if (newPart.indexOf("AWESOMEADMIN_US") > -1) {
            newPart = "Escalated to group Admin.";
        } else {
            if (newPart.indexOf("PHOTO") > -1)
                played = checkPhoto(newPart);
            else
                played = checkText(newPart);
        }
    }

    if (played) {
        continueReading = 2;
    } else if (continueReading > 0) {
        readMessage("Negative! " + newPart);
        continueReading -= 1;
    }
  }
}

function checkPhoto(nm) {
    if (nm.indexOf("PHOTO") > -1) {
        if (nm.indexOf("NA") == -1 || nm.indexOf("NAI") == nm.indexOf("NA")) {

            readAndPlay("Photo! Photo!", songElement_video);
            return true;
        } 
    } 

    return false;
}

function checkText(nm) {
    if (nm.indexOf("APPOINTMENT") > -1 || nm.indexOf("BOOKED") > -1 || nm.indexOf("SS") > -1 || nm.indexOf("AVAILABLE") > -1 || nm.indexOf("OPEN") > -1) {
        if (nm.indexOf("SSAGE") == nm.indexOf("SS") && nm.indexOf("SS") > -1) 
            return false;
 
        if (nm.indexOf("NOT AVAI") == -1 && nm.indexOf("?") == -1) {
            if (nm.indexOf("NA") == -1 || nm.indexOf("NAI") == nm.indexOf("NA")) {
                
                readAndPlay(nm, songElement_video);
                return true;
            }
        }
    }
    return false;
}

setInterval(function() {
    myLoad();
}, 200);   // Interval set to 200ms
