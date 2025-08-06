import { TestAnswer, FatigueScores, FatigueType, TestResult } from '../types';
import { fatigueTypeQuestions, fatigueTypeDescriptions } from '../data/testData';

// Константы для интерпретации результатов теста
const MODERATE_FATIGUE_THRESHOLD = 11;

export const calculateFatigueScores = (answers: TestAnswer[]): FatigueScores => {
    const scores: FatigueScores = {
        physical: 0,
        emotional: 0,
        cognitive: 0,
        social: 0,
        achievement: 0,
        caregiving: 0,
        anxiety: 0,
        hormonal: 0,
        chronicFatigue: 0
    };

    // Создаем карту ответов для быстрого поиска
    const answerMap = new Map<number, number>();
    answers.forEach(answer => {
        answerMap.set(answer.questionId, answer.score);
    });

    // Подсчитываем баллы для каждого типа усталости
    Object.entries(fatigueTypeQuestions).forEach(([type, questionIds]) => {
        const totalScore = questionIds.reduce((sum, questionId) => {
            return sum + (answerMap.get(questionId) || 0);
        }, 0);
        scores[type as keyof FatigueScores] = totalScore;
    });

    return scores;
};

export const getDominantFatigueTypes = (scores: FatigueScores, maxCount: number = 3): FatigueType[] => {
    // Преобразуем баллы в массив с типами
    const typesWithScores = Object.entries(scores).map(([typeKey, score]) => {
        const typeDescription = fatigueTypeDescriptions[typeKey as keyof FatigueScores];
        return {
            ...typeDescription,
            score
        };
    });

    // Сортируем по убыванию баллов и берем только значимые (>= 11 баллов)
    const significantTypes = typesWithScores
        .filter(item => item.score >= MODERATE_FATIGUE_THRESHOLD) // Умеренная усталость начинается с 11 баллов
        .sort((a, b) => b.score - a.score)
        .slice(0, maxCount);

    return significantTypes;
};

export const getScoreInterpretation = (score: number): string => {
    if (score <= 10) return 'Норма';
    if (score <= 20) return 'Умеренная усталость';
    return 'Выраженная усталость';
};

export const shuffleQuestions = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const createTestResult = (answers: TestAnswer[]): Omit<TestResult, 'id'> => {
    const fatigueScores = calculateFatigueScores(answers);
    const dominantTypes = getDominantFatigueTypes(fatigueScores);

    return {
        completedAt: new Date(),
        answers,
        fatigueScores,
        dominantTypes
    };
};

export const formatTestDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const getHighRiskTypes = (dominantTypes: FatigueType[]): string[] => {
    const highRiskTypes = ['chronicFatigue', 'hormonal'];
    return dominantTypes
        .filter(type => highRiskTypes.includes(type.type) && type.score > 15)
        .map(type => type.name);
};

export const shouldShowMedicalWarning = (dominantTypes: FatigueType[]): boolean => {
    return getHighRiskTypes(dominantTypes).length > 0;
};