import React, { useEffect, useState } from "react";
import "../css/ScratchCard.css";


const ScratchCard = ({rank, message, hide= false}) => {

    useEffect(() => {
        const canvasElement = document.getElementById("scratch");
        const canvasContext = canvasElement.getContext("2d");
        let isDragging = false;

        const initializeCanvas = () => {
            const gradient = canvasContext.createLinearGradient(0, 0, 135, 135);
            gradient.addColorStop(0, "#758694");
            canvasContext.fillStyle = gradient;
            canvasContext.fillRect(0, 0, 200, 200);
        };

        const scratch = (x, y) => {
            canvasContext.globalCompositeOperation = "destination-out";
            canvasContext.beginPath();
            canvasContext.arc(x, y, 12, 0, 2 * Math.PI);
            canvasContext.fill();
        };

        const getMouseCoordinates = (event) => {
            const rect = canvasElement.getBoundingClientRect();
            const x = (event.pageX || event.touches[0].pageX) - rect.left;
            const y = (event.pageY || event.touches[0].pageY) - rect.top;
            return { x, y };
        };

        const handleMouseDown = (event) => {
            isDragging = true;
            const { x, y } = getMouseCoordinates(event);
            scratch(x, y);
        };

        const handleMouseMove = (event) => {
            if (isDragging) {
                event.preventDefault();
                const { x, y } = getMouseCoordinates(event);
                scratch(x, y);
            }
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handleMouseLeave = () => {
            isDragging = false;
        };

        const isTouchDevice = 'ontouchstart' in window;

        canvasElement.addEventListener(isTouchDevice ? "touchstart" : "mousedown", handleMouseDown);
        canvasElement.addEventListener(isTouchDevice ? "touchmove" : "mousemove", handleMouseMove);
        canvasElement.addEventListener(isTouchDevice ? "touchend" : "mouseup", handleMouseUp);
        canvasElement.addEventListener("mouseleave", handleMouseLeave);

        initializeCanvas();

        // Cleanup event listeners on unmount
        return () => {
            canvasElement.removeEventListener(isTouchDevice ? "touchstart" : "mousedown", handleMouseDown);
            canvasElement.removeEventListener(isTouchDevice ? "touchmove" : "mousemove", handleMouseMove);
            canvasElement.removeEventListener(isTouchDevice ? "touchend" : "mouseup", handleMouseUp);
            canvasElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div className="scratchcard-container">
            <div className="base">
                <div className="rank">{rank}</div>
                <div className="message">{message}</div>
            </div>
            <canvas
                id="scratch"
                width="200"
                className={hide?"hide":""}
                height="200"
                style={{
                    // cursor: 'url("https://media.geeksforgeeks.org/wp-content/uploads/20231030101751/bx-eraser-icon.png"), auto'
                }}
            ></canvas>
        </div>
    );
};

export default ScratchCard;