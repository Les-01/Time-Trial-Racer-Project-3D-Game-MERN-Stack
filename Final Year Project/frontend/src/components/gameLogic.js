// gameLogic.js
// This imports 'React', 'useRef' and 'useEffect' from 'react'.
import React, { useRef, useEffect } from 'react';
// This imports '*' as 'THREE' from 'three'.
import * as THREE from 'three';

// This is the functional component 'ThreeGame'.
const ThreeGame = () => {
  // This is a reference to hold hold the container DOM elements for rendering the scene.
  const containerRef = useRef();

  useEffect(() => {
    // This declares the variables 'scene', 'camera', 'renderer' and 'cube';
    let scene, camera, renderer, cube;

    // This is the initialisation funtion for the three.js scene
    const init = () => {
      // This uses 'THREE.Scene' to create an instance of a new three.js scene and assigns it as the value of the variable 'scene'.
      scene = new THREE.Scene();
      // This creates a three.js perspective camera with a viewing angle of 75 degrees and an aspect ration of the windows width divided by the window height and assigns it as the value of the variable 'camera'.
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      // This creates a three.js 'WebGLRenderer' and assigns it as the value of the variable 'renderer' for rendering the created 3D scene.
      renderer = new THREE.WebGLRenderer();
      // This sets the 'size' property of the 'renderer' to match the total window size rendering the scne the same size as the window.
      renderer.setSize(window.innerWidth, window.innerHeight);
      // This appends (adds) the renderer's created canvas DOM element to the document body.
      containerRef.current.appendChild(renderer.domElement);

      // This uses the three.js library to create a cube with the dimensions 1x1x1 and assigns it as the value of the variable 'geometry'.
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      // This uses the three.js library to create a white directional light and assigns it as the value of the variable 'light'.
      const light = new THREE.DirectionalLight(0xffffff);
      // This sets the 'position' property of the 'light' using the X, Y and Z axis determining its facing direction.
      light.position.set(0, 20, 10);
      // This uses the three.js library to create an ambient light with a soft white color and assigns it as the value of the variable 'ambient'.
      const ambient = new THREE.AmbientLight(0x707070);
      // This uses the three.js library to create a 'MeshPhongMaterial' with a blue colour and assigns it as the value of the variable 'material'.
      const material = new THREE.MeshPhongMaterial({ color: 0x00aaff });
      // This uses the three.js library to create a 3D 'Mesh' which is passed the variables 'geometry' and 'material' to create a cube mesh and assigns it as the value of the variable 'cube'.
      cube = new THREE.Mesh(geometry, material);

      // This adds elements assigned to the variables to the scene itself.
      // This adds the cube.
      scene.add(cube);
      // This adds the light.
      scene.add(light);
      // This adds the ambient.
      scene.add(ambient);
      // This set the initial camera position to a value of '3' on the 'Z' axis.
      camera.position.z = 3;
    };

    // This is the function to handle window resize events.
    const handleResize = () => {
      if (containerRef.current) {
        // This updates the camera aspect ratio and render size in a window resize event.
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // This is the function to center and contain the game window within its container.
    const centerGameWindow = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        // This sets various styles for the game window size property.
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%, -50%)';
      }
    };

    // This is the 'animate' function for animating the cube.
    const animate = () => {
      // This is a basic game loop in this case used to loop the animation rather than game 'render' and 'update' functions. 
      // Here 'requestAnimationFrame' is passed the 'animate' function to request the next animation frame.
      requestAnimationFrame(animate);

      if (cube) {
        // Here the logic of the animation is updated. 
        // This adds the value of '0.01' to the rotational 'x' axis of the cube, once rendered it will rotate the cube along its 'x' axis.
        cube.rotation.x += 0.01;
        // This adds the value of '0.01' to the rotational 'y' axis of the cube, once rendered it will rotate the cube along its 'y' axis.
        cube.rotation.y += 0.01;
      }
      // Here the scenes updated logic is rendered updating the animation. 
      // Here the 'render' method of the 'THREE.WebGLRenderer' assigned to the variable 'renderer' is passed the 'scene' and the 'camera' of 'this' game class instance rendering the updated logic.
      renderer.render(scene, camera);
    };

    // This is the 'onWindowResize' function that calls the 'handleResize' and 'centerGameWindow' functions when executed.
    const onWindowResize = () => {
      handleResize();
      centerGameWindow();
    };

    // This is the event listener for window resize events which calls the 'onWindowResize' function which in turn calls other functions to enable window resizing functionality.
    window.addEventListener('resize', onWindowResize);

    // Here the 'init' function is called to initialise the three.js scene.
    init();
    // Here the 'handleResize' function is called to resize the game window before the game starts.
    handleResize();
    // Here the 'centerGameWindow' function is called to center the game window before the game starts.
    centerGameWindow();
    // Here the 'animate' function is called to start the animation taking place within the game window as the game is still in development.
    animate();

    // This is the cleanup logic.
    return () => {
      // This disposes of the 'renderers' content and removes the renderer's canvas from the DOM.
      window.removeEventListener('resize', onWindowResize);

      if (renderer && containerRef.current) {
        renderer.dispose();
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []); // This assures the code block will only be executed once.

  // This returns the container element to enable the Three.js scene to be rendered.
  return <div ref={containerRef} style={{ position: 'relative' }} />;
};
// This exports the functional component 'ThreeGame' as the default export of this module.
export default ThreeGame;
