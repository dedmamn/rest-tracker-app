import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, List, Settings } from '@mui/icons-material';

const Navigation: React.FC = () => {
    const location = useLocation();
    
    const getActiveIndex = () => {
        switch (location.pathname) {
            case '/': return 0;
            case '/activities': return 1;
            case '/settings': return 2;
            default: return 0;
        }
    };

    return (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1000,
                borderRadius: '20px 20px 0 0',
                boxShadow: (theme) => `0 -2px 20px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                bgcolor: 'background.paper'
            }} 
            elevation={3}
        >
            <BottomNavigation 
                value={getActiveIndex()} 
                sx={{
                    borderRadius: '20px 20px 0 0',
                    paddingTop: '8px',
                    paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
                    minHeight: '70px',
                    bgcolor: 'transparent'
                }}
            >
                <BottomNavigationAction 
                    label="Главная" 
                    icon={<Home />}
                    component={Link}
                    to="/"
                    sx={{
                        '&.Mui-selected': {
                            color: 'primary.main'
                        }
                    }}
                />
                <BottomNavigationAction 
                    label="Активности" 
                    icon={<List />}
                    component={Link}
                    to="/activities"
                    sx={{
                        '&.Mui-selected': {
                            color: 'primary.main'
                        }
                    }}
                />
                <BottomNavigationAction 
                    label="Настройки" 
                    icon={<Settings />}
                    component={Link}
                    to="/settings"
                    sx={{
                        '&.Mui-selected': {
                            color: 'primary.main'
                        }
                    }}
                />
            </BottomNavigation>
        </Paper>
    );
};

export default Navigation;
