import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "/hand_landmarker.task";
import { Canvas } from "@react-three/fiber";
import "./App.css"
import Ring from "./Ring";

const Demo = () => {
    const videoRef = useRef(null);
    // const canvasRef = useRef(null);
    const [handPresence, setHandPresence] = useState(null);
    const handLandmarkerRef = useRef()

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                handLandmarker = await HandLandmarker.createFromOptions(
                    vision, {
                    baseOptions: { modelAssetPath: hand_landmarker_task },
                    numHands: 1,
                    runningMode: "video",
                    delegate: "GPU"
                });

                // detectHands();
                handLandmarkerRef.current = handLandmarker;
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);


    return (
        <div className="main">
            {/* <h1>Is there a Hand? {handPresence ? "Yes" : "No"}</h1> */}
            <div className="video_box">
                <video className="video_scr" ref={videoRef} width={600} height={480} autoPlay playsInline ></video>
                {/* <canvas ref={canvasRef} style={{ backgroundColor: "transparent" }} width={600} height={480}></canvas> */}
                <div className="canvas_container">
                    <Canvas
                        gl={{
                            antialias: true,
                        }}
                        camera={{
                            fov: 75,
                            near: 0.1,
                            far: 200,
                            position: [0, 0, 5]
                        }}>

                        <Ring modelRef={handLandmarkerRef} videoRef={videoRef} />


                    </Canvas>
                </div>
            </div>
        </div>
    );
};

export default Demo;




// const drawLandmarks3D = (landmarksArray) => {
//     const ring = ringRef.current
//     landmarksArray.forEach(landmarks => {
//         const x = landmarks[13].x - 0.5 * 2.0;
//         const y = landmarks[13].y - 0.5 * 2.0;
//         const z = landmarks[13].z - 0.5 * 2.0;
//         console.log(x);

//         ring.position.set([0, 0, -3])

//     });
// }

// const detectHands = () => {
//     if (videoRef.current && videoRef.current.readyState >= 2) {
//         const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
//         setHandPresence(detections.handednesses.length > 0);

//         // Assuming detections.landmarks is an array of landmark objects
//         if (detections.landmarks) {
//             drawLandmarks3D(detections.landmarks);
//         }
//     }
//     requestAnimationFrame(detectHands);
// };


// const drawLandmarks = (landmarksArray) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'white';
//     // console.log(landmarksArray);

//     // landmarksArray.forEach(landmarks => {
//     //     landmarks.forEach(landmark => {
//     //         const x = landmark.x * canvas.width;
//     //         const y = landmark.y * canvas.height;
//     //         // console.log(landmark.z);

//     //         ctx.beginPath();
//     //         ctx.arc(x, y, 20 * Math.abs(landmark.z), 0, 2 * Math.PI); // Draw a circle for each landmark
//     //         ctx.fill();
//     //     });
//     // });

//     landmarksArray.forEach(landmarks => {
//         // console.log(landmarks[14]);
//         const x = landmarks[13].x * canvas.width;
//         const y = landmarks[13].y * canvas.height;
//         const z = landmarks[13].z;
//         const scaleFactor = 0.1 + 5.0 * Math.abs(z);

//         // const x2 = landmarks[19].x * canvas.width;
//         // const y2 = landmarks[19].y * canvas.height;
//         // const slope = (y2 - y) / (x2 - x)
//         // const angleInRadians = Math.atan(slope)
//         // const angleInDegrees = (180 / Math.PI) * angleInRadians
//         // console.log(landmark.z);

//         // ctx.beginPath();
//         // ctx.arc(x, y, 40 * Math.abs(landmarks[14].z), 0, 2 * Math.PI); // Draw a circle for each landmark
//         // ctx.fill();
//         // ctx.rotate(angleInDegrees * 0.001)
//         ctx.drawImage(
//             ringImage,
//             x - 50 * scaleFactor,
//             y - 120 * scaleFactor,
//             90 * scaleFactor,
//             90 * scaleFactor
//         );
//         // ctx.restore()

//     });
// };