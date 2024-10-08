import React, { useState } from 'react';
import './Textform.css';

const Textform = () => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted value:", inputValue);
    };

    return (
        <form onSubmit={handleSubmit} className="text-form">
            <label htmlFor="referenceList" className="input-label"></label>
            <textarea
                id="referenceList"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste your reference list"
                className="text-area"
                rows="6"
            />
            <button type="submit">Start</button>
        </form>
    );
};

export default Textform;