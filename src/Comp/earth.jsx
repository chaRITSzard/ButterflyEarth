import React, { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../styles/earth.css';

const AnimatedButton = ({ text }) => {
    return (
        <Link to="/game" className="animated-button-link">
            <button className="animated-button">
                {text}
            </button>
        </Link>
    );
};

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path/to/texture.jpg');
texture.colorSpace = THREE.SRGBColorSpace; // Updated from encoding

// Shader code remains the same
const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize(normalMatrix * position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  uniform vec3 viewVector;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, intensity);
  }
`;

// Configuration object remains the same
const CONFIG = {
    camera: {
        fov: 75,
        near: 0.1,
        far: 1000,
        position: { z: 2 }
    },
    controls: {
        minDistance: 1.5,
        maxDistance: 4,
        rotateSpeed: 0.5,
        autoRotateSpeed: 0.5
    },
    earth: {
        radius: 1,
        segments: 128,
        rotation: 0.0005
    },
    clouds: {
        radius: 1.01,
        segments: 128,
        rotation: 0.0007,
        opacity: 0.8
    }
};

// TextureLoader class remains the same
class TextureLoader {
    constructor() {
        this.loader = new THREE.TextureLoader();
    }

    load(url) {
        return new Promise((resolve, reject) => {
            this.loader.load(url, resolve, undefined, reject);
        });
    }
}

const EarthGlobe = memo(({ onLoadComplete }) => {
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const frameIdRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Initialize scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.Fog(0x000000, 1, 1000);

        // Initialize renderer with updated color space settings
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false
        });
        rendererRef.current = renderer;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace; // Updated from outputEncoding
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Camera setup remains the same
        const camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            canvas.clientWidth / canvas.clientHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        camera.position.z = CONFIG.camera.position.z;

        // Geometries remain the same
        const earthGeometry = new THREE.SphereGeometry(
            CONFIG.earth.radius,
            CONFIG.earth.segments,
            CONFIG.earth.segments
        );

        const cloudGeometry = new THREE.SphereGeometry(
            CONFIG.clouds.radius,
            CONFIG.clouds.segments,
            CONFIG.clouds.segments
        );

        // Materials remain the same but need updated texture settings
        const earthMaterial = new THREE.MeshPhysicalMaterial({
            roughness: 1,
            metalness: 0,
            clearcoat: 0.1,
            clearcoatRoughness: 0.4,
            normalScale: new THREE.Vector2(0.85, 0.85)
        });

        const cloudMaterial = new THREE.MeshPhysicalMaterial({
            transparent: true,
            opacity: CONFIG.clouds.opacity,
            clearcoat: 0.1,
            clearcoatRoughness: 0.4,
            blending: THREE.AdditiveBlending
        });

        // Create meshes
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(earth, clouds);

        // Lighting setup remains the same
        const lights = [
            new THREE.AmbientLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 1.2),
            new THREE.PointLight(0x3366ff, 0.5)
        ];

        lights[1].position.set(5, 3, 5);
        lights[2].position.set(-5, -3, -5);
        scene.add(...lights);

        // Controls setup remains the same
        const controls = new OrbitControls(camera, canvas);
        Object.assign(controls, {
            enableDamping: true,
            dampingFactor: 0.05,
            ...CONFIG.controls,
            enablePan: false,
            autoRotate: true
        });

        // Update the material settings in your EarthGlobe component
        const loadTextures = async () => {
            const textureLoader = new TextureLoader();

            try {
                const [earthMap, normalMap, specularMap, cloudMap] = await Promise.all([
                    textureLoader.load('/textures/earth.jpg'),
                    textureLoader.load('/textures/normal.jpeg'),
                    textureLoader.load('/textures/specular.jpeg'),
                    textureLoader.load('/textures/cloud.jpeg')
                ]);

                // Apply updated texture settings
                [earthMap, normalMap, specularMap, cloudMap].forEach(texture => {
                    Object.assign(texture, {
                        wrapS: THREE.RepeatWrapping,
                        wrapT: THREE.RepeatWrapping,
                        anisotropy: renderer.capabilities.getMaxAnisotropy(),
                        colorSpace: THREE.SRGBColorSpace
                    });
                });

                // Update earth material
                earthMaterial.map = earthMap;
                earthMaterial.normalMap = normalMap;
                earthMaterial.roughnessMap = specularMap;
                earthMaterial.emissiveMap = earthMap;
                earthMaterial.emissiveIntensity = 0.2;
                earthMaterial.emissive = new THREE.Color(0x112244);

                // Update cloud material
                cloudMaterial.map = cloudMap;
                cloudMaterial.transparent = true;
                cloudMaterial.opacity = 0.8;

                earthMaterial.needsUpdate = true;
                cloudMaterial.needsUpdate = true;

                // Add atmosphere glow
                const atmosphereGeometry = new THREE.SphereGeometry(CONFIG.earth.radius * 1.1, 32, 32);
                const atmosphereMaterial = new THREE.ShaderMaterial({
                    vertexShader: ATMOSPHERE_VERTEX_SHADER,
                    fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    transparent: true
                });

                const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                scene.add(atmosphere);

                setIsLoading(false);
                if (onLoadComplete) {
                    onLoadComplete();
                }
            } catch (error) {
                console.error('Failed to load textures:', error);
            }
        };

        loadTextures();

        // Animation loop remains the same
        let lastTime = 0;
        const animate = (currentTime) => {
            frameIdRef.current = requestAnimationFrame(animate);

            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            earth.rotation.y += CONFIG.earth.rotation;
            clouds.rotation.y += CONFIG.clouds.rotation;

            controls.update();
            renderer.render(scene, camera);
        };

        frameIdRef.current = requestAnimationFrame(animate);

        // Resize handling remains the same
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }
        });

        resizeObserver.observe(canvas);

        // Cleanup remains the same
        return () => {
            resizeObserver.disconnect();

            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }

            [earthGeometry, cloudGeometry].forEach(geometry => geometry.dispose());
            [earthMaterial, cloudMaterial].forEach(material => {
                material.dispose();
                Object.values(material).forEach(value => {
                    if (value instanceof THREE.Texture) {
                        value.dispose();
                    }
                });
            });

            renderer.dispose();
            controls.dispose();
            scene.clear();
        };
    }, [onLoadComplete]);

    return (
        <div className="earth-globe-container">
            <div className="earth-globe-overlay"/>
            <canvas ref={canvasRef} className="earth-globe-canvas"/>
            {isLoading && (
                <div className="earth-globe-loader">
                    <div className="loader-spinner"/>
                    <span>Loading Earth...</span>
                </div>
            )}
            <div className="earth-globe-container">
                <div className="cta-content">
                    <AnimatedButton text="Start Learning"/>
                </div>
            </div>
        </div>
    );
});

EarthGlobe.displayName = 'EarthGlobe';

export default EarthGlobe;