import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
    LinearProgress,
    Chip,
    Alert,
    Divider,
    IconButton
} from '@mui/material';
import { Close, Psychology, NavigateNext, NavigateBefore } from '@mui/icons-material';
import { TestQuestion, TestAnswer } from '../types';
import { testQuestions, testInstructions } from '../data/testData';
import { shuffleQuestions } from '../utils/testUtils';

interface TestModalProps {
    open: boolean;
    onClose: () => void;
    onComplete: (answers: TestAnswer[]) => void;
    showWarning?: boolean;
}

const TestModal: React.FC<TestModalProps> = ({ open, onClose, onComplete, showWarning = true }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<TestAnswer[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<TestQuestion[]>([]);
    const [showInstructions, setShowInstructions] = useState(true);
    const [hasShownWarning, setHasShownWarning] = useState(false);

    // Перемешиваем вопросы при открытии теста
    useEffect(() => {
        if (open) {
            setShuffledQuestions(shuffleQuestions(testQuestions));
            setCurrentQuestionIndex(0);
            setAnswers([]);
            setShowInstructions(true);
            setHasShownWarning(false);
        }
    }, [open]);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

    const handleAnswerChange = (questionId: number, score: number) => {
        setAnswers(prev => {
            const existing = prev.find(a => a.questionId === questionId);
            if (existing) {
                return prev.map(a => 
                    a.questionId === questionId ? { ...a, score } : a
                );
            } else {
                return [...prev, { questionId, score }];
            }
        });
    };

    const getCurrentAnswer = (): number | undefined => {
        return answers.find(a => a.questionId === currentQuestion?.id)?.score;
    };

    const canGoNext = (): boolean => {
        if (!currentQuestion) return false;
        return getCurrentAnswer() !== undefined;
    };

    const handleNext = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Проверяем, что все вопросы отвечены
            const allAnswered = shuffledQuestions.every(q => 
                answers.some(a => a.questionId === q.id)
            );
            
            if (allAnswered) {
                onComplete(answers);
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleClose = () => {
        if (!hasShownWarning && answers.length > 0 && showWarning) {
            setHasShownWarning(true);
            return;
        }
        onClose();
    };

    const handleStartTest = () => {
        setShowInstructions(false);
    };

    const answeredCount = answers.length;
    const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
    const allAnswered = shuffledQuestions.length > 0 && 
        shuffledQuestions.every(q => answers.some(a => a.questionId === q.id));

    if (showInstructions) {
        return (
            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: { 
                        borderRadius: 3,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    pb: 1
                }}>
                    <Psychology color="primary" />
                    <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                        Тест на усталость
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ pb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {testInstructions.title}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                        {testInstructions.instructions}
                    </Typography>

                    <Alert severity="info" sx={{ mb: 2 }}>
                        {testInstructions.warning}
                    </Alert>

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 2,
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Количество вопросов:</strong> {testQuestions.length}
                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body2" color="text.secondary">
                            <strong>Примерное время:</strong> 5-10 мин
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleStartTest} 
                        variant="contained"
                        startIcon={<Psychology />}
                    >
                        Начать тест
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 3,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                pb: 1
            }}>
                <Psychology color="primary" />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                        Тест на усталость
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Вопрос {currentQuestionIndex + 1} из {shuffledQuestions.length}
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <Box sx={{ px: 3 }}>
                <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ height: 6, borderRadius: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Прогресс: {Math.round(progress)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Отвечено: {answeredCount}/{shuffledQuestions.length}
                    </Typography>
                </Box>
            </Box>

            {hasShownWarning && answers.length > 0 && (
                <Alert severity="warning" sx={{ mx: 3, mb: 2 }}>
                    Вы уверены, что хотите прервать тест? Для получения результатов необходимо ответить на все вопросы.
                </Alert>
            )}

            <DialogContent sx={{ pt: 0 }}>
                {currentQuestion && (
                    <Box>
                        <Chip 
                            label={currentQuestion.blockName}
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                        />
                        
                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {currentQuestion.text}
                                </Typography>
                            </FormLabel>
                            
                            <RadioGroup
                                value={getCurrentAnswer()?.toString() || ''}
                                onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                            >
                                {[0, 1, 2, 3, 4, 5].map((score) => (
                                    <FormControlLabel
                                        key={score}
                                        value={score.toString()}
                                        control={<Radio />}
                                        label={
                                            <Typography variant="body2">
                                                <strong>{score}</strong> - {
                                                    score === 0 ? 'Никогда / почти никогда' :
                                                    score === 1 ? 'Редко (1-2 раза)' :
                                                    score === 2 ? 'Иногда (3-4 раза)' :
                                                    score === 3 ? 'Часто' :
                                                    score === 4 ? 'Очень часто' :
                                                    'Постоянно'
                                                }
                                            </Typography>
                                        }
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    startIcon={<NavigateBefore />}
                    variant="outlined"
                >
                    Назад
                </Button>
                
                <Box sx={{ flexGrow: 1 }} />
                
                {hasShownWarning && (
                    <>
                        <Button onClick={() => setHasShownWarning(false)}>
                            Продолжить тест
                        </Button>
                        <Button onClick={onClose} color="error">
                            Прервать тест
                        </Button>
                    </>
                )}
                
                {!hasShownWarning && (
                    <Button 
                        onClick={handleNext}
                        disabled={!canGoNext()}
                        endIcon={isLastQuestion ? undefined : <NavigateNext />}
                        variant="contained"
                    >
                        {isLastQuestion ? 
                            (allAnswered ? 'Получить результаты' : 'Ответьте на все вопросы') : 
                            'Далее'
                        }
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TestModal;