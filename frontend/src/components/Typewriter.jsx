import React, { useState, useEffect } from "react";

const Typewriter = () => {
  const messages = [
    "Parsing the reference list...",
    "Extracting article titles...",
    "Searching Open Alex for author data...",
    "Labelling author genders using Gender-API...",
    "Computing statistics...",
    "Generating plots..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [delay, setDelay] = useState(100);

  useEffect(() => {
    const currentMessage = messages[messageIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing phase: add one more character
        const nextText = currentMessage.substring(0, displayedText.length + 1);
        setDisplayedText(nextText);

        if (nextText === currentMessage) {
          // Full text reached, pause then start deleting
          setDelay(1500);
          setIsDeleting(true);
        } else {
          setDelay(100);
        }
      } else {
        // Deleting phase: remove one character
        const nextText = currentMessage.substring(0, displayedText.length - 1);
        setDisplayedText(nextText);

        if (nextText === "") {
          // Finished deleting, switch to next message after a brief pause
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
          setDelay(500);
        } else {
          setDelay(50);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, messageIndex, delay, messages]);

  return (
    <div className="text-2xl text-white mt-6 flex items-center justify-center">
      <p className="whitespace-nowrap">
        {displayedText}
        <span className="animate-blink">|</span>
      </p>
    </div>
  );
};

export default Typewriter;
