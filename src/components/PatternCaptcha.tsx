import { Check, Eye, Loader2, RefreshCcw, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PatternCaptchaConfig } from '../types';

interface PatternItem {
    id: number;
    shape: 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'hexagon' | 'heart';
    color: string;
    rotation: number;
    size: number;
    isTarget: boolean;
}

interface PatternProblem {
    items: PatternItem[];
    targetIndex: number;
    question: string;
    hint?: string;
    patternType: 'shape' | 'color' | 'sequence' | 'rotation' | 'size' | 'mixed';
    difficulty: 'easy' | 'medium' | 'hard';
}

interface PatternCaptchaProps {
    config?: PatternCaptchaConfig;
    onValidate?: (isValid: boolean) => void;
    disabled?: boolean;
    className?: string;
    darkMode?: boolean;
    i18n?: {
        instruction?: string;
        selectDifferent?: string;
        correct?: string;
        incorrect?: string;
        tryAgain?: string;
        loading?: string;
        showHint?: string;
        verified?: string;
    };
}

const PatternCaptcha: React.FC<PatternCaptchaProps> = ({
    config = {},
    onValidate,
    disabled = false,
    className = '',
    darkMode = false,
    i18n = {}
}) => {
    const [problem, setProblem] = useState<PatternProblem | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isValidated, setIsValidated] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showHint, setShowHint] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const {
        difficulty = 'easy',
        gridSize = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9,
        patternTypes = ['shape', 'color', 'rotation', 'size'],
    } = config;

    // Enhanced color palette
    const colors = {
        blue: '#3b82f6',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        purple: '#a855f7',
        pink: '#ec4899',
        teal: '#14b8a6',
        orange: '#f97316',
        indigo: '#6366f1',
    };

    const colorArray = useMemo(() => Object.values(colors), []);
    const shapes = useMemo(() => ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon', 'heart'] as const, []);

    // Enhanced pattern generation - removed useCallback to prevent infinite loop
    const generatePattern = (): PatternProblem => {
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const items: PatternItem[] = [];
        let question = '';
        let hint = '';
        let targetIndex = -1;

        const minIndex = gridSize === 4 ? 0 : 1;
        const maxIndex = gridSize === 4 ? 3 : gridSize - 2;
        targetIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));

        switch (patternType) {
            case 'shape': {
                const commonShape = shapes[Math.floor(Math.random() * shapes.length)];
                let differentShape: typeof shapes[number];
                do {
                    differentShape = shapes[Math.floor(Math.random() * shapes.length)];
                } while (differentShape === commonShape);

                const commonColor = colorArray[Math.floor(Math.random() * colorArray.length)];

                for (let i = 0; i < gridSize; i++) {
                    items.push({
                        id: i,
                        shape: i === targetIndex ? differentShape : commonShape,
                        color: commonColor,
                        rotation: 0,
                        size: 1,
                        isTarget: i === targetIndex
                    });
                }
                question = i18n.selectDifferent || 'Select the shape that is different';
                hint = `Look for the ${differentShape} among the ${commonShape}s`;
                break;
            }

            case 'color': {
                const commonColor = colorArray[Math.floor(Math.random() * colorArray.length)];
                let differentColor: string;
                do {
                    differentColor = colorArray[Math.floor(Math.random() * colorArray.length)];
                } while (differentColor === commonColor);

                const commonShape = shapes[Math.floor(Math.random() * shapes.length)];

                for (let i = 0; i < gridSize; i++) {
                    items.push({
                        id: i,
                        shape: commonShape,
                        color: i === targetIndex ? differentColor : commonColor,
                        rotation: 0,
                        size: 1,
                        isTarget: i === targetIndex
                    });
                }
                question = i18n.selectDifferent || 'Select the item with a different color';
                hint = `Find the differently colored ${commonShape}`;
                break;
            }

            case 'rotation': {
                const rotations = [0, 45, 90, 135];
                const commonRotation = rotations[Math.floor(Math.random() * rotations.length)];
                let differentRotation: number;
                do {
                    differentRotation = rotations[Math.floor(Math.random() * rotations.length)];
                } while (differentRotation === commonRotation);

                const commonShape = shapes[Math.floor(Math.random() * shapes.length)];
                const commonColor = colorArray[Math.floor(Math.random() * colorArray.length)];

                for (let i = 0; i < gridSize; i++) {
                    items.push({
                        id: i,
                        shape: commonShape,
                        color: commonColor,
                        rotation: i === targetIndex ? differentRotation : commonRotation,
                        size: 1,
                        isTarget: i === targetIndex
                    });
                }
                question = i18n.selectDifferent || 'Select the item with a different rotation';
                hint = `Look for the differently rotated ${commonShape}`;
                break;
            }

            case 'size': {
                const commonSize = 1;
                const differentSize = difficulty === 'easy' ? 1.3 : difficulty === 'medium' ? 1.4 : 1.5;

                const commonShape = shapes[Math.floor(Math.random() * shapes.length)];
                const commonColor = colorArray[Math.floor(Math.random() * colorArray.length)];

                for (let i = 0; i < gridSize; i++) {
                    items.push({
                        id: i,
                        shape: commonShape,
                        color: commonColor,
                        rotation: 0,
                        size: i === targetIndex ? differentSize : commonSize,
                        isTarget: i === targetIndex
                    });
                }
                question = i18n.selectDifferent || 'Select the item that is a different size';
                hint = `Find the ${differentSize > 1 ? 'larger' : 'smaller'} ${commonShape}`;
                break;
            }

            case 'mixed':
            case 'sequence':
            default: {
                const baseShape = shapes[Math.floor(Math.random() * shapes.length)];
                const baseColor = colorArray[Math.floor(Math.random() * colorArray.length)];
                const baseRotation = 0;

                for (let i = 0; i < gridSize; i++) {
                    const isTarget = i === targetIndex;
                    items.push({
                        id: i,
                        shape: isTarget ? shapes[(shapes.indexOf(baseShape) + 1) % shapes.length] : baseShape,
                        color: isTarget ? colorArray[(colorArray.indexOf(baseColor) + 1) % colorArray.length] : baseColor,
                        rotation: isTarget ? 45 : baseRotation,
                        size: isTarget ? 1.2 : 1,
                        isTarget
                    });
                }
                question = i18n.selectDifferent || 'Select the item that looks different';
                hint = 'Look carefully at shape, color, and rotation';
                break;
            }
        }

        return {
            items,
            targetIndex,
            question,
            hint,
            patternType,
            difficulty
        };
    };

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setProblem(generatePattern());
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []); // Run only once on mount

    const handleSelect = useCallback((index: number) => {
        if (disabled || isValidated || !problem) return;

        setSelectedIndex(index);
        setIsValidated(true);

        const correct = problem.items[index].isTarget;
        setIsCorrect(correct);
        setAttempts(prev => prev + 1);

        onValidate?.(correct);

        if (!correct) {
            setTimeout(() => {
                setIsValidated(false);
                setSelectedIndex(null);
                setShowHint(false);
                setIsLoading(true);

                setTimeout(() => {
                    setProblem(generatePattern());
                    setIsLoading(false);
                }, 300);
            }, 1500);
        }
    }, [disabled, isValidated, problem, onValidate, generatePattern]);

    const handleReset = useCallback(() => {
        setIsLoading(true);
        setSelectedIndex(null);
        setIsValidated(false);
        setIsCorrect(false);
        setShowHint(false);

        setTimeout(() => {
            setProblem(generatePattern());
            setIsLoading(false);
        }, 300);
    }, [generatePattern]);

    const renderShape = (item: PatternItem, index: number) => {
        const { shape, color, rotation, size } = item;
        const baseSize = 48;
        const actualSize = baseSize * size;
        const isHovered = hoveredIndex === index;
        const isSelected = selectedIndex === index;

        const svgSize = actualSize + 8;

        // Enhanced gradient and shadow IDs
        const gradientId = `gradient-${index}`;
        const shadowId = `shadow-${index}`;

        const shapeElements = {
            circle: (
                <>
                    <defs>
                        <radialGradient id={gradientId}>
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </radialGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <circle
                        cx={svgSize / 2}
                        cy={svgSize / 2}
                        r={actualSize / 2.5}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                    />
                </>
            ),
            square: (
                <>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </linearGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <rect
                        x={(svgSize - actualSize * 0.7) / 2}
                        y={(svgSize - actualSize * 0.7) / 2}
                        width={actualSize * 0.7}
                        height={actualSize * 0.7}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                        rx="6"
                    />
                </>
            ),
            triangle: (
                <>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </linearGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <polygon
                        points={`${svgSize / 2},${(svgSize - actualSize * 0.7) / 2} ${svgSize / 2 + actualSize * 0.35},${svgSize / 2 + actualSize * 0.35} ${svgSize / 2 - actualSize * 0.35},${svgSize / 2 + actualSize * 0.35}`}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </>
            ),
            star: (
                <>
                    <defs>
                        <radialGradient id={gradientId}>
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </radialGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <path
                        d={`M${svgSize / 2},${(svgSize - actualSize * 0.7) / 2} 
                            L${svgSize / 2 + actualSize * 0.1},${svgSize / 2 + actualSize * 0.1} 
                            L${svgSize / 2 + actualSize * 0.35},${svgSize / 2 + actualSize * 0.1} 
                            L${svgSize / 2 + actualSize * 0.15},${svgSize / 2 + actualSize * 0.25} 
                            L${svgSize / 2 + actualSize * 0.2},${svgSize / 2 + actualSize * 0.4} 
                            L${svgSize / 2},${svgSize / 2 + actualSize * 0.3} 
                            L${svgSize / 2 - actualSize * 0.2},${svgSize / 2 + actualSize * 0.4} 
                            L${svgSize / 2 - actualSize * 0.15},${svgSize / 2 + actualSize * 0.25} 
                            L${svgSize / 2 - actualSize * 0.35},${svgSize / 2 + actualSize * 0.1} 
                            L${svgSize / 2 - actualSize * 0.1},${svgSize / 2 + actualSize * 0.1} Z`}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </>
            ),
            diamond: (
                <>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </linearGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <polygon
                        points={`${svgSize / 2},${(svgSize - actualSize * 0.7) / 2} 
                                 ${svgSize / 2 + actualSize * 0.35},${svgSize / 2} 
                                 ${svgSize / 2},${svgSize / 2 + actualSize * 0.35} 
                                 ${svgSize / 2 - actualSize * 0.35},${svgSize / 2}`}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </>
            ),
            hexagon: (
                <>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </linearGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <polygon
                        points={`${svgSize / 2},${(svgSize - actualSize * 0.7) / 2} 
                                 ${svgSize / 2 + actualSize * 0.3},${svgSize / 2 - actualSize * 0.15} 
                                 ${svgSize / 2 + actualSize * 0.3},${svgSize / 2 + actualSize * 0.15} 
                                 ${svgSize / 2},${svgSize / 2 + actualSize * 0.35} 
                                 ${svgSize / 2 - actualSize * 0.3},${svgSize / 2 + actualSize * 0.15} 
                                 ${svgSize / 2 - actualSize * 0.3},${svgSize / 2 - actualSize * 0.15}`}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </>
            ),
            heart: (
                <>
                    <defs>
                        <radialGradient id={gradientId}>
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </radialGradient>
                        <filter id={shadowId}>
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <path
                        d={`M${svgSize / 2},${svgSize / 2 + actualSize * 0.3} 
                            C${svgSize / 2},${svgSize / 2 + actualSize * 0.3} 
                            ${svgSize / 2 - actualSize * 0.35},${svgSize / 2 - actualSize * 0.1} 
                            ${svgSize / 2 - actualSize * 0.2},${(svgSize - actualSize * 0.7) / 2} 
                            C${svgSize / 2 - actualSize * 0.05},${(svgSize - actualSize * 0.7) / 2 - actualSize * 0.1} 
                            ${svgSize / 2},${(svgSize - actualSize * 0.7) / 2} 
                            ${svgSize / 2},${svgSize / 2 - actualSize * 0.1} 
                            C${svgSize / 2},${(svgSize - actualSize * 0.7) / 2} 
                            ${svgSize / 2 + actualSize * 0.05},${(svgSize - actualSize * 0.7) / 2 - actualSize * 0.1} 
                            ${svgSize / 2 + actualSize * 0.2},${(svgSize - actualSize * 0.7) / 2} 
                            C${svgSize / 2 + actualSize * 0.35},${svgSize / 2 - actualSize * 0.1} 
                            ${svgSize / 2},${svgSize / 2 + actualSize * 0.3} 
                            ${svgSize / 2},${svgSize / 2 + actualSize * 0.3} Z`}
                        fill={`url(#${gradientId})`}
                        filter={`url(#${shadowId})`}
                        stroke={darkMode ? '#4b5563' : '#d1d5db'}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </>
            ),
        };

        return (
            <motion.svg
                width={svgSize}
                height={svgSize}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="transition-transform duration-300"
                animate={{
                    scale: isHovered && !isValidated ? 1.1 : isSelected ? (isCorrect ? 1.15 : 0.95) : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {shapeElements[shape]}
            </motion.svg>
        );
    };

    if (isLoading) {
        return (
            <div className={`pattern-captcha-loading ${className}`}>
                <motion.div
                    className={`flex flex-col items-center justify-center p-8 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader2 className={`w-8 h-8 animate-spin mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {i18n.loading || 'Generating pattern...'}
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!problem) return null;

    const gridCols = gridSize === 4 ? 'grid-cols-2' : gridSize === 6 ? 'grid-cols-3' : 'grid-cols-3';

    return (
        <div className={`pattern-captcha w-full ${className}`}>
            <AnimatePresence>
                {isCorrect && isValidated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`rounded-lg border-2 p-8 text-center ${darkMode
                            ? 'bg-gradient-to-br from-green-900/30 to-gray-800 border-green-700'
                            : 'bg-gradient-to-br from-green-50 to-white border-green-300'
                            }`}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4"
                        >
                            <Check className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {i18n.verified || 'Pattern Verified!'}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {i18n.correct || 'You successfully identified the correct pattern.'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isCorrect && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={`mb-4 p-4 rounded-lg border ${darkMode
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-blue-50 border-blue-200'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {problem.question}
                                    </p>
                                </div>

                                {attempts > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2"
                                    >
                                        <button
                                            onClick={() => setShowHint(!showHint)}
                                            className={`flex items-center gap-1 text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                                }`}
                                        >
                                            <Eye className="w-3 h-3" />
                                            {showHint ? 'Hide hint' : (i18n.showHint || 'Show hint')}
                                        </button>
                                        <AnimatePresence>
                                            {showHint && problem.hint && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                                >
                                                    💡 {problem.hint}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {attempts > 0 && !isCorrect && (
                            <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Attempts: {attempts}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={`grid ${gridCols} gap-3 mb-4`}>
                        {problem.items.map((item, index) => (
                            <motion.button
                                key={item.id}
                                onClick={() => handleSelect(index)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                disabled={disabled || isValidated}
                                className={`
                                    relative aspect-square rounded-xl border-2 transition-all duration-300
                                    flex items-center justify-center cursor-pointer overflow-hidden
                                    ${darkMode
                                        ? 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-750'
                                        : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }
                                    ${selectedIndex === index
                                        ? isCorrect
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500'
                                            : 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500'
                                        : ''
                                    }
                                    ${disabled || isValidated ? 'cursor-not-allowed opacity-60' : 'hover:scale-105 active:scale-95'}
                                    ${hoveredIndex === index && !isValidated ? 'shadow-lg' : 'shadow'}
                                `}
                                whileHover={!isValidated ? { y: -2 } : {}}
                                whileTap={!isValidated ? { scale: 0.95 } : {}}
                            >
                                {renderShape(item, index)}

                                <AnimatePresence>
                                    {selectedIndex === index && isValidated && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-xl"
                                        >
                                            {isCorrect ? (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: 180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <X className="w-7 h-7 text-white" strokeWidth={3} />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {!isCorrect && isValidated && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`text-center mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
                                    }`}
                            >
                                <p className="text-sm font-medium">
                                    {i18n.incorrect || 'Incorrect selection. Try again!'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {attempts >= 3 && !isCorrect && !isValidated && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <button
                                onClick={handleReset}
                                className={`
                                    inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                    transition-colors shadow-sm
                                    ${darkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }
                                `}
                            >
                                <RefreshCcw className="w-4 h-4" />
                                {i18n.tryAgain || 'Try New Pattern'}
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default PatternCaptcha;
