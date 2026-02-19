import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Alert,
    Divider,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fab
} from '@mui/material';
import { 
    Close, 
    CheckCircle, 
    ExpandMore, 
    Psychology, 
    LocalHospital,
    Spa,
    Download,
    Add
} from '@mui/icons-material';
import { FatigueType, TestResult, Activity, ActivityType } from '../types';
import { getScoreInterpretation, shouldShowMedicalWarning, formatTestDate } from '../utils/testUtils';
import { getActivityTypeByName } from '../utils/helpers';

interface TestResultsProps {
    open: boolean;
    onClose: () => void;
    testResult: TestResult;
    onAddActivitiesToCalendar?: (activities: Partial<Activity>[]) => void;
}

const TestResults: React.FC<TestResultsProps> = ({ 
    open, 
    onClose, 
    testResult,
    onAddActivitiesToCalendar 
}) => {
    const [expandedType, setExpandedType] = useState<string | false>(false);
    const { dominantTypes, fatigueScores, completedAt } = testResult;

    const handleAccordionChange = (panel: string) => (
        event: React.SyntheticEvent, 
        isExpanded: boolean
    ) => {
        setExpandedType(isExpanded ? panel : false);
    };

    const getScoreColor = (score: number) => {
        if (score <= 10) return 'success';
        if (score <= 20) return 'warning';
        return 'error';
    };

    const handleAddRecommendationsToCalendar = () => {
        if (!onAddActivitiesToCalendar) return;

        const recommendedActivities: Partial<Activity>[] = dominantTypes.flatMap(type => 
            type.restActivities.slice(0, 3).map(activityName => ({
                name: activityName,
                description: `Рекомендовано для восстановления от ${type.name.toLowerCase()}`,
                type: getActivityTypeByName(activityName),
                duration: 30,
                isActive: true,
                createdAt: new Date(),
                completedDates: []
            }))
        );

        onAddActivitiesToCalendar(recommendedActivities);
    };

    const exportResults = () => {
        const resultsText = `
РЕЗУЛЬТАТЫ ТЕСТА НА УСТАЛОСТЬ
Дата прохождения: ${formatTestDate(completedAt)}

ДОМИНИРУЮЩИЕ ТИПЫ УСТАЛОСТИ:
${dominantTypes.map((type, index) => `
${index + 1}. ${type.name} (${type.score} баллов - ${getScoreInterpretation(type.score)})

${type.description}

${type.solutions}

Рекомендованные виды отдыха:
${type.restActivities.map(activity => `• ${activity}`).join('\n')}
`).join('\n---\n')}

ПОЛНЫЕ РЕЗУЛЬТАТЫ ПО ВСЕМ ТИПАМ:
${Object.entries(fatigueScores).map(([type, score]) => 
    `${type}: ${score} баллов (${getScoreInterpretation(score)})`
).join('\n')}

${shouldShowMedicalWarning(dominantTypes) ? 
`⚠️ ВАЖНО: Для типов усталости СХУ и гормональная усталость с высокими баллами (>15) требуется консультация врача.` : 
''
}

Ключевое правило: Если симптомы длятся > 2 месяцев и мешают жить — обратитесь к врачу (терапевт, эндокринолог, невролог) или психотерапевту. Усталость — не ваша вина, но ваша ответственность. Начните с малого: выберите 1–2 пункта из рекомендаций и внедряйте их 21 день. Тело и психика скажут спасибо! 💫
        `.trim();

        const blob = new Blob([resultsText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `результаты-теста-усталости-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md" 
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
                <CheckCircle color="success" />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                        Результаты теста
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatTestDate(completedAt)}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <DialogContent>
                {/* Медицинское предупреждение */}
                {shouldShowMedicalWarning(dominantTypes) && (
                    <Alert 
                        severity="warning" 
                        icon={<LocalHospital />} 
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Важно: Для СХУ и гормональной усталости с высокими баллами (&gt;15) требуется консультация врача.
                        </Typography>
                    </Alert>
                )}

                {/* Основные результаты */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Psychology color="primary" />
                        Ваши доминирующие типы усталости
                    </Typography>
                    
                    {dominantTypes.length === 0 ? (
                        <Alert severity="success">
                            <Typography variant="body1">
                                🎉 Отличные новости! У вас не выявлено значимых признаков усталости. 
                                Продолжайте поддерживать здоровый образ жизни и регулярный отдых.
                            </Typography>
                        </Alert>
                    ) : (
                        <Box sx={{ space: 2 }}>
                            {dominantTypes.map((type, index) => (
                                <Card 
                                    key={type.type}
                                    sx={{ 
                                        mb: 2,
                                        border: index === 0 ? 2 : 1,
                                        borderColor: index === 0 ? 'primary.main' : 'divider'
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {index + 1}. {type.name}
                                            </Typography>
                                            <Chip 
                                                label={`${type.score} баллов`}
                                                color={getScoreColor(type.score)}
                                                variant="filled"
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {getScoreInterpretation(type.score)}
                                            </Typography>
                                        </Box>
                                        
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((type.score / 40) * 100, 100)}
                                            sx={{ mb: 2, height: 8, borderRadius: 4 }}
                                            color={getScoreColor(type.score)}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Подробные описания и рекомендации */}
                {dominantTypes.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Spa color="primary" />
                            Подробные рекомендации
                        </Typography>
                        
                        {dominantTypes.map((type, index) => (
                            <Accordion
                                key={type.type}
                                expanded={expandedType === type.type}
                                onChange={handleAccordionChange(type.type)}
                                sx={{ mb: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                        backgroundColor: index === 0 ? 'primary.light' : 'background.default',
                                        '& .MuiAccordionSummary-content': {
                                            alignItems: 'center'
                                        }
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {type.name}
                                    </Typography>
                                    <Chip 
                                        label={getScoreInterpretation(type.score)}
                                        size="small"
                                        color={getScoreColor(type.score)}
                                        sx={{ ml: 2 }}
                                    />
                                </AccordionSummary>
                                
                                <AccordionDetails>
                                    <Box sx={{ space: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                                            {type.description}
                                        </Typography>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                                            {type.solutions}
                                        </Typography>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                            Рекомендованные виды отдыха:
                                        </Typography>
                                        <List dense>
                                            {type.restActivities.map((activity, actIndex) => (
                                                <ListItem key={actIndex} disablePadding>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <Spa fontSize="small" color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={activity} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                )}

                {/* Все результаты */}
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Полные результаты по всем типам
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 1 }}>
                        {Object.entries(fatigueScores).map(([type, score]) => (
                            <Box 
                                key={type}
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    p: 1,
                                    bgcolor: 'background.default',
                                    borderRadius: 1
                                }}
                            >
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {type}
                                </Typography>
                                <Chip 
                                    label={`${score} б.`}
                                    size="small"
                                    color={getScoreColor(score)}
                                    variant="outlined"
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1, flexWrap: 'wrap', gap: 1 }}>
                <Button 
                    onClick={exportResults}
                    startIcon={<Download />}
                    variant="outlined"
                >
                    Экспорт результатов
                </Button>
                
                {onAddActivitiesToCalendar && dominantTypes.length > 0 && (
                    <Button 
                        onClick={handleAddRecommendationsToCalendar}
                        startIcon={<Add />}
                        variant="outlined"
                        color="primary"
                    >
                        Добавить рекомендации в календарь
                    </Button>
                )}
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Button onClick={onClose} variant="contained">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TestResults;