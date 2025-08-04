import { ActivityType } from '../types';

export interface PredefinedActivity {
    name: string;
    description?: string;
    duration?: number; // в минутах
}

export const PREDEFINED_ACTIVITIES: Record<ActivityType, PredefinedActivity[]> = {
    [ActivityType.PHYSICAL]: [
        { name: 'Бег/велосипед (низкая интенсивность)', duration: 30 },
        { name: 'Глубокий сон', duration: 480 },
        { name: 'Здоровая еда (сбалансированное питание)', duration: 30 },
        { name: 'Йога/стретчинг', duration: 20 },
        { name: 'Легкая ходьба', duration: 30 },
        { name: 'Скандинавская ходьба', duration: 45 },
        { name: 'Массаж/самомассаж', duration: 15 },
        { name: 'Плавание', duration: 30 },
        { name: 'Сауна/баня', duration: 60 },
        { name: 'Сон по циркадным ритмам', duration: 480 },
        { name: 'Тепло на живот (грелка)', duration: 20 },
        { name: 'Теплые ванны', duration: 30 },
        { name: 'Умеренные силовые тренировки', duration: 45 },
        { name: 'Self-care ритуалы (физический аспект)', duration: 15 }
    ],
    [ActivityType.MENTAL]: [
        { name: 'Короткие перерывы (техника Pomodoro)', duration: 5 },
        { name: 'Легкое чтение', duration: 30 },
        { name: 'Медитация/дыхание 4-7-8', duration: 10 },
        { name: 'Осознанное ничегонеделание', duration: 15 },
        { name: 'Решение головоломок', duration: 20 },
        { name: 'Сбор пазлов', duration: 60 },
        { name: 'Цифровой детокс (информационный аспект)', duration: 120 }
    ],
    [ActivityType.EMOTIONAL]: [
        { name: 'Акты доброты', duration: 15 },
        { name: 'Арт-терапия', duration: 45 },
        { name: 'Ведение дневника чувств', duration: 20 },
        { name: 'Дневник самосострадания', duration: 15 },
        { name: 'Крик-терапия', duration: 10 },
        { name: 'Мотивационные ролики', duration: 15 },
        { name: 'Практики прощения', duration: 20 },
        { name: 'Просмотр легких фильмов', duration: 90 },
        { name: 'Спонтанные удовольствия', duration: 30 },
        { name: '"Запретная" радость', duration: 20 }
    ],
    [ActivityType.SOCIAL]: [
        { name: 'Волонтерство', duration: 120 },
        { name: 'Гастротуры (групповые)', duration: 180 },
        { name: 'Игры с доверенной группой', duration: 60 },
        { name: 'Позитивные соцсети', duration: 15 },
        { name: 'Просьба о помощи', duration: 10 },
        { name: 'Соло-активности (в общественных местах)', duration: 60 },
        { name: 'День тишины (отдых от общения)', duration: 480 }
    ],
    [ActivityType.SENSORY]: [
        { name: 'ASMR/релакс-музыка', duration: 20 },
        { name: 'Монотонные действия', duration: 30 },
        { name: 'Отключение уведомлений', duration: 60 },
        { name: 'Практики осознанного восприятия', duration: 15 },
        { name: 'Природа', duration: 60 },
        { name: 'Прогулки на рассвете/закате', duration: 30 },
        { name: 'Сеансы в темноте', duration: 20 },
        { name: 'Снижение яркости экранов', duration: 30 },
        { name: 'Спокойная музыка', duration: 20 },
        { name: 'Тишина', duration: 15 }
    ],
    [ActivityType.SPIRITUAL]: [
        { name: 'Йога-нидра (духовный аспект)', duration: 30 },
        { name: 'Наблюдение за звездами', duration: 60 },
        { name: 'Практики благодарности', duration: 10 },
        { name: 'Ретриты/паломничество', duration: 480 },
        { name: 'Уникальные места', duration: 120 },
        { name: 'Чтение духовной литературы', duration: 30 },
        { name: 'Медитация (духовный аспект)', duration: 20 }
    ],
    [ActivityType.CREATIVE]: [
        { name: 'Игра на музыкальных инструментах', duration: 30 },
        { name: 'Игры без цели', duration: 45 },
        { name: 'Посещение выставок/концертов', duration: 120 },
        { name: 'Рукоделие', duration: 60 },
        { name: 'Фотография', duration: 60 },
        { name: '"Ленивое" хобби (творческие аспекты)', duration: 45 }
    ],
    // Сохраняем существующие категории для совместимости
    [ActivityType.OUTDOOR]: [
        { name: 'Прогулка в парке', duration: 30 },
        { name: 'Пикник на природе', duration: 120 },
        { name: 'Наблюдение за природой', duration: 45 },
        { name: 'Садоводство', duration: 60 }
    ],
    [ActivityType.PASSIVE]: [
        { name: 'Просмотр фильма', duration: 120 },
        { name: 'Слушание музыки', duration: 30 },
        { name: 'Отдых лежа', duration: 30 },
        { name: 'Расслабление', duration: 20 }
    ]
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
    [ActivityType.PHYSICAL]: 'Физический отдых',
    [ActivityType.MENTAL]: 'Ментальный отдых',
    [ActivityType.EMOTIONAL]: 'Эмоциональный отдых',
    [ActivityType.SOCIAL]: 'Социальный отдых',
    [ActivityType.SENSORY]: 'Сенсорный отдых',
    [ActivityType.SPIRITUAL]: 'Духовный отдых',
    [ActivityType.CREATIVE]: 'Творческий отдых',
    [ActivityType.OUTDOOR]: 'На свежем воздухе',
    [ActivityType.PASSIVE]: 'Пассивный отдых'
};