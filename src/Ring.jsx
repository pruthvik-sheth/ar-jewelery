import { useLoader, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const Ring = ({ modelRef, videoRef }) => {

    const ringTexture = useLoader(TextureLoader, '/ring4.png')
    const ringRef = useRef()

    const mapCoordinate = (coord, minScreen, maxScreen, min3D, max3D) => {
        return ((coord - minScreen) / (maxScreen - minScreen)) * (max3D - min3D) + min3D;
    }

    useFrame((state, delta) => {
        if (modelRef.current && videoRef.current && videoRef.current.readyState >= 2) {
            const detections = modelRef.current.detectForVideo(
                videoRef.current,
                performance.now()
            );
            if (detections.landmarks.length != 0) {
                const handPosition = detections.landmarks[0][14];
                const x = (handPosition.x) * 12
                const y = (- handPosition.y) * 12
                const z = (- handPosition.z) * 12
                // const scrX = (handPosition.x - 1 * 2) * (600 / 480) * Math.tan(45); // Adjust the scale factor based on your scene
                // const scrY = (handPosition.y - 1 * 2) * -1 * Math.tan(45); // Adjust the scale factor based on your scene
                // // console.log(handPosition.z);
                // const normalized_depth = (handPosition.z - (-1)) / (0 - (-1))
                // const flipped_normalized_depth = 1 - normalized_depth
                // const flipped_depth = flipped_normalized_depth * (0 - (-1)) + (-1)
                // console.log(flipped_depth);
                // const mappedX = mapCoordinate(scrX, 0, 600, -5, 5)
                // const mappedY = mapCoordinate(scrX, 0, 480, -5, 5)
                // const scrZ = 1 - 2 * Math.abs(handPosition.z);
                // console.log(y);
                // console.log(true);


                ringRef.current.position.set(x, y, z)
                // scaleRef.current = [1 + Math.abs(z), 1 + Math.abs(z), 1];
            }
        }
    });

    return (
        <mesh ref={ringRef} position={[0, 0, -2]} scale={1.0}>
            <planeGeometry attach="geometry" args={[1, 1]} />
            <meshBasicMaterial attach="material" map={ringTexture} transparent />
        </mesh>
    )
}

export default Ring