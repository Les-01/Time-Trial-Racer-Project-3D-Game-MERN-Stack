// Define the class SFX.
class SFX {
	// Constructor function for the SFX class.
	constructor(options){
		// Set the audio context provided in options to the context property.
		this.context = options.context;
		// Set volume to the specified value in options or default to 1.0.
		const volume = (options.volume!=undefined) ? options.volume : 1.0;
		// Create a GainNode to control volume.
		this.gainNode = this.context.createGain();
		// Set the initial volume level.
		this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
		// Connect the GainNode to the audio context's destination (output).
		this.gainNode.connect(this.context.destination);
		// Set loop to the specified value in options or default to false.
		this._loop = (options.loop==undefined) ? false : options.loop;
		// Set fadeDuration to the specified value in options or default to 0.5.
		this.fadeDuration = (options.fadeDuration==undefined) ? 0.5 : options.fadeDuration;
		// Set autoplay to the specified value in options or default to false.
		this.autoplay = (options.autoplay==undefined) ? false : options.autoplay;
		// Initialize buffer property to null.
		this.buffer = null;
		
		
		// Declare a variable to hold the codec
		let codec;

		// Loop through each property in options.src
		for(let prop in options.src){
			// Check if the browser supports the audio type
			if (SFX.supportsAudioType(prop)){
				// Set codec to the supported audio type
				codec = prop;
				break;
			}
		}
		
		// If codec is defined
		if (codec!=undefined){
			// Set url to the corresponding audio source
			this.url = options.src[codec];
			// Load the audio file
			this.load(this.url);
		// If codec is not defined
		}else{
			// Log a warning message to the console
			console.warn("Browser does not support any of the supplied audio files");			
		}
	}
	
	// Static method to check if browser supports given audio type.
	static supportsAudioType(type) {
		// Declare a variable to hold the audio element.
		let audio;

		// Declare 'format' array and define audio formats.
		let formats = {
			mp3: 'audio/mpeg',
			wav: 'audio/wav',
			aif: 'audio/x-aiff',
			ogg: 'audio/ogg'
		};

		// IF no audio element exists create one.
		if(!audio) audio = document.createElement('audio');

		// Check if the browser supports the specified audio type
		// Return true if browser supports the audio type, otherwise false
		return audio.canPlayType(formats[type] || type);		
	}
	
	// Method to asynchronously load the audio file.
	load(url) {
		// Create a new XMLHttpRequest object.
		const request = new XMLHttpRequest();
		// Open a GET request to the specified URL.
		request.open("GET", url, true);
		// Set the response type to arraybuffer.
		request.responseType = "arraybuffer";
		// Store a reference to the current 'this' context.
		const sfx = this;
		// Define the onload event handler.
		request.onload = function() {			
			// Function to use the Web Audio API's decodeAudioData method to decode the audio data.
			sfx.context.decodeAudioData(
				// Pass the response data from the request.
				request.response,
				// Success callback function: executed if decoding is successful.
				function(buffer) {
					// Check if the buffer is null.
					if (!buffer) {
						// Log an error if decoding fails.
						console.error('error decoding file data: ' + sfx.url);
						// Exit the function.
						return; 
					}
					// Store the decoded audio buffer in the 'buffer' property of the 'sfx' object.
					sfx.buffer = buffer;
					// If 'autoplay' is enabled, play the audio immediately after loading.
					if (sfx.autoplay)
						sfx.play();
				},
				// Error callback function: executed if decoding fails.
				function(error) {
					// Log an error message if decoding fails.
					console.error('decodeAudioData error', error);
				}
			);
		}
		// Define the onerror event handler.
		request.onerror = function() {
			// Log an error message if XHR request fails.
			console.error('SFX Loader: XHR error');			
		}
		// Send the request.
		request.send();
	}

	
	// Setter method for the loop property.
	set loop(value) {
		// Set the private _loop property to the provided value.
		this._loop = value;
		// Check if the source property is defined and not undefined.
		if (this.source != undefined) {
			// If the source property is defined, set the loop property of the source to the provided value.
			this.source.loop = value;
		}
	}

	// Method to play the audio.
	play(){
		// Check if the buffer is null, if true, return immediately.
		if (this.buffer == null) return;	
		// Check if there is an existing audio source, if true, stop it.
		if (this.source != undefined) 
			this.source.stop();	
		// Create a new audio buffer source node.
		this.source = this.context.createBufferSource();	
		// Set the loop property of the source node.
		this.source.loop = this._loop;	
		// Set the buffer of the source node to the loaded audio buffer.
		this.source.buffer = this.buffer;	
		// Connect the audio buffer source node to the gain node.
		this.source.connect(this.gainNode);	
		// Start playing the audio immediately.
		this.source.start(0);
	}
	
	// Setter for volume property
	set volume(value){
		// Set volume property
		this._volume = value;	
		// Set volume using a time-varying value
		this.gainNode.gain.setTargetAtTime(value, this.context.currentTime + this.fadeDuration, 0);
	}
	
	// Method to pause the audio.
	pause(){
		// Check if source is undefined, return if true.
		if (this.source==undefined) return;
		// Stop the audio source.
		this.source.stop();		
	}
	
	// Method to stop the audio.
	stop(){
		// Check if source is undefined, return if true.
		if (this.source==undefined) return;
		// Stop the audio source.
		this.source.stop();
		// Delete the source property.
		delete this.source;		
	}
}

export default SFX;