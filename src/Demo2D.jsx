import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "/hand_landmarker.task";
import "./App.css"
import ringSrc from "/ring4.png"

const Demo2D = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [handPresence, setHandPresence] = useState(null);
    const ringImage = new Image()
    ringImage.src = ringSrc


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

                detectHands();
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

        const detectHands = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
                setHandPresence(detections.handednesses.length > 0);

                // Assuming detections.landmarks is an array of landmark objects
                if (detections.landmarks) {
                    drawLandmarks(detections.landmarks);
                }
            }
            requestAnimationFrame(detectHands);
        };



        const drawLandmarks = (landmarksArray) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';

            landmarksArray.forEach(landmarks => {
                const x = landmarks[14].x * canvas.width;
                const y = landmarks[14].y * canvas.height;
                const z = landmarks[14].z;
                const scaleFactor = Math.abs(z) * 6.5;
                ctx.imageSmoothingEnabled = true;
                // ctx.beginPath();
                // ctx.arc(x, y - 20, Math.abs(z) * 100, 0, 2 * Math.PI); // Draw a circle for each landmark
                // ctx.fill();


                ctx.drawImage(
                    ringImage,
                    x - (130 * scaleFactor / 2),
                    y - (scaleFactor / 2),
                    100 * scaleFactor,
                    100 * scaleFactor
                );
                console.log(ringImage.width);

            });
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
                <canvas ref={canvasRef} style={{ backgroundColor: "transparent" }} width={600} height={480}></canvas>
            </div>
        </div>
    );
};

export default Demo2D;



// console.log(landmarksArray);

// landmarksArray.forEach(landmarks => {
//     landmarks.forEach(landmark => {
//         const x = landmark.x * canvas.width;
//         const y = landmark.y * canvas.height;
//         // console.log(landmark.z);

//
//     });
// });


// const x2 = landmarks[19].x * canvas.width;
// const y2 = landmarks[19].y * canvas.height;
// const slope = (y2 - y) / (x2 - x)
// const angleInRadians = Math.atan(slope)
// const angleInDegrees = (180 / Math.PI) * angleInRadians
// console.log(landmark.z);

// ctx.beginPath();
// ctx.arc(x, y, 40 * Math.abs(landmarks[14].z), 0, 2 * Math.PI); // Draw a circle for each landmark
// ctx.fill();
// ctx.rotate(angleInDegrees * 0.001)





