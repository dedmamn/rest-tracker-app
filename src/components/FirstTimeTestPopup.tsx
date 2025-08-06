import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Card,
    CardContent
} from '@mui/material';
import { Psychology, Close, QuestionAnswer } from '@mui/icons-material';

interface FirstTimeTestPopupProps {
    open: boolean;
    onStartTest: () => void;
    onSkip: () => void;
}

const FirstTimeTestPopup: React.FC<FirstTimeTestPopupProps> = ({ 
    open, 
    onStartTest, 
    onSkip 
}) => {
    return (
        <Dialog 
            open={open} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 3,
                    textAlign: 'center'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Avatar 
                    sx={{ 
                        width: 64, 
                        height: 64, 
                        bgcolor: 'primary.main', 
                        mx: 'auto', 
                        mb: 2 
                    }}
                >
                    <Psychology sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Добро пожаловать!
                </Typography>
            </DialogTitle>
            
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Для персонализированных рекомендаций по отдыху рекомендуем пройти 
                    короткий тест на определение типов усталости.
                </Typography>

                <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <QuestionAnswer />
                            <Typography variant="h6" component="div">
                                Что даст тест?
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'left' }}>
                            • Определение ваших доминирующих типов усталости<br/>
                            • Персональные рекомендации по восстановлению<br/>
                            • Готовые активности для календаря отдыха<br/>
                            • Понимание причин вашей усталости
                        </Typography>
                    </CardContent>
                </Card>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    gap: 2,
                    bgcolor: 'background.default',
                    p: 2,
                    borderRadius: 2
                }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Время:</strong> 5-10 минут
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Вопросов:</strong> 40
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Можно пересдать:</strong> в любое время
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 2 }}>
                <Button 
                    onClick={onSkip} 
                    variant="outlined"
                    startIcon={<Close />}
                >
                    Пропустить
                </Button>
                <Button 
                    onClick={onStartTest} 
                    variant="contained"
                    size="large"
                    startIcon={<Psychology />}
                >
                    Пройти тест
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FirstTimeTestPopup;