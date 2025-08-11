import React, { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../styles/earth.css';

const AnimatedButton = ({ text, link }) => {
    return (
        <a href={link} className="animated-button-link" target="_blank" rel="noopener noreferrer">
            <button className="animated-button">
                {text}
            </button>
        </a>
    );
};

// Shader code
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

// Configuration object
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

// Procedural texture generators
class ProceduralTextureGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    createEarthTexture(width = 1024, height = 512) {
        this.canvas.width = width;
        this.canvas.height = height;

        // Start with ocean blue base
        this.ctx.fillStyle = '#1e3a5f'; // Deep ocean blue
        this.ctx.fillRect(0, 0, width, height);

        // Add depth variation to oceans
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 100 + 20;

            const oceanGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            oceanGradient.addColorStop(0, '#2c5f7e');
            oceanGradient.addColorStop(1, '#1a3552');

            this.ctx.fillStyle = oceanGradient;
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // Add realistic continents
        this.addRealisticContinents();

        // Add ice caps
        this.addIceCaps();

        // Add subtle terrain noise
        this.addTerrainVariation();

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    createCloudTexture(width = 1024, height = 512) {
        this.canvas.width = width;
        this.canvas.height = height;

        // Clear canvas with transparent background
        this.ctx.clearRect(0, 0, width, height);

        // Create realistic cloud patterns
        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            // Create layered cloud noise with different frequencies
            let noise = this.noise(x * 0.008, y * 0.008) * 0.6 + 0.4;
            noise += (this.noise(x * 0.016, y * 0.016) * 0.4 + 0.3) * 0.4;
            noise += (this.noise(x * 0.032, y * 0.032) * 0.3 + 0.2) * 0.2;
            noise /= 1.2;

            // Add weather pattern bias - more clouds in certain latitudes
            const latitude = y / height;
            let weatherBias = 1.0;

            // More clouds in temperate regions (around 30-60 degrees)
            if (latitude > 0.2 && latitude < 0.4) weatherBias = 1.3; // Northern temperate
            if (latitude > 0.6 && latitude < 0.8) weatherBias = 1.3; // Southern temperate
            if (latitude > 0.1 && latitude < 0.3) weatherBias = 1.2; // Tropical convergence zone
            if (latitude > 0.7 && latitude < 0.9) weatherBias = 1.2;

            noise *= weatherBias;

            // Create realistic cloud density
            let alpha = 0;
            if (noise > 0.45) {
                alpha = Math.pow((noise - 0.45) / 0.55, 1.5) * 180; // More realistic falloff
            }

            // Add some wispy high clouds
            const wispy = this.noise(x * 0.003, y * 0.003) * 0.5 + 0.5;
            if (wispy > 0.8 && alpha < 50) {
                alpha = Math.max(alpha, (wispy - 0.8) * 100);
            }

            data[i] = 255;     // R - pure white
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
            data[i + 3] = Math.max(0, Math.min(255, alpha)); // A
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    createNormalMap(width = 1024, height = 512) {
        this.canvas.width = width;
        this.canvas.height = height;

        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            // Calculate normal from height map
            const heightL = this.heightAt(x - 1, y);
            const heightR = this.heightAt(x + 1, y);
            const heightD = this.heightAt(x, y - 1);
            const heightU = this.heightAt(x, y + 1);

            const normalX = (heightL - heightR) * 0.5 + 0.5;
            const normalY = (heightD - heightU) * 0.5 + 0.5;
            const normalZ = 1.0; // Always pointing up for simplicity

            data[i] = normalX * 255;     // R (X component)
            data[i + 1] = normalY * 255; // G (Y component)
            data[i + 2] = normalZ * 128 + 127; // B (Z component)
            data[i + 3] = 255;           // A
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    createSpecularMap(width = 1024, height = 512) {
        this.canvas.width = width;
        this.canvas.height = height;

        // Start with a base that distinguishes land vs water
        this.ctx.fillStyle = '#333333'; // Low reflectivity for land base
        this.ctx.fillRect(0, 0, width, height);

        // Add high reflectivity for ocean areas
        this.addOceanSpecularity();

        // Lower reflectivity for land areas
        this.addLandSpecularity();

        // Very low reflectivity for ice caps (they're rough)
        this.addIceSpecularity();

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    addOceanSpecularity() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // High specularity for oceans
        this.ctx.fillStyle = '#AAAAAA'; // High reflectivity
        this.ctx.fillRect(0, 0, width, height);

        // Add wave patterns that affect specularity
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 50 + 10;

            const waveGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            waveGradient.addColorStop(0, '#CCCCCC'); // Higher reflectivity at wave peaks
            waveGradient.addColorStop(1, '#888888'); // Lower in troughs

            this.ctx.fillStyle = waveGradient;
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    addLandSpecularity() {
        // Reuse the land drawing logic but with specularity values
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Draw land areas with low specularity
        this.drawSpecularLandmass(width * 0.15, height * 0.25, width * 0.12, height * 0.18, '#444444'); // North America
        this.drawSpecularLandmass(width * 0.08, height * 0.35, width * 0.06, height * 0.12, '#333333'); // Canada (forests = lower)
        this.drawSpecularLandmass(width * 0.18, height * 0.4, width * 0.08, height * 0.08, '#555555'); // Great Plains (grassland = slightly higher)

        this.drawSpecularLandmass(width * 0.25, height * 0.6, width * 0.05, height * 0.25, '#333333'); // Amazon
        this.drawSpecularLandmass(width * 0.22, height * 0.75, width * 0.04, height * 0.15, '#222222'); // Andes (very low)

        this.drawSpecularLandmass(width * 0.52, height * 0.45, width * 0.08, height * 0.12, '#333333'); // Central Africa
        this.drawSpecularLandmass(width * 0.48, height * 0.6, width * 0.12, height * 0.2, '#666666'); // Sahara (desert = higher)
        this.drawSpecularLandmass(width * 0.54, height * 0.75, width * 0.06, height * 0.08, '#555555'); // Southern Africa

        this.drawSpecularLandmass(width * 0.48, height * 0.22, width * 0.08, height * 0.08, '#444444'); // Europe

        this.drawSpecularLandmass(width * 0.65, height * 0.18, width * 0.2, height * 0.15, '#333333'); // Siberia
        this.drawSpecularLandmass(width * 0.7, height * 0.35, width * 0.15, height * 0.12, '#777777'); // Central Asian deserts (high)
        this.drawSpecularLandmass(width * 0.75, height * 0.5, width * 0.12, height * 0.15, '#333333'); // SE Asian jungles
        this.drawSpecularLandmass(width * 0.68, height * 0.28, width * 0.08, height * 0.06, '#111111'); // Himalayas (very low)

        this.drawSpecularLandmass(width * 0.82, height * 0.72, width * 0.08, height * 0.08, '#888888'); // Australian outback (high)
    }

    drawSpecularLandmass(centerX, centerY, radiusX, radiusY, specularColor) {
        this.ctx.fillStyle = specularColor;
        this.ctx.beginPath();

        const points = 12;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variation = 0.8 + Math.random() * 0.4;
            const x = centerX + Math.cos(angle) * radiusX * variation;
            const y = centerY + Math.sin(angle) * radiusY * variation;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    addIceSpecularity() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Ice caps have low specularity (they're not mirror-like, they're rough)
        this.ctx.fillStyle = '#222222'; // Very low reflectivity

        // Arctic
        this.ctx.beginPath();
        this.ctx.ellipse(width/2, height * 0.05, width * 0.3, height * 0.12, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Antarctic
        this.ctx.beginPath();
        this.ctx.ellipse(width/2, height * 0.95, width * 0.25, height * 0.1, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    addRealisticContinents() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // North America - more complex shape with varied terrain
        this.drawLandmass(width * 0.15, height * 0.25, width * 0.12, height * 0.18, '#4a5d23', '#8b9d3a'); // Forest greens
        this.drawLandmass(width * 0.08, height * 0.35, width * 0.06, height * 0.12, '#2d4016', '#5a6b2a'); // Darker forests (Canada)
        this.drawLandmass(width * 0.18, height * 0.4, width * 0.08, height * 0.08, '#b8860b', '#daa520'); // Great Plains

        // South America - tropical and mountainous
        this.drawLandmass(width * 0.25, height * 0.6, width * 0.05, height * 0.25, '#228b22', '#32cd32'); // Amazon rainforest
        this.drawLandmass(width * 0.22, height * 0.75, width * 0.04, height * 0.15, '#8b4513', '#a0522d'); // Andes mountains

        // Africa - diverse terrain
        this.drawLandmass(width * 0.52, height * 0.45, width * 0.08, height * 0.12, '#228b22', '#32cd32'); // Central African forests
        this.drawLandmass(width * 0.48, height * 0.6, width * 0.12, height * 0.2, '#daa520', '#f4a460'); // Sahara and savannas
        this.drawLandmass(width * 0.54, height * 0.75, width * 0.06, height * 0.08, '#9acd32', '#7cfc00'); // Southern grasslands

        // Europe
        this.drawLandmass(width * 0.48, height * 0.22, width * 0.08, height * 0.08, '#556b2f', '#6b8e23'); // European forests

        // Asia - massive and diverse
        this.drawLandmass(width * 0.65, height * 0.18, width * 0.2, height * 0.15, '#2f4f4f', '#4a6b4a'); // Siberian forests
        this.drawLandmass(width * 0.7, height * 0.35, width * 0.15, height * 0.12, '#daa520', '#f4a460'); // Central Asian deserts
        this.drawLandmass(width * 0.75, height * 0.5, width * 0.12, height * 0.15, '#228b22', '#32cd32'); // Southeast Asian jungles
        this.drawLandmass(width * 0.68, height * 0.28, width * 0.08, height * 0.06, '#8b7355', '#a0522d'); // Himalayas

        // Australia
        this.drawLandmass(width * 0.82, height * 0.72, width * 0.08, height * 0.08, '#cd853f', '#daa520'); // Australian outback

        // Additional smaller landmasses and islands
        this.drawLandmass(width * 0.9, height * 0.15, width * 0.03, height * 0.06, '#2f4f4f', '#4a6b4a'); // Far eastern Russia
        this.drawLandmass(width * 0.35, height * 0.2, width * 0.02, height * 0.04, '#556b2f', '#6b8e23'); // Greenland
    }

    drawLandmass(centerX, centerY, radiusX, radiusY, color1, color2) {
        // Create natural-looking landmass with gradient and irregular edges
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY));
        gradient.addColorStop(0, color2);
        gradient.addColorStop(0.7, color1);
        gradient.addColorStop(1, color1);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();

        // Create irregular coastlines
        const points = 16;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variation = 0.7 + Math.random() * 0.6; // Random coastline variation
            const x = centerX + Math.cos(angle) * radiusX * variation;
            const y = centerY + Math.sin(angle) * radiusY * variation;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                // Add some curvature to make coastlines more natural
                const prevAngle = ((i - 1) / points) * Math.PI * 2;
                const prevVar = 0.7 + Math.random() * 0.6;
                const controlX = centerX + Math.cos(prevAngle + 0.2) * radiusX * prevVar * 1.2;
                const controlY = centerY + Math.sin(prevAngle + 0.2) * radiusY * prevVar * 1.2;
                this.ctx.quadraticCurveTo(controlX, controlY, x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    addIceCaps() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Arctic ice cap
        const arcticGradient = this.ctx.createRadialGradient(width/2, 0, 0, width/2, height * 0.15, width * 0.4);
        arcticGradient.addColorStop(0, '#f0f8ff');
        arcticGradient.addColorStop(0.5, '#e6f3ff');
        arcticGradient.addColorStop(1, '#d1e7ff');

        this.ctx.fillStyle = arcticGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(width/2, height * 0.05, width * 0.3, height * 0.12, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Antarctic ice cap
        const antarcticGradient = this.ctx.createRadialGradient(width/2, height, 0, width/2, height * 0.85, width * 0.4);
        antarcticGradient.addColorStop(0, '#f0f8ff');
        antarcticGradient.addColorStop(0.5, '#e6f3ff');
        antarcticGradient.addColorStop(1, '#d1e7ff');

        this.ctx.fillStyle = antarcticGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(width/2, height * 0.95, width * 0.25, height * 0.1, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    addTerrainVariation() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            // Add subtle terrain variation
            const terrainNoise = this.noise(x * 0.005, y * 0.005) * 0.1 +
                               this.noise(x * 0.01, y * 0.01) * 0.05;

            const variation = terrainNoise * 30;
            data[i] = Math.max(0, Math.min(255, data[i] + variation));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation));
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    addNoise(intensity = 0.1) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity * 255;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    // Simple Perlin-like noise function
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }

    heightAt(x, y) {
        // Simple height function for normal map generation
        return this.noise(x * 0.01, y * 0.01) * 0.5 +
               this.noise(x * 0.02, y * 0.02) * 0.25 +
               this.noise(x * 0.04, y * 0.04) * 0.125;
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

        // Initialize renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false
        });
        rendererRef.current = renderer;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            canvas.clientWidth / canvas.clientHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        camera.position.z = CONFIG.camera.position.z;

        // Geometries
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

        // Generate procedural textures
        const textureGenerator = new ProceduralTextureGenerator();

        const earthMap = textureGenerator.createEarthTexture();
        const normalMap = textureGenerator.createNormalMap();
        const specularMap = textureGenerator.createSpecularMap();
        const cloudMap = textureGenerator.createCloudTexture();

        // Materials
        const earthMaterial = new THREE.MeshPhysicalMaterial({
            map: earthMap,
            normalMap: normalMap,
            roughnessMap: specularMap,
            emissiveMap: earthMap,
            emissiveIntensity: 0.2,
            emissive: new THREE.Color(0x112244),
            roughness: 1,
            metalness: 0,
            clearcoat: 0.1,
            clearcoatRoughness: 0.4,
            normalScale: new THREE.Vector2(0.85, 0.85)
        });

        const cloudMaterial = new THREE.MeshPhysicalMaterial({
            map: cloudMap,
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

        // Lighting setup
        const lights = [
            new THREE.AmbientLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 1.2),
            new THREE.PointLight(0x3366ff, 0.5)
        ];

        lights[1].position.set(5, 3, 5);
        lights[2].position.set(-5, -3, -5);
        scene.add(...lights);

        // Add atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(CONFIG.earth.radius * 1.1, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: ATMOSPHERE_VERTEX_SHADER,
            fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
            uniforms: {
                glowColor: { value: new THREE.Color(0x00aaff) },
                viewVector: { value: camera.position }
            },
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Controls setup
        const controls = new OrbitControls(camera, canvas);
        Object.assign(controls, {
            enableDamping: true,
            dampingFactor: 0.05,
            ...CONFIG.controls,
            enablePan: false,
            autoRotate: true
        });

        // Set loading complete
        setIsLoading(false);
        if (onLoadComplete) {
            onLoadComplete();
        }

        // Animation loop
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

        // Resize handling
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }
        });

        resizeObserver.observe(canvas);

        // Cleanup
        return () => {
            resizeObserver.disconnect();

            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }

            [earthGeometry, cloudGeometry, atmosphereGeometry].forEach(geometry => geometry.dispose());
            [earthMaterial, cloudMaterial, atmosphereMaterial].forEach(material => {
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

            <div className="button-container">
                <div className="button-right">
                    <AnimatedButton text="Learn in 3D" link="https://discovir.github.io/butterfly3d/"/>
                </div>
            </div>
        </div>
    );
});

EarthGlobe.displayName = 'EarthGlobe';

export default EarthGlobe;