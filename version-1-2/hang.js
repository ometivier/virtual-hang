/*
 * Virtual Hang
 * Author: Obadiah Metivier
 * Author URI: http://middleearmedia.com/
 * Description: Virtual Instrument based on Hang.
 * Version: 1.2
 */

// Create variables for D Hijaz kar Hang and assign audio files to them  
// Sound Bank Descending
var pad1 = new audioAlternatingKey("pad1","assets/sounds/hang/i_hang_d5.wav");
var pad2 = new audioAlternatingKey("pad2","assets/sounds/hang/h_hang_csharp5.wav");
var pad3 = new audioAlternatingKey("pad3","assets/sounds/hang/g_hang_bflat4.wav");
var pad4 = new audioAlternatingKey("pad4","assets/sounds/hang/f_hang_a4.wav");
var pad5 = new audioAlternatingKey("pad5","assets/sounds/hang/e_hang_g4.wav");
var pad6 = new audioAlternatingKey("pad6","assets/sounds/hang/d_hang_fsharp4.wav");
var pad7 = new audioAlternatingKey("pad7","assets/sounds/hang/c_hang_eflat4.wav");
var pad8 = new audioAlternatingKey("pad8","assets/sounds/hang/b_hang_d4.wav");
var pad9 = new audioAlternatingKey("pad9","assets/sounds/hang/a_hang_a3.wav");

var context; // Create Smart Audio Container
if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    context = new webkitAudioContext();
} else {
    throw new Error('AudioContext not supported. :(');
}
  
    sourceGainNode = context.createGain(); // Create source gain control. Renamed createGain from createGainNode
    lowPassFilter = context.createBiquadFilter(); // Create low pass filter
    highPassFilter = context.createBiquadFilter(); // Create high pass filter
	compressorPost = context.createDynamicsCompressor(); // Create post filter compressor
    masterGainNode = context.createGain(); // Create master gain control. Renamed createGain from createGainNode
	pannerNode = context.createPanner(); // Create panner
	 
 function audioAlternatingKey(domNode,fileDirectory) {
    this.domNode = domNode;
    this.fileDirectory = fileDirectory;
    var playAudioFile = playAudioFile;
    var incomingBuffer;
    var savedBuffer;
    var xhr;
       playAudioFile = function () {
       var source = context.createBufferSource();
       source.buffer = savedBuffer;
       source.connect(sourceGainNode);
       source.start(0); // Play sound immediately. Renamed source.start from source.noteOn
       };
    var xhr = new XMLHttpRequest();
    xhr.open('get',fileDirectory, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
    context.decodeAudioData(xhr.response,
       function(incomingBuffer) {
       savedBuffer = incomingBuffer; // Save the buffer, we'll reuse it
	   // Once the file is loaded, listen for click on div
	   // Use playAudioFile since it no longer requires a buffer to be passed to it
       var note = document.getElementById(domNode);
       note.addEventListener("mouseover", playAudioFile , false);
         }
      );
   };
 xhr.send();
 };
 	
// sourceGainNode settings
sourceGainNode.connect(lowPassFilter);
sourceGainNode.connect(highPassFilter);
 	
// lowPassFilter settings
lowPassFilter.type = "lowpass"; // (Low-pass) Value renamed "lowpass" from 0
lowPassFilter.frequency.value = 110; // Cut off frequencies above 110 Hz
document.getElementById('filter-1').addEventListener('change', function() {
    lowPassFilter.frequency.value = this.value;
});
lowPassFilter.Q.value = 5; // This is actually resonance in dB
document.getElementById('quality-1').addEventListener('change', function() {
    lowPassFilter.Q.value = this.value;
});
lowPassFilter.connect(compressorPost);

// highPassFilter settings
highPassFilter.type = "highpass"; // (High-pass) Value renamed "highpass" from 1
highPassFilter.frequency.value = 880; // Cut off frequencies below 880 Hz
document.getElementById('filter-2').addEventListener('change', function() {
    highPassFilter.frequency.value = this.value;
});
highPassFilter.Q.value = 5; // This is actually resonance in dB
document.getElementById('quality-2').addEventListener('change', function() {
    highPassFilter.Q.value = this.value;
});
highPassFilter.connect(compressorPost);

// compressorPost settings
compressorPost.connect(masterGainNode);

// masterGainNode settings
masterGainNode.gain.value = 0.5; // Initial volume is 50%
document.getElementById('volume-1').addEventListener('change', function() {
    masterGainNode.gain.value = this.value;
});
masterGainNode.connect(pannerNode);

// pannerNode settings
function pan(range) {
  var xDeg = parseInt(range.value);
  var zDeg = xDeg + 90;
  if (zDeg > 90) {
    zDeg = 180 - zDeg;
  }
  var x = Math.sin(xDeg * (Math.PI / 180));
  var z = Math.sin(zDeg * (Math.PI / 180));
  pannerNode.setPosition(x, 0, z);
}
pannerNode.connect(context.destination);

// Shortcut Keys for Volume are 1, 2, 3
function volumeLow() {
	masterGainNode.gain.value = 0.2;
}
function volumeDefault() {
	masterGainNode.gain.value = 0.5;
}
function volumeHigh() {
	masterGainNode.gain.value = 0.8;
}

// Shortcut Keys for Pan are 4, 5, 6
function panLeft() {
	pannerNode.setPosition(-1, 0, 0);
}
function panDefault() {
	pannerNode.setPosition(0, 0, 0);
}
function panRight() {
	pannerNode.setPosition(1, 0, 0);
}

// Shortcut Keys for Lowpass Freq are Q, W, E
function lowPassFreqLow() {
	lowPassFilter.frequency.value = 10;
}
function lowPassFreqDefault() {
	lowPassFilter.frequency.value = 110;
}
function lowPassFreqHigh() {
	lowPassFilter.frequency.value = 210;
}

// Shortcut Keys for Lowpass Res are R, T, Y
function lowPassResLow() {
	lowPassFilter.Q.value = 2;
}
function lowPassResDefault() {
	lowPassFilter.Q.value = 5;
}
function lowPassResHigh() {
	lowPassFilter.Q.value = 8;
}

// Shortcut Keys for Highpass Freq are A, S, D
function highPassFreqLow() {
	highPassFilter.frequency.value = 110;
}
function highPassFreqDefault() {
	highPassFilter.frequency.value = 880;
}
function highPassFreqHigh() {
	highPassFilter.frequency.value = 1600;
}

// Shortcut Keys for Highpass Res are F, G, H
function highPassResLow() {
	highPassFilter.Q.value = 2;
}
function highPassResDefault() {
	highPassFilter.Q.value = 5;
}
function highPassResHigh() {
	highPassFilter.Q.value = 8;
}

// Keyboard Events
$(document).on("keydown", function(e) {
  console.log(e);
  switch (e.keyCode) {
    case 49: // 1
      volumeLow();
      break;
    case 50: // 2
      volumeDefault();
      break;
    case 51: // 3
      volumeHigh();
      break;
    case 52: // 4
      panLeft();
      break;
    case 53: // 5
      panDefault();
      break;
    case 54: // 6
      panRight();
      break;	  
    case 81: // Q
      lowPassFreqLow();
      break;
    case 87: // W
      lowPassFreqDefault();
      break;
    case 69: // E
      lowPassFreqHigh();
      break;
    case 82: // R
      lowPassResLow();
      break;
    case 84: // T
      lowPassResDefault();
      break;
    case 89: // Y
      lowPassResHigh();
      break;
    case 65: // A
      highPassFreqLow();
      break;
    case 83: // S
      highPassFreqDefault();
      break;
    case 68: // D
      highPassFreqHigh();
      break;
    case 70: // F
      highPassResLow();
      break;
    case 71: // G
      highPassResDefault();
      break;
    case 72: // H
      highPassResHigh();
      break;	  
  }

})

// Hide, Show & Toggle  

 $(document).ready(function() {
   // Hide Content of Options Menu on page load
   $('div#controls').hide(); // Hide Controls
   $('div#shortcuts').hide(); // Hide Shortcuts
   $('div#tips').hide(); // Hide Tips
   
   // Create toggle buttons for Options Menu
   $('#toggleControls').click(function(){
     $('div#shortcuts').hide(); // Hide Shortcuts when Controls are shown
     $('div#tips').hide(); // Hide Tips when Controls are shown
	 $('div#controls').toggle(); // Toggle Controls
   });
   $('#toggleShortcuts').click(function(){
     $('div#controls').hide(); // Hide Controls when Shortcuts are shown
     $('div#tips').hide(); // Hide Tips when Shortcuts are shown
     $('div#shortcuts').toggle(); // Toggle Shortcuts
   });
   $('#toggleTips').click(function(){
     $('div#shortcuts').hide(); // Hide Shortcuts when Tips are shown   
     $('div#controls').hide(); // Hide Controls when Tips are shown   
     $('div#tips').toggle(); // Toggle Tips
   });
 });