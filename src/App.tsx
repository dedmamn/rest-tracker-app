import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import BackupReminder from './components/BackupReminder';
import { Activity, Settings as SettingsType } from './types';
import { StorageManager } from './utils/storage';
import './styles/global.css';
import './styles/responsive.css';

const App = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [settings, setSettings] = useState<SettingsType>({
        notificationsEnabled: true,
        theme: 'light',
        defaultActivityDuration: 30,
        reminderTime: '09:00'
    });

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
    });    // Загрузка данных из localStorage при запуске
    useEffect(() => {
        const loadedData = StorageManager.loadData();
        if (loadedData) {
            setActivities(loadedData.activities);
            setSettings(loadedData.settings);
        }
    }, []);

    // Сохранение данных в localStorage при изменении
    useEffect(() => {
        if (activities.length > 0 || Object.keys(settings).length > 0) {
            StorageManager.saveData(activities, settings);
            
            // Создание резервной копии каждые 10 минут
            const now = new Date();
            const lastBackup = localStorage.getItem('lastBackupTime');
            if (!lastBackup || now.getTime() - new Date(lastBackup).getTime() > 10 * 60 * 1000) {
                StorageManager.createBackup(activities, settings);
                localStorage.setItem('lastBackupTime', now.toISOString());
            }
        }
    }, [activities, settings]);

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
        StorageManager.createBackup(activities, settings);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ 
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    paddingBottom: '80px' // место для нижней навигации
                }}>
                    <BackupReminder 
                        onCreateBackup={handleCreateBackup}
                        activitiesCount={activities.length}
                    />
                    <Container maxWidth="sm" sx={{ padding: 0 }}>
                        <Routes>
                            <Route 
                                path="/" 
                                element={
                                    <Home 
                                        activities={activities} 
                                        setActivities={setActivities}
                                        settings={settings}
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
                                    />
                                } 
                            />
                        </Routes>
                    </Container>
                    <Navigation />
                </Box>
            </Router>
        </ThemeProvider>
    );
};

export default App;
