import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Maximize2, ChevronDown, Headset, RotateCcw, Compass } from 'lucide-react';
import { AudioListener, Audio, AudioLoader } from 'three';

// Create shared refs to persist between component renders
const sharedModelRef = { current: null };
const sharedSceneRef = { current: null };
const sharedLoadingState = { current: { isLoaded: false, progress: 0 } };

const WebVRPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
  
  const enterFullExperience = () => {
    setIsFullscreen(true);
    setShouldPlayAudio(true);
  };
  
  const exitFullExperience = () => {
    setIsFullscreen(false);
    setShouldPlayAudio(false);
  };

  return (
    <div className="bg-background-50 dark:bg-secondary-900 min-h-screen">
      {isFullscreen ? (
        <div className="relative w-full h-screen">
          <button 
            onClick={exitFullExperience}
            className="absolute top-4 right-4 z-20 bg-secondary-200 dark:bg-secondary-800 p-2 rounded-full shadow-lg text-secondary-800 dark:text-secondary-200 hover:bg-secondary-300 dark:hover:bg-secondary-700 transition-colors"
          >
            <Maximize2 size={24} />
          </button>
          <ModelViewer shouldPlayAudio={shouldPlayAudio} isPreview={false} />
        </div>
      ) : (
        <VRPreview onEnterExperience={enterFullExperience} />
      )}
    </div>
  );
};

const VRPreview = ({ onEnterExperience }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary-800 dark:text-secondary-100">
          Immersive Biocap Experience
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-text-500 dark:text-background-100">
          Explore our modular seawall system in virtual reality. See firsthand how our Ecoblox design
          creates habitats for marine organisms across different tidal zones.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Feature
          icon={<Headset size={24} />}
          title="VR Exploration"
          description="Navigate through our 3D model using VR technology for a truly immersive experience."
        />
        <Feature
          icon={<RotateCcw size={24} />}
          title="360° Viewing"
          description="Examine every detail of our Ecoblox tiles from any angle with complete freedom."
        />
        <Feature
          icon={<Compass size={24} />}
          title="Guided Tour"
          description="Understand each component's purpose as you move through different tidal zones."
        />
      </div>
      <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden shadow-2xl mb-16 border-4 border-primary-100 dark:border-primary-900/30">
        <div className="aspect-video relative">
          <div className="absolute inset-0 z-10 flex items-end justify-end  pb-2 pr-2 ">
            <button 
              onClick={onEnterExperience} 
              className="backdrop-blur-sm border border-neutral-200 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Enter Full Experience</span>
              <Maximize2 size={20} />
            </button>
          </div>
          <div className="absolute inset-0">
            <ModelViewer shouldPlayAudio={false} isPreview={true} />
          </div>
        </div>
      </div>
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2 className="text-secondary-500 dark:text-secondary-200 text-center">How To Use The VR Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-secondary-600 dark:text-secondary-300">Navigation Controls</h3>
            <ul className="text-text-500 dark:text-background-100">
              <li>Click and drag to rotate the view</li>
              <li>Use scroll wheel to zoom in and out</li>
              <li>WASD keys allow movement through the environment</li>
              <li>Click "Enter VR" button for immersive VR experience (requires VR headset)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-secondary-600 dark:text-secondary-300">Experience Highlights</h3>
            <p className="text-text-500 dark:text-background-100">
            Step into our interactive WebXR environment to explore BIOCAP's coastal protection solutions. 
              Navigate freely through the scene, observe ocean dynamics, and experience the beauty 
              of sustainable marine engineering from any device or VR headset.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mb-4">
        {React.cloneElement(icon, { className: "text-primary-500" })}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-secondary-600 dark:text-secondary-200">
        {title}
      </h3>
      <p className="text-text-500 dark:text-background-100">{description}</p>
    </div>
  );
};

