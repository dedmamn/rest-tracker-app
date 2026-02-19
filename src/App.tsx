import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import BackupReminder from './components/BackupReminder';
import TestModal from './components/TestModal';
import TestResults from './components/TestResults';
import FirstTimeTestPopup from './components/FirstTimeTestPopup';
import { useDataManager } from './hooks/useDataManager';
import { useTestManager } from './hooks/useTestManager';
import { useNotifications } from './hooks/useNotifications';
import { testLocalStorage, debugLocalStorage } from './utils/storageTest';
import './styles/global.css';
import './styles/responsive.css';

const App = () => {
    const {
        activities,
        settings,
        setActivities,
        setSettings,
        addActivity,
        createBackup
    } = useDataManager();

    // Инициализация системы уведомлений
    const { sendTestNotification, getNotificationStatus, clearNotifications } = useNotifications({ settings });

    // Инициализация системы тестов
    const {
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
    } = useTestManager({ settings, setSettings, addActivity });

    const theme = createTheme({
        palette: {
            mode: settings.theme,
            primary: {
                main: '#4CAF50',
            },
            secondary: {
                main: '#2196F3',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
    });

    // Тестирование localStorage при запуске (только в development)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Запуск тестов localStorage...');
            testLocalStorage();
            debugLocalStorage();
            
            // Проверка статуса уведомлений
            const notificationStatus = getNotificationStatus();
            console.log('🔔 Статус уведомлений:', notificationStatus);
        }
    }, [getNotificationStatus]);

    // Обновление meta theme-color и data-attribute в зависимости от темы
    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const color = settings.theme === 'dark' ? '#121212' : '#4CAF50';
            metaThemeColor.setAttribute('content', color);
        }
        
        // Добавляем data-attribute для CSS селекторов
        document.documentElement.setAttribute('data-mui-color-scheme', settings.theme);
    }, [settings.theme]);

    const handleCreateBackup = () => {
        createBackup();
    };

    const handleStartFirstTest = () => {
        markFirstTestCompleted();
        openTestModal();
    };

    const handleSkipFirstTest = () => {
        markFirstTestCompleted();
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router basename={process.env.NODE_ENV === 'production' ? "/rest-tracker-app" : ""}>
                <Box sx={{ 
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    paddingBottom: '80px' // место для нижней навигации
                }}>
                    <BackupReminder 
                        onCreateBackup={handleCreateBackup}
                        activitiesCount={activities.length}
                    />
                    <Container maxWidth="sm" sx={{
                        padding: 0,
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <Routes>
                            <Route 
                                path="/" 
                                element={
                                    <Home 
                                        activities={activities} 
                                        setActivities={setActivities}
                                        settings={settings}
                                        onOpenTest={openTestModal}
                                        testHistory={testHistory}
                                    />
                                } 
                            />
                            <Route 
                                path="/rest-tracker-app" 
                                element={
                                    <Home 
                                        activities={activities} 
                                        setActivities={setActivities}
                                        settings={settings}
                                        onOpenTest={openTestModal}
                                        testHistory={testHistory}
                                    />
                                } 
                            />
                            <Route 
                                path="/activities" 
                                element={
                                    <Activities 
                                        activities={activities}
                                        setActivities={setActivities}
                                    />
                                } 
                            />
                            <Route 
                                path="/settings" 
                                element={
                                    <Settings 
                                        settings={settings}
                                        setSettings={setSettings}
                                        activities={activities}
                                        setActivities={setActivities}
                                        testHistory={testHistory}
                                        onOpenTest={openTestModal}
                                        onOpenTestResult={openResultsModal}
                                    />
                                } 
                            />
                        </Routes>
                    </Container>
                    <Navigation />
                    
                    {/* Модальные окна тестов */}
                    <FirstTimeTestPopup 
                        open={shouldShowFirstTimePopup}
                        onStartTest={handleStartFirstTest}
                        onSkip={handleSkipFirstTest}
                    />
                    
                    <TestModal 
                        open={isTestModalOpen}
                        onClose={closeTestModal}
                        onComplete={completeTest}
                    />
                    
                    {currentTestResult && (
                        <TestResults 
                            open={isResultsModalOpen}
                            onClose={closeResultsModal}
                            testResult={currentTestResult}
                            onAddActivitiesToCalendar={addRecommendedActivities}
                        />
                    )}
                </Box>
            </Router>
        </ThemeProvider>
    );
};

export default App;
