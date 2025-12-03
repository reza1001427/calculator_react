const { useState, useEffect, useCallback } = React;

const Calculator = () => {
    const [mode, setMode] = useState('simple');
    const [input, setInput] = useState('');
    const [result, setResult] = useState(''); // Current calculated result
    const [history, setHistory] = useState(''); // Shows the expression
    const [isDark, setIsDark] = useState(true);

    // --- 1. Theme Handling ---
    useEffect(() => {
        document.body.className = isDark ? 'dark-mode' : 'light-mode';
    }, [isDark]);

    // --- 2. Input Logic ---
    const handleInput = useCallback((val) => {
        // Prevent multiple decimals
        if (val === '.' && input.slice(-1) === '.') return;
        
        // If we just calculated, clear for new input unless it's an operator
        if (history && !['+', '-', '*', '/', '%'].includes(val)) {
             setHistory('');
             setInput(val);
        } else {
            setInput(prev => prev + val);
        }
    }, [input, history]);

    const clearAll = () => {
        setInput('');
        setHistory('');
        setResult('');
    };

    const deleteLast = () => {
        setInput(prev => prev.slice(0, -1));
    };

    // --- 3. Calculation Engine ---
    const calculate = useCallback(() => {
        if (!input) return;
        try {
            let expression = input;
            
            // Show history
            setHistory(input);

            // Math transformations for Advanced Mode
            expression = expression.replace(/×/g, '*')
                                   .replace(/÷/g, '/')
                                   .replace(/sin/g, 'Math.sin')
                                   .replace(/cos/g, 'Math.cos')
                                   .replace(/tan/g, 'Math.tan')
                                   .replace(/log/g, 'Math.log10')
                                   .replace(/√/g, 'Math.sqrt')
                                   .replace(/π/g, 'Math.PI')
                                   .replace(/\^/g, '**');

            const res = eval(expression);
            
            // Format output (limit decimals)
            const formatted = Number(res).toLocaleString("en-US", {maximumFractionDigits: 8});
            
            setInput(String(res)); // Keep raw number for next math
            setResult(formatted);  // Show pretty number
        } catch (err) {
            setResult('Error');
        }
    }, [input]);

    // --- 4. Keyboard Support ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;
            if (/[0-9]/.test(key)) handleInput(key);
            if (['+', '-', '*', '/', '(', ')', '.', '%'].includes(key)) handleInput(key);
            if (key === 'Enter') { e.preventDefault(); calculate(); }
            if (key === 'Backspace') deleteLast();
            if (key === 'Escape') clearAll();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleInput, calculate]);


    // --- 5. UI Components ---
    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <h1>Calc.AI</h1>
                <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
                    {isDark ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Mode Switcher */}
            <div className="mode-switch">
                <button 
                    className={`mode-btn ${mode === 'simple' ? 'active' : ''}`}
                    onClick={() => setMode('simple')}
                >
                    Simple
                </button>
                <button 
                    className={`mode-btn ${mode === 'advanced' ? 'active' : ''}`}
                    onClick={() => setMode('advanced')}
                >
                    Scientific
                </button>
            </div>

            {/* Display Screen */}
            <div className="display-container">
                <div className="history">{history || '\u00A0'}</div>
                <div className="result">
                    {result || input || '0'}
                </div>
            </div>

            {/* Buttons */}
            <div className="keypad">
                <button className="key btn-ac" onClick={clearAll}>AC</button>
                <button className="key btn-del" onClick={deleteLast}>⌫</button>
                
                {mode === 'advanced' ? (
                    <>
                        <button className="key btn-op" onClick={() => handleInput('%')}>%</button>
                        <button className="key btn-op" onClick={() => handleInput('/')}>÷</button>
                        <button className="key" onClick={() => handleInput('sin(')}>sin</button>
                        <button className="key" onClick={() => handleInput('cos(')}>cos</button>
                        <button className="key" onClick={() => handleInput('tan(')}>tan</button>
                        <button className="key btn-op" onClick={() => handleInput('*')}>×</button>
                    </>
                ) : (
                    <>
                        <button className="key btn-op" onClick={() => handleInput('%')}>%</button>
                        <button className="key btn-op" onClick={() => handleInput('/')}>÷</button>
                        <button className="key btn-op" onClick={() => handleInput('*')}>×</button>
                        <button className="key btn-op" style={{visibility:'hidden'}}> </button> 
                        {/* Empty spacer to align grid in simple mode if needed, or remove */}
                    </>
                )}

                {/* Numbers & Standard Ops */}
                <button className="key" onClick={() => handleInput('7')}>7</button>
                <button className="key" onClick={() => handleInput('8')}>8</button>
                <button className="key" onClick={() => handleInput('9')}>9</button>
                <button className="key btn-op" onClick={() => handleInput('-')}>-</button>

                <button className="key" onClick={() => handleInput('4')}>4</button>
                <button className="key" onClick={() => handleInput('5')}>5</button>
                <button className="key" onClick={() => handleInput('6')}>6</button>
                <button className="key btn-op" onClick={() => handleInput('+')}>+</button>

                <button className="key" onClick={() => handleInput('1')}>1</button>
                <button className="key" onClick={() => handleInput('2')}>2</button>
                <button className="key" onClick={() => handleInput('3')}>3</button>

                {mode === 'advanced' && (
                    <>
                         <button className="key" onClick={() => handleInput('log(')}>log</button>
                         <button className="key" onClick={() => handleInput('√(')}>√</button>
                         <button className="key" onClick={() => handleInput('^')}>^</button>
                         <button className="key" onClick={() => handleInput('π')}>π</button>
                         <button className="key" onClick={() => handleInput('(')}>(</button>
                         <button className="key" onClick={() => handleInput(')')}>)</button>
                    </>
                )}

                {/* Bottom Row */}
                <button className="key" onClick={() => handleInput('0')}>0</button>
                <button className="key" onClick={() => handleInput('.')}>.</button>
                <button className="key btn-eq" onClick={calculate}>=</button>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Calculator />);