const ModelViewer = ({ shouldPlayAudio, isPreview = false }) => {
  const containerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(sharedLoadingState.current.progress);
  const [isLoading, setIsLoading] = useState(!sharedLoadingState.current.isLoaded);
  const [error, setError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  
  // Scene references
  const sceneRef = useRef(sharedSceneRef.current);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(sharedModelRef.current);
  const placeholderRef = useRef(null);
  const waterRef = useRef(null);
  
  // Audio references
  const audioListenerRef = useRef(null);
  const audioSourceRef = useRef(null);
  const isAudioInitialized = useRef(false);
  
  // Configuration
  const CONFIG = {
    water: {
      textureWidth: 512,
      textureHeight: 512,
      waterNormalsUrl: 'https://threejs.org/examples/textures/waternormals.jpg',
      sunColor: 0xffffff,
      waterColor: 0x00a1f1,
      distortionScale: 3.7,
      fog: false,
      waveSpeed: 0.04,
      height: 0.75
    },
    camera: {
      // Increased default height for better view
      startingHeight: 1,
      startingZ: isPreview ? -3 :-3
    },
    controls: {
      zoomSpeed: 3.0,
      damping: 0.05,
      minDistance: 0.5,
      maxDistance: 100,
      moveSpeed: 2
    },
    audio: {
      enabled: true,
      volume: 0.4,
      url: '/audio/ambient-ocean.mp3' 
    }
  };

  // Handle audio playback based on shouldPlayAudio prop
  useEffect(() => {
    if (!audioSourceRef.current) return;
    
    if (shouldPlayAudio && !isMuted && audioEnabled) {
      audioSourceRef.current.play();
    } else {
      audioSourceRef.current.pause();
    }
  }, [shouldPlayAudio, isMuted, audioEnabled]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene or reuse existing
    let scene = sceneRef.current;
    if (!scene) {
      scene = new THREE.Scene();
      sceneRef.current = scene;
      sharedSceneRef.current = scene;
    }
    
    let frameId;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load HDR environment if not already loaded
    if (!scene.environment) {
      new RGBELoader()
        .setDataType(THREE.HalfFloatType)
        .load(
          '/miami360.hdr',
          (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
          },
          undefined,
          (error) => {
            console.error('Error loading HDR:', error);
            setError('Failed to load skybox texture');
          }
        );
    }

    // Setup camera
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    camera.position.set(6, CONFIG.camera.startingHeight, CONFIG.camera.startingZ);
    cameraRef.current = camera;

    // Initialize audio
    if (CONFIG.audio.enabled) {
      // Create an AudioListener and add it to the camera
      const listener = new AudioListener();
      camera.add(listener);
      audioListenerRef.current = listener;
      
      // Create an Audio source
      const sound = new Audio(listener);
      audioSourceRef.current = sound;
      
      // Load a sound and set it as the Audio object's buffer
      const audioLoader = new AudioLoader();
      audioLoader.load(
        CONFIG.audio.url,
        (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(CONFIG.audio.volume);
          isAudioInitialized.current = true;
          
          // Play audio only if in full experience mode and shouldPlayAudio is true
          if (shouldPlayAudio && audioEnabled && !isPreview) {
            sound.play();
          }
        },
        (xhr) => {
          console.log(`Audio loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          console.error('Error loading audio:', error);
          setError('Failed to load audio. The experience will continue without sound.');
        }
      );
    }

    // Setup controls with increased zoom speed
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = CONFIG.controls.damping;
    controls.minDistance = CONFIG.controls.minDistance;
    controls.maxDistance = CONFIG.controls.maxDistance;
    controls.zoomSpeed = CONFIG.controls.zoomSpeed;
    controls.target.set(0, CONFIG.water.height, 0);
    
    // If in preview mode, enable auto-rotation for a better preview experience
    if (isPreview) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
    
    controlsRef.current = controls;

    // Add VR button only in full experience mode
    if (!isPreview) {
      const vrButton = VRButton.createButton(renderer);
      document.body.appendChild(vrButton);
    }

    // Movement state
    const keys = { w: false, a: false, s: false, d: false };


    // Add this function alongside your existing code
const handleVRControllerMovement = (camera, controls, delta) => {
  const session = rendererRef.current.xr.getSession();
  if (!session) return;

  for (const inputSource of session.inputSources) {
    if (!inputSource.gamepad) continue;

    const axes = inputSource.gamepad.axes;
    
    // Get thumbstick values (typically axes[2] and axes[3] for right thumbstick)
    const moveX = axes[2] || 0;
    const moveZ = axes[3] || 0;

    if (Math.abs(moveX) < 0.1 && Math.abs(moveZ) < 0.1) continue;

    // Get movement directions
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // Calculate movement
    const moveSpeed = CONFIG.controls.moveSpeed * delta;
    const movement = new THREE.Vector3();

    // Apply forward/backward movement
    movement.add(forward.multiplyScalar(-moveZ * moveSpeed));
    
    // Apply left/right movement
    movement.add(right.multiplyScalar(moveX * moveSpeed));

    // Update both camera and controls target
    camera.position.add(movement);
    controls.target.add(movement);
  }
};

    
    // Keyboard handlers - only enable in full experience mode
    const onKeyDown = (e) => {
      if (isPreview) return;
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) keys[key] = true;
    };
    
    const onKeyUp = (e) => {
      if (isPreview) return;
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) keys[key] = false;
    };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Create water if not present
    if (!waterRef.current) {
      const waterGeometry = new THREE.PlaneGeometry(100, 100);
      const water = new Water(
        waterGeometry,
        {
          textureWidth: CONFIG.water.textureWidth,
          textureHeight: CONFIG.water.textureHeight,
          waterNormals: new THREE.TextureLoader().load(
            CONFIG.water.waterNormalsUrl,
            (texture) => {
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }
          ),
          sunColor: CONFIG.water.sunColor,
          waterColor: CONFIG.water.waterColor,
          distortionScale: CONFIG.water.distortionScale,
          fog: CONFIG.water.fog
        }
      );
      water.rotation.x = -Math.PI / 2;
      water.position.y = CONFIG.water.height;
      scene.add(water);
      waterRef.current = water;
    }

    // Add placeholder only if we don't have the model yet
    if (!sharedModelRef.current) {
      const placeholderGeometry = new THREE.BoxGeometry(1, 1, 1);
      const placeholderMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, 
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
      placeholder.position.set(0, 1, 0);
      scene.add(placeholder);
      placeholderRef.current = placeholder;
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      // Water animation
      if (waterRef.current) {
        waterRef.current.material.uniforms['time'].value += delta * CONFIG.water.waveSpeed;
      }
      
      // Movement controls - only in full experience mode
      if (!isPreview) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3();
        right.crossVectors(forward, camera.up).normalize();
        
        if (keys.w) {
          const displacement = forward.clone().multiplyScalar(CONFIG.controls.moveSpeed * delta);
          camera.position.add(displacement);
          controls.target.add(displacement);
        }
        if (keys.s) {
          const displacement = forward.clone().multiplyScalar(-CONFIG.controls.moveSpeed * delta);
          camera.position.add(displacement);
          controls.target.add(displacement);
        }
        if (keys.a) {
          const displacement = right.clone().multiplyScalar(-CONFIG.controls.moveSpeed * delta);
          camera.position.add(displacement);
          controls.target.add(displacement);
        }
        if (keys.d) {
          const displacement = right.clone().multiplyScalar(CONFIG.controls.moveSpeed * delta);
          camera.position.add(displacement);
          controls.target.add(displacement);
        }


// Add this line:
handleVRControllerMovement(camera, controls, delta);

// Continue with the rest of your animate loop
controls.update();
renderer.render(scene, camera);

      }
      
      // Rotate placeholder if it exists
      if (placeholderRef.current) {
        placeholderRef.current.rotation.y += 0.01;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Load model if not already loaded
    if (!sharedModelRef.current && !sharedLoadingState.current.isLoaded) {
      const loadModel = () => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
        
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        
        loader.load(
          '/models/untitled.glb',
          (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scale = 30 / maxDimension;
            
            model.scale.set(scale, scale, scale);
            box.setFromObject(model);
            const newCenter = box.getCenter(new THREE.Vector3());
            
            model.position.set(
              -newCenter.x,
              -box.min.y,
              -newCenter.z - 1.5
            );
            
            if (placeholderRef.current) {
              const fadeOut = () => {
                if (placeholderRef.current.material.opacity > 0) {
                  placeholderRef.current.material.opacity -= 0.05;
                  requestAnimationFrame(fadeOut);
                } else {
                  scene.remove(placeholderRef.current);
                  placeholderRef.current = null;
                }
              };
              fadeOut();
            }
            
            scene.add(model);
            modelRef.current = model;
            sharedModelRef.current = model;
            sharedLoadingState.current.isLoaded = true;
            setIsLoading(false);
            
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });
          },
          (xhr) => {
            const progress = (xhr.loaded / xhr.total) * 100;
            setLoadingProgress(progress);
            sharedLoadingState.current.progress = progress;
          },
          (error) => {
            console.error('Error loading model:', error);
            setError('Failed to load 3D model. Please try again later.');
            setIsLoading(false);
          }
        );
      };
      loadModel();
    } else if (sharedModelRef.current) {
      // Model already loaded
      modelRef.current = sharedModelRef.current;
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(frameId);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Remove VR button if it was added
      if (!isPreview) {
        const vrButton = document.querySelector('.VRButton');
        if (vrButton && vrButton.parentNode) {
          vrButton.parentNode.removeChild(vrButton);
        }
      }
      
      // Pause audio if it's playing
      if (audioSourceRef.current && audioSourceRef.current.isPlaying) {
        audioSourceRef.current.pause();
      }
      
      // Don't dispose of shared resources since they're used between components
      renderer.dispose();
    };
  }, [shouldPlayAudio, isPreview]);

  return (
    <div className={`relative w-full h-${isPreview ? 'full' : 'screen'} bg-gray-900`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-10">
          <div className="w-64 bg-gray-800 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-indigo-300 mt-4 font-medium">
            Loading model: {Math.round(loadingProgress)}%
          </p>
          <p className="text-gray-400 text-sm mt-2 max-w-md text-center">
            For better performance, we're using optimized loading techniques.
          </p>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md">
          {error}
        </div>
      )}
      
      {!isPreview && (
        <div className="absolute bottom-4 left-4 text-gray-300 bg-gray-800 bg-opacity-70 p-3 rounded-md max-w-xs text-sm">
          <h3 className="font-bold text-indigo-400 mb-1">Controls:</h3>
          <p>• Drag to rotate view</p>
          <p>• Scroll to zoom in/out</p>
          <p>• Use WASD keys to move</p>
          <p>• Click "Enter VR" for immersive view</p>
        </div>
      )}
      
      {/* Audio controls - only show in full mode */}
      {!isPreview && isAudioInitialized.current && (
        <div className="absolute bottom-32 left-4 bg-gray-800 bg-opacity-70 p-3 rounded-md">
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              if (audioSourceRef.current) {
                if (audioEnabled) {
                  audioSourceRef.current.pause();
                } else if (shouldPlayAudio) {
                  audioSourceRef.current.play();
                }
              }
            }}
            className="text-gray-300 hover:text-white flex items-center space-x-2"
          >
            <span>{audioEnabled ? "Mute Audio" : "Unmute Audio"}</span>
          </button>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

export default WebVRPage;