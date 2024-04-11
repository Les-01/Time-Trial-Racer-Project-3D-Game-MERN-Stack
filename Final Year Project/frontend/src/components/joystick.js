// * @author NikLever / https://github.com/NikLever

// Define the class JoyStick.
class JoyStick {
    // Constructor function that passed an options object as argument.
	constructor(options){
        // Create a DOM element for the outer circle of the joystick.
		const circle = document.createElement("div");
        // Define CSS styles for the circle element.
		circle.style.cssText = "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126, 126, 126, 0.5); border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
        // Create a DOM element for the thumb stick of the joystick.
		const thumb = document.createElement("div");
        // Define CSS styles for the thumb element.
		thumb.style.cssText = "position: absolute; left: 20px; top: 20px; width: 40px; height: 40px; border-radius: 50%; background: #fff;";
        // Append the thumb element to the circle element
		circle.appendChild(thumb);
        // Append the circle element to the body of the document.
		document.body.appendChild(circle);
        // Store the thumb element as a property of the JoyStick instance
		this.domElement = thumb;
        // Set the maximum radius for the joystick with a default of 40.
		this.maxRadius = options.maxRadius || 40;
        // Calculate the square of the maximum radius for optimisation.
		this.maxRadiusSquared = this.maxRadius * this.maxRadius;
        // Store the onMove callback function from the options object.
		this.onMove = options.onMove;
        // Store the game object from the options object.
		this.game = options.game;
        // Store the initial position of the thumb element.
		this.origin = { left:this.domElement.offsetLeft, top:this.domElement.offsetTop };
        // Set the rotation damping default of 0.06.
		this.rotationDamping = options.rotationDamping || 0.06;
        // Set the movement damping default of 0.01.
		this.moveDamping = options.moveDamping || 0.01;
        // Add event listeners for touchstart/mousedown events to the thumb element.
		// IF statement to check if domElement is defined.
		if (this.domElement != undefined) {
			// Store a reference to 'this' context in a variable 'joystick' to be used within event listener functions.
			const joystick = this;
			// Check if the device supports touch events.
			if ('ontouchstart' in window) {
				// Add a touchstart event listener to the thumb element, preventing default behavior, and calling the 'tap' method with the event object.
				this.domElement.addEventListener('touchstart', function(evt){ evt.preventDefault(); joystick.tap(evt); });
				// If touch events are not supported.
			} else {
				// Add a mousedown event listener to the thumb element, preventing default behavior, and calling the 'tap' method with the event object.
				this.domElement.addEventListener('mousedown', function(evt){ evt.preventDefault(); joystick.tap(evt); });
			}
		}
	}
	
	// Method to get the position of the mouse/touch event.
	getMousePosition(evt){
		// Check if targetTouches is available (indicating a touch event), if yes, get the pageX value from the first touch, else get the clientX value from the mouse event.
		let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
		// Check if targetTouches is available (indicating a touch event), if yes, get the pageY value from the first touch, else get the clientY value from the mouse event.
		let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
		// Return an object with the x and y coordinates.
		return { x:clientX, y:clientY };
	}
	
	// Method called when a touchstart/mousedown event is detected.
	tap(evt){
		// If evt is not defined, fallback to window.event (for IE compatibility).
		evt = evt || window.event;
		// Get the mouse cursor position at the start of the event and store the initial position in the 'offset' property using the 'getMousePosition' method.
		this.offset = this.getMousePosition(evt);
		// Store a reference to 'this' context in a variable 'joystick' to be used within event listener functions
		const joystick = this;
		// Check if the device supports touch events
		if ('ontouchstart' in window){
			// Add a touchmove event listener to the document, preventing default behavior, and calling the 'move' method with the event object.
			document.ontouchmove = function(evt){ evt.preventDefault(); joystick.move(evt); };
			// Add a touchend event listener to the document, preventing default behavior, and calling the 'up' method with the event object.
			document.ontouchend =  function(evt){ evt.preventDefault(); joystick.up(evt); };
			// If touch events are not supported.
		} else {
			// Add a mousemove event listener to the document, preventing default behavior, and calling the 'move' method with the event object.
			document.onmousemove = function(evt){ evt.preventDefault(); joystick.move(evt); };
			// Add a mouseup event listener to the document, preventing default behavior, and calling the 'up' method with the event object.
			document.onmouseup = function(evt){ evt.preventDefault(); joystick.up(evt); };
		}
	}
	
	// Method called when a touchmove/mousemove event is detected.
	move(evt){
		// If evt is not defined, fallback to window.event (for IE compatibility).
		evt = evt || window.event;
		// Get the current mouse position using the 'getMousePosition' method.
		const mouse = this.getMousePosition(evt);		
		// Calculate the horizontal distance moved by subtracting the initial x-coordinate from the current x-coordinate.
		let left = mouse.x - this.offset.x;
		// Calculate the vertical distance moved by subtracting the initial y-coordinate from the current y-coordinate.
		let top = mouse.y - this.offset.y;		
		// Calculate the square of the magnitude of the movement vector.
		const sqMag = left * left + top * top;
		// If the distance exceeds the maximum radius.
		if (sqMag > this.maxRadiusSquared){
			// Calculate the magnitude of the movement vector.
			const magnitude = Math.sqrt(sqMag);
			// Normalize the horizontal distance.
			left /= magnitude;
			// Normalize the vertical distance.
			top /= magnitude;
			// Scale the normalized horizontal distance by the maximum radius.
			left *= this.maxRadius;
			// Scale the normalized vertical distance by the maximum radius.
			top *= this.maxRadius;			
		}
		// Set the top CSS property of the thumb element to the vertical distance plus half of the thumb element's height
		this.domElement.style.top = `${top + this.domElement.clientHeight/2}px`;
		// Set the left CSS property of the thumb element to the horizontal distance plus half of the thumb element's width
		this.domElement.style.left = `${left + this.domElement.clientWidth/2}px`;		
		// Calculate the forward value by normalizing the vertical distance relative to the maximum radius
		const forward = (top - this.origin.top + this.domElement.clientHeight/2) / this.maxRadius;
		// Calculate the turn value by normalizing the horizontal distance relative to the maximum radius
		const turn = (left - this.origin.left + this.domElement.clientWidth/2) / this.maxRadius;		
		// If the onMove callback function is defined, call it with the forward and turn values and bind 'this' to the game object
		if (this.onMove != undefined) this.onMove.call(this.game, forward, turn);		
	}

	
	// Method called when a touchend/mouseup event is detected.
	up(evt){
		// Check if the device supports touch events
		if ('ontouchstart' in window){
			// Remove the touchmove event listener
			document.ontouchmove = null;
			// Remove the touchend event listener
			document.touchend = null;
		// If touch events are not supported
		} else {
			// Remove the mousemove event listener
			document.onmousemove = null;
			// Remove the mouseup event listener
			document.onmouseup = null;			
		}
		// Reset the top CSS property of the thumb element to its original top position
		this.domElement.style.top = `${this.origin.top}px`;
		// Reset the left CSS property of the thumb element to its original left position
		this.domElement.style.left = `${this.origin.left}px`;		
		// If the onMove callback function is defined, call it with zero values for forward and turn, and bind 'this' to the game object
		this.onMove.call(this.game, 0, 0);		
	}
	
	render() {
		return null;
	}
}

// Export the JoyStick class as the default export
export default JoyStick;