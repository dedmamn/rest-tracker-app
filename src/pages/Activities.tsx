import React, { useState } from 'react';
import {
    Box,
    Typography,
    Fab,
    Grid,
    Tabs,
    Tab,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    Add,
    Search,
    FilterList,
    Sort
} from '@mui/icons-material';
import { Activity, ActivityType } from '../types';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';

interface ActivitiesProps {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const Activities: React.FC<ActivitiesProps> = ({ activities, setActivities }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
    const [sortBy, setSortBy] = useState<'name' | 'created' | 'completed'>('created');

    const handleCompleteActivity = (activityId: string) => {
        setActivities(prev => prev.map(activity => 
            activity.id === activityId 
                ? {
                    ...activity,
                    completedDates: [...activity.completedDates, new Date()]
                }
                : activity
        ));
    };

    const handleEditActivity = (activity: Activity) => {
        setEditingActivity(activity);
        setIsFormOpen(true);
    };

    const handleDeleteActivity = (activityId: string) => {
        setActivities(prev => prev.filter(activity => activity.id !== activityId));
    };

    const handleAddActivity = (newActivity: Activity) => {
        if (editingActivity) {
            setActivities(prev => prev.map(activity => 
                activity.id === editingActivity.id ? newActivity : activity
            ));
        } else {
            setActivities(prev => [...prev, newActivity]);
        }
        setEditingActivity(undefined);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingActivity(undefined);
    };

    // Фильтрация и сортировка активностей
    const getFilteredActivities = () => {
        let filtered = activities.filter(activity => {
            // Фильтр по статусу (активные/архивные)
            if (activeTab === 0 && !activity.isActive) return false;
            if (activeTab === 1 && activity.isActive) return false;
            
            // Поиск по названию и описанию
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = activity.name.toLowerCase().includes(query);
                const matchesDescription = activity.description?.toLowerCase().includes(query);
                if (!matchesName && !matchesDescription) return false;
            }
            
            // Фильтр по типам
            if (selectedTypes.length > 0 && !selectedTypes.includes(activity.type)) {
                return false;
            }
            
            return true;
        });

        // Сортировка
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'completed':
                    const aLastCompleted = a.completedDates.length > 0 ? 
                        Math.max(...a.completedDates.map(d => new Date(d).getTime())) : 0;
                    const bLastCompleted = b.completedDates.length > 0 ? 
                        Math.max(...b.completedDates.map(d => new Date(d).getTime())) : 0;
                    return bLastCompleted - aLastCompleted;
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const filteredActivities = getFilteredActivities();
    const activeActivities = activities.filter(a => a.isActive);
    const archivedActivities = activities.filter(a => !a.isActive);

    const activityTypeLabels = {
        [ActivityType.PHYSICAL]: 'Физическая',
        [ActivityType.MENTAL]: 'Ментальная',
        [ActivityType.SOCIAL]: 'Социальная',
        [ActivityType.CREATIVE]: 'Творческая',
        [ActivityType.OUTDOOR]: 'На воздухе',
        [ActivityType.PASSIVE]: 'Пассивная'
    };

    const toggleTypeFilter = (type: ActivityType) => {
        setSelectedTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    return (
        <Box sx={{ pb: 10 }}>
            {/* Заголовок с поиском */}
            <AppBar 
                position="sticky" 
                color="transparent" 
                elevation={0}
                sx={{ 
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}
            >
                <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Мои активности
                        </Typography>
                        <Box>
                            <IconButton 
                                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                                color={selectedTypes.length > 0 ? 'primary' : 'default'}
                            >
                                <FilterList />
                            </IconButton>
                            <IconButton onClick={(e) => setSortAnchorEl(e.currentTarget)}>
                                <Sort />
                            </IconButton>
                        </Box>
                    </Box>
                    
                    <TextField
                        placeholder="Поиск активностей..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px' }
                        }}
                    />
                </Toolbar>
            </AppBar>

            <Box sx={{ px: 2 }}>
                {/* Вкладки */}
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 3 }}
                    variant="fullWidth"
                >
                    <Tab label={`Активные (${activeActivities.length})`} />
                    <Tab label={`Архив (${archivedActivities.length})`} />
                </Tabs>

                {/* Фильтры по типам */}
                {selectedTypes.length > 0 && (
                    <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedTypes.map(type => (
                            <Chip
                                key={type}
                                label={activityTypeLabels[type]}
                                onDelete={() => toggleTypeFilter(type)}
                                color="primary"
                                size="small"
                            />
                        ))}
                    </Box>
                )}

                {/* Список активностей */}
                {filteredActivities.length > 0 ? (
                    <Grid container spacing={2}>
                        {filteredActivities.map(activity => (
                            <Grid item xs={12} key={activity.id}>
                                <ActivityCard 
                                    activity={activity}
                                    onComplete={handleCompleteActivity}
                                    onEdit={handleEditActivity}
                                    onDelete={handleDeleteActivity}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {activeTab === 0 ? '🎯 Нет активных активностей' : '📦 Архив пуст'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {activeTab === 0 
                                    ? 'Создайте свою первую активность отдыха'
                                    : 'Здесь будут отображаться архивированные активности'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* FAB для добавления активности */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setIsFormOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 90,
                    right: 16,
                    zIndex: 1000
                }}
            >
                <Add />
            </Fab>

            {/* Меню фильтров */}
            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => setFilterAnchorEl(null)}
            >
                <MenuItem sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    Фильтр по типам:
                </MenuItem>
                {Object.entries(activityTypeLabels).map(([type, label]) => (
                    <MenuItem 
                        key={type}
                        onClick={() => toggleTypeFilter(type as ActivityType)}
                        sx={{ pl: 3 }}
                    >
                        <Chip
                            label={label}
                            size="small"
                            color={selectedTypes.includes(type as ActivityType) ? 'primary' : 'default'}
                            variant={selectedTypes.includes(type as ActivityType) ? 'filled' : 'outlined'}
                        />
                    </MenuItem>
                ))}
            </Menu>

            {/* Меню сортировки */}
            <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => setSortAnchorEl(null)}
            >
                <MenuItem onClick={() => { setSortBy('created'); setSortAnchorEl(null); }}>
                    По дате создания
                </MenuItem>
                <MenuItem onClick={() => { setSortBy('name'); setSortAnchorEl(null); }}>
                    По названию
                </MenuItem>
                <MenuItem onClick={() => { setSortBy('completed'); setSortAnchorEl(null); }}>
                    По последнему выполнению
                </MenuItem>
            </Menu>

            {/* Форма создания/редактирования активности */}
            <ActivityForm 
                open={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleAddActivity}
                editActivity={editingActivity}
            />
        </Box>
    );
};

export default Activities;