import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import pose_landmarker_task from "/pose_landmarker_lite.task";
import "./App.css"
import necklaceSrc from "/set1.png"

const DemoNeck = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    // const [handPresence, setHandPresence] = useState(null);
    const necklaceImage = new Image()
    necklaceImage.src = necklaceSrc


    useEffect(() => {
        let poseLandmarker;
        let animationFrameId;

        const initializePoseDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                poseLandmarker = await PoseLandmarker.createFromOptions(
                    vision, {
                    baseOptions: { modelAssetPath: pose_landmarker_task },
                    runningMode: "video",
                    delegate: "GPU"
                });

                detectPose();
            } catch (error) {
                console.error("Error initializing pose detection:", error);
            }
        };

        const detectPose = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const detections = poseLandmarker.detectForVideo(videoRef.current, performance.now());
                // setHandPresence(detections.handednesses.length > 0);

                // Assuming detections.landmarks is an array of landmark objects
                if (detections.landmarks) {
                    drawLandmarks(detections.landmarks);
                }
            }
            requestAnimationFrame(detectPose);
        };



        const drawLandmarks = (landmarksArray) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';

            landmarksArray.forEach(landmarks => {
                // console.log(landmarks);
                const leftShoulderX = landmarks[12].x * canvas.width
                const leftShoulderY = landmarks[12].y * canvas.height
                const leftShoulderZ = landmarks[12].z

                const rightShoulderX = landmarks[11].x * canvas.width
                const rightShoulderY = landmarks[11].y * canvas.height
                const rightShoulderZ = landmarks[11].z

                const x = leftShoulderX + (rightShoulderX - leftShoulderX) / 2 //Mid point of both shoulders (around neck)
                const y = (leftShoulderY + rightShoulderY) / 2 //Avg of both shoulders
                const z = (leftShoulderZ + rightShoulderZ) / 2 //Avg of both shoulders
                const scaleFactor = Math.abs(z);

                ctx.drawImage(
                    necklaceImage,
                    x + ((x / 100) * scaleFactor - 100),
                    y - 40 * scaleFactor,
                    200 * scaleFactor,
                    220 * scaleFactor
                );
                // const z = landmarks[14].z;
                // ctx.imageSmoothingEnabled = true;
                // ctx.beginPath();
                // ctx.arc(x , y, 5, 0, 2 * Math.PI); // Draw a circle for each landmark
                // ctx.fill();



                // console.log(necklaceImage.width);

            });
        };


        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await initializePoseDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (poseLandmarker) {
                poseLandmarker.close();
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

export default DemoNeck;



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





