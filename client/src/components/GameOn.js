import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/gameOn.css";
import ScratchCard from "./ScratchCard";
import UserRequestForm from "./UserRequestForm";
// import { ProgressBar } from "react-toastify/dist/components";
import ProgressBar from "./ProgressBar.component";

const Game = () => {
    const [header, setHeader] = useState("");
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);
    const [isValidUser, setIsValidUser] = useState(false);
    const [dropZones, setDropZones] = useState([null, null]); // Stores dropped numbers for x and y
    const [targetSum, setTargetSum] = useState(""); // Random target sum
    const [isResultLoading, setIsResultLoading] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
    const [result, setResult] = useState({});
    const [draggedNumber, setDraggedNumber] = useState(null); // For touch support

    // Numbers that will be available for drag-and-drop
    const [availableNumbers, setAvailableNumbers] = useState([]);

    const steps = [{label: "Step 1", description: "Solve the Puzzle"}, {label: "Step 2", description:"Enter Phone No"}, {label: "Step 3", description: "Scratch the Card"}]

    useEffect(() => {
        setTargetSum(getRandomNumber());
    }, []);

    const checkIfCorrect = (updatedDropZones) => {
        if (updatedDropZones[0] !== null && updatedDropZones[1] !== null) {
            const sum = updatedDropZones[0] + updatedDropZones[1];
            if (sum === targetSum) {
                setIsCorrectAnswer(true);
                setIsAnswerIncorrect(false); // Clear incorrect state
            } else {
                setIsAnswerIncorrect(true); // Set to incorrect
            }
        }
    };

    // Generate numbers for drag-and-drop when the component mounts or targetSum changes
    useEffect(() => {
        const correctAnswers = generateCorrectAnswers(targetSum);
        const numbers = shuffleArray([...correctAnswers, getRandomNumber(), getRandomNumber()]);
        setAvailableNumbers(numbers);
    }, [targetSum]); // Re-run if targetSum changes

    // Set the dynamic header (animation)
    useEffect(() => {
        const fullHeader = "Game On";
        let count = 0;
        const interval = setInterval(() => {
            setHeader(fullHeader.substring(0, count % fullHeader.length + 1));
            count += 1;
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Function to generate 2 numbers whose sum equals the targetSum
    const generateCorrectAnswers = (sum) => {
        const x = Math.floor(Math.random() * (sum - 1)) + 1; // Random x such that 1 <= x <= sum - 1
        const y = sum - x;
        return [x, y];
    };

    // Random number generator for incorrect answers
    const getRandomNumber = () => Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20

    // Shuffle an array (for randomness of options)
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

    // Drag event handlers (for desktop)
    const handleDragStart = (e, number) => {
        e.dataTransfer.setData("number", number);
    };

    const handleDrop = (e, index) => {
        const droppedNumber = parseInt(e.dataTransfer.getData("number"), 10);
        const updatedDropZones = [...dropZones];
        updatedDropZones[index] = droppedNumber;
        setDropZones(updatedDropZones);
        checkIfCorrect(updatedDropZones);
    };

    // Touch event handlers (for mobile)
    const handleTouchStart = (e, number) => {
        setDraggedNumber(number);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touchLocation = e.targetTouches[0];
        const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
        if (element && element.classList.contains("question-input")) {
            element.style.backgroundColor = "#ddd"; // Simulate hover
        }
    };

    const handleTouchEnd = (e, index) => {
        if (draggedNumber !== null) {
            const updatedDropZones = [...dropZones];
            updatedDropZones[index] = draggedNumber;
            setDropZones(updatedDropZones);
            checkIfCorrect(updatedDropZones);
            setDraggedNumber(null);
        }
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        console.log(value);

        // Check if the input is a valid number
        if (!isNaN(value)) {
            setPhoneNumber(value);

            // Check if the length is 10 to mark as a valid phone number
            if (value.length === 10) {
                setIsValidPhoneNumber(true);
            } else {
                setIsValidPhoneNumber(false); // Mark invalid if length is not 10
            }
        } else {
            setIsValidPhoneNumber(false); // Mark invalid if input is not a number
        }
    };

    const handleSubmit = async () => {
        setIsFormSubmitted(true);
        setIsResultLoading(true);
        axios
            .post("/offers/participate", { phoneNumber: phoneNumber })
            .then((res) => {
                if (res.status === 200) {
                    setIsValidUser(true);
                    setResult(res.data);
                }
                setIsResultLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    setIsValidUser(false);
                    setResult(err.response.data);
                } else {
                    console.error(err);
                }
                setIsResultLoading(false);
            });
    };

    return (
        <div className="gameon-container">
            <div className="gameon-header">{header}</div>
            {isCorrectAnswer ? !isFormSubmitted ?
                <>
                    <ProgressBar steps={steps} currentStep={2}/>
                    <div>
                        <input
                            type="number"
                            className="phone-number-input"
                            placeholder="Enter Your Phone Number"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                        />
                        <button
                            className={`send-btn ${
                                !isValidPhoneNumber || isResultLoading ? "disabled" : ""
                            }`}
                            disabled={!isValidPhoneNumber || isResultLoading}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </> :
                    isValidUser ? (
                            <>
                                <ProgressBar steps={steps} currentStep={3}/>
                                <div className="description max-width">
                                    Hi <div className="user-name">{result?.name}</div>
                                    {result && result.isAlreadyParticipated
                                        ? ", You have already participated"
                                        : ", Please scratch the card below to see your result."}
                                </div>
                                <div className="scratch-card-div">
                                    <ScratchCard
                                        rank={result?.rank}
                                        message={result?.message}
                                        hide={result?.isAlreadyParticipated}
                                    />
                                </div>
                            </>
                        ) :
                            <>
                                <ProgressBar steps={steps} currentStep={3} isCorrect={false}/>
                                {isResultLoading ?
                                    <div>Loading...</div>
                                :
                                <>
                                    <div className="max-width invalid-user-msg description err-msg">
                                        You are not part of this offer, please send us a request in the
                                        below request form
                                    </div>
                                    <UserRequestForm  phoneNumber={phoneNumber || ""}/>
                                </>
                                }
                            </>
            :
                <>
                    <ProgressBar steps={steps} currentStep={1}/>
                    <p className="step-description">Drag and Drop the Numbers</p>
                    <div className="question">
                        <div
                            className={`question-input ${
                                dropZones[0] !== null
                                    ? isAnswerIncorrect
                                        ? "incorrect"
                                        : "filled"
                                    : ""
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, 0)}
                            onTouchEnd={(e) => handleTouchEnd(e, 0)} // For mobile touch support
                        >
                            {dropZones[0] !== null ? dropZones[0] : ""}
                        </div>
                        <div className="question-number">+</div>
                        <div
                            className={`question-input ${
                                dropZones[1] !== null
                                    ? isAnswerIncorrect
                                        ? "incorrect"
                                        : "filled"
                                    : ""
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, 1)}
                            onTouchEnd={(e) => handleTouchEnd(e, 1)} // For mobile touch support
                        >
                            {dropZones[1] !== null ? dropZones[1] : ""}
                        </div>
                        <div className="question-number">=</div>
                        <div className="question-number">{targetSum}</div>
                    </div>
                    <div className="available-numbers">
                        {availableNumbers.map((number, index) => (
                            <div
                                key={index}
                                className="number-option"
                                draggable
                                onDragStart={(e) => handleDragStart(e, number)}
                                onTouchStart={(e) => handleTouchStart(e, number)} // For mobile touch support
                                onTouchMove={handleTouchMove} // For mobile touch support
                            >
                                {number}
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    );
};

export default Game;
