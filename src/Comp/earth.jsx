import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const EarthGlobe = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 2;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create Earth sphere
        const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

        // Create material with all maps
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: null,
            bumpMap: null,
            bumpScale: 0.05,
            specularMap: null,
            specular: new THREE.Color('grey'),
            shininess: 10,
            normalMap: null,
            normalScale: new THREE.Vector2(0.5, 0.5)
        });

        // Create Earth mesh
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Create clouds
        const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: null,
            transparent: true,
            opacity: 0.8
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(5, 3, 5);
        scene.add(sunLight);

        // Add point light on the opposite side for some fill
        const fillLight = new THREE.PointLight(0x3366ff, 0.3);
        fillLight.position.set(-5, -3, -5);
        scene.add(fillLight);

        // Add OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.minDistance = 1.5;
        controls.maxDistance = 4;

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const loadTexture = (url) => {
            return new Promise((resolve, reject) => {
                textureLoader.load(url, resolve, undefined, reject);
            });
        };

        // Load all textures
        Promise.all([
            // Earth textures
            loadTexture('/textures/10K.jpg'), // Replace with your normal map
            loadTexture('/textures/spe8K.jpg'), // Replace with your specular map
            loadTexture('/textures/8K.jpg')  // Replace with your cloud map
        ]).then(([ normalMap, specularMap, cloudMap]) => {
            // Apply texture settings
            [normalMap, specularMap, cloudMap].forEach(texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            });

            // Apply maps to Earth material
            earthMaterial.normalMap = normalMap;
            earthMaterial.specularMap = specularMap;
            earthMaterial.needsUpdate = true;

            // Apply cloud texture
            cloudMaterial.map = cloudMap;
            cloudMaterial.needsUpdate = true;
        }).catch(error => {
            console.error('Error loading textures:', error);
        });

        // Animation loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Rotate Earth
            earth.rotation.y += 0.0005;

            // Rotate clouds slightly faster than Earth
            clouds.rotation.y += 0.0007;

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!canvasRef.current) return;

            const width = canvasRef.current.clientWidth;
            const height = canvasRef.current.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            scene.remove(earth);
            scene.remove(clouds);
            earthGeometry.dispose();
            earthMaterial.dispose();
            cloudGeometry.dispose();
            cloudMaterial.dispose();
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100vh',
                display: 'block',
                backgroundColor: '#000'
            }}
        />
    );
};
export default EarthGlobe;
