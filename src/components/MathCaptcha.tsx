import React, { useEffect, useState } from 'react';
import { MathCaptchaConfig } from '../types';
import { generateMathProblem } from '../utils/captchaGenerator';
import './MathCaptcha.css';

interface MathProblem {
    equation: string;
    answer: number;
    operation: string;
    operand1: number;
    operand2: number;
}

interface MathCaptchaProps {
    config?: MathCaptchaConfig;
    onSolve?: (answer: number) => void;
    onError?: (error: string) => void;
    disabled?: boolean;
    className?: string;
    i18n?: {
        placeholder?: string;
        submit?: string;
        loading?: string;
        solve?: string;
        incorrectAnswer?: string;
        enterAnswer?: string;
    };
}

const MathCaptcha: React.FC<MathCaptchaProps> = ({
    config = {
        difficulty: 'easy',
        operations: ['add', 'subtract'],
        numberRange: { min: 1, max: 10 },
        displayFormat: 'horizontal'
    },
    onSolve,
    onError,
    disabled = false,
    className = '',
    i18n = {}
}) => {
    const [problem, setProblem] = useState<MathProblem | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate new problem on mount and config changes
    useEffect(() => {
        generateNewProblem();
    }, [config]);

    const generateNewProblem = () => {
        try {
            const newProblem = generateMathProblem(config);
            setProblem(newProblem);
            setUserAnswer('');
            setError(null);
        } catch (err) {
            setError('Failed to generate math problem');
            onError?.('Failed to generate math problem');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!problem || disabled) return;

        setIsLoading(true);
        setError(null);

        try {
            const answer = parseFloat(userAnswer.trim());

            if (isNaN(answer)) {
                setError(i18n.enterAnswer || 'Please enter a valid number');
                onError?.(i18n.enterAnswer || 'Please enter a valid number');
                return;
            }

            if (answer === problem.answer) {
                onSolve?.(answer);
                generateNewProblem(); // Generate new problem after successful solve
            } else {
                setError(i18n.incorrectAnswer || 'Incorrect answer. Please try again.');
                onError?.(i18n.incorrectAnswer || 'Incorrect answer. Please try again.');
                setUserAnswer('');
            }
        } catch (err) {
            setError('An error occurred while validating the answer');
            onError?.('An error occurred while validating the answer');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserAnswer(e.target.value);
        if (error) setError(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !disabled && !isLoading) {
            handleSubmit(e as any);
        }
    };

    if (!problem) {
        return (
            <div className={`math-captcha loading ${className}`}>
                <div className="math-captcha-content">
                    <div className="animate-pulse">
                        {i18n.loading || 'Loading math problem...'}
                    </div>
                </div>
            </div>
        );
    }

    const getOperationSymbol = (operation: string) => {
        switch (operation) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '+';
        }
    };

    const renderProblem = () => {
        const symbol = getOperationSymbol(problem.operation);

        if (config.displayFormat === 'vertical') {
            return (
                <div className="math-problem vertical">
                    <div className="math-line">
                        <span className="number">{problem.operand1}</span>
                    </div>
                    <div className="math-line">
                        <span className="operator">{symbol}</span>
                        <span className="number">{problem.operand2}</span>
                    </div>
                    <div className="math-line divider">
                        <span>────</span>
                    </div>
                    <div className="math-line answer">
                        <span>?</span>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="math-problem horizontal">
                    <span className="number">{problem.operand1}</span>
                    <span className="operator">{symbol}</span>
                    <span className="number">{problem.operand2}</span>
                    <span className="equals">=</span>
                    <span className="answer">?</span>
                </div>
            );
        }
    };

    return (
        <div className={`math-captcha ${className}`}>
            <div className="math-captcha-content">
                <div className="math-captcha-problem">
                    {renderProblem()}
                </div>

                <form onSubmit={handleSubmit} className="math-captcha-form">
                    <div className="math-input-group">
                        <input
                            type="number"
                            value={userAnswer}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder={i18n.placeholder || 'Enter your answer'}
                            disabled={disabled || isLoading}
                            className={`math-input ${error ? 'error' : ''}`}
                            aria-label="Math captcha answer"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={disabled || isLoading || !userAnswer.trim()}
                            className="math-submit-button"
                            aria-label={i18n.submit || 'Submit answer'}
                        >
                            {isLoading ? (i18n.loading || 'Loading...') : (i18n.solve || 'Solve')}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="math-error" role="alert">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MathCaptcha;
