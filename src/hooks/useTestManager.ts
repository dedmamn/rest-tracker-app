import { useState, useCallback } from 'react';
import { TestAnswer, TestResult, Settings, Activity, ActivityType } from '../types';
import { createTestResult } from '../utils/testUtils';

interface UseTestManagerProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    addActivity?: (activity: Omit<Activity, 'id'>) => void;
}

interface UseTestManagerReturn {
    isTestModalOpen: boolean;
    isResultsModalOpen: boolean;
    currentTestResult: TestResult | null;
    testHistory: TestResult[];
    shouldShowFirstTimePopup: boolean;
    openTestModal: () => void;
    closeTestModal: () => void;
    openResultsModal: (result: TestResult) => void;
    closeResultsModal: () => void;
    completeTest: (answers: TestAnswer[]) => void;
    markFirstTestCompleted: () => void;
    addRecommendedActivities: (activities: Partial<Activity>[]) => void;
}

export const useTestManager = ({ 
    settings, 
    setSettings, 
    addActivity 
}: UseTestManagerProps): UseTestManagerReturn => {
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);

    const testHistory = settings.testSettings.testHistory;
    const shouldShowFirstTimePopup = !settings.testSettings.hasCompletedFirstTest && 
                                   settings.testSettings.showTestReminderPopup;

    const openTestModal = useCallback(() => {
        setIsTestModalOpen(true);
    }, []);

    const closeTestModal = useCallback(() => {
        setIsTestModalOpen(false);
    }, []);

    const openResultsModal = useCallback((result: TestResult) => {
        setCurrentTestResult(result);
        setIsResultsModalOpen(true);
    }, []);

    const closeResultsModal = useCallback(() => {
        setIsResultsModalOpen(false);
        setCurrentTestResult(null);
    }, []);

    const completeTest = useCallback((answers: TestAnswer[]) => {
        const testResultData = createTestResult(answers);
        const testResult: TestResult = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...testResultData
        };

        // Сохраняем результат в историю
        setSettings(prev => ({
            ...prev,
            testSettings: {
                ...prev.testSettings,
                hasCompletedFirstTest: true,
                showTestReminderPopup: false,
                testHistory: [testResult, ...prev.testSettings.testHistory]
            }
        }));

        // Закрываем тест и показываем результаты
        setIsTestModalOpen(false);
        openResultsModal(testResult);
    }, [setSettings, openResultsModal]);

    const markFirstTestCompleted = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            testSettings: {
                ...prev.testSettings,
                hasCompletedFirstTest: true,
                showTestReminderPopup: false
            }
        }));
    }, [setSettings]);

    const addRecommendedActivities = useCallback((activities: Partial<Activity>[]) => {
        if (!addActivity) return;

        activities.forEach(activityData => {
            // Определяем тип активности на основе названия
            let activityType: ActivityType = ActivityType.PHYSICAL;
            const name = activityData.name?.toLowerCase() || '';
            
            if (name.includes('дневник') || name.includes('терапия') || name.includes('эмоци')) {
                activityType = ActivityType.EMOTIONAL;
            } else if (name.includes('медитация') || name.includes('чтение') || name.includes('детокс')) {
                activityType = ActivityType.MENTAL;
            } else if (name.includes('общение') || name.includes('социальн') || name.includes('волонтер')) {
                activityType = ActivityType.SOCIAL;
            } else if (name.includes('творчество') || name.includes('арт') || name.includes('музык')) {
                activityType = ActivityType.CREATIVE;
            } else if (name.includes('природа') || name.includes('прогулк') || name.includes('лес')) {
                activityType = ActivityType.OUTDOOR;
            } else if (name.includes('сон') || name.includes('отдых') || name.includes('релакс')) {
                activityType = ActivityType.PASSIVE;
            } else if (name.includes('звезды') || name.includes('духовн') || name.includes('ретрит')) {
                activityType = ActivityType.SPIRITUAL;
            } else if (name.includes('массаж') || name.includes('ванна') || name.includes('ASMR')) {
                activityType = ActivityType.SENSORY;
            }

            const newActivity: Omit<Activity, 'id'> = {
                type: activityType,
                name: activityData.name || 'Рекомендованная активность',
                description: activityData.description || 'Импортировано из результатов теста на усталость',
                duration: activityData.duration || 30,
                isActive: true,
                createdAt: new Date(),
                completedDates: [],
                recurrence: {
                    frequency: 'weekly',
                    interval: 1,
                    daysOfWeek: [1, 3, 5] // Понедельник, среда, пятница
                }
            };

            addActivity(newActivity);
        });
    }, [addActivity]);

    return {
        isTestModalOpen,
        isResultsModalOpen,
        currentTestResult,
        testHistory,
        shouldShowFirstTimePopup,
        openTestModal,
        closeTestModal,
        openResultsModal,
        closeResultsModal,
        completeTest,
        markFirstTestCompleted,
        addRecommendedActivities
    };
};