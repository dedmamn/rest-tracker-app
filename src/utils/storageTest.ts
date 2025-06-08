// Тестовый файл для проверки работы localStorage
export const testLocalStorage = () => {
    const testKey = 'rest-tracker-test';
    const testData = { test: true, timestamp: Date.now() };
    
    try {
        // Сохраняем тестовые данные
        localStorage.setItem(testKey, JSON.stringify(testData));
        console.log('✅ Тест сохранения в localStorage прошел успешно');
        
        // Загружаем тестовые данные
        const loaded = localStorage.getItem(testKey);
        if (loaded) {
            const parsedData = JSON.parse(loaded);
            console.log('✅ Тест загрузки из localStorage прошел успешно:', parsedData);
            
            // Очищаем тестовые данные
            localStorage.removeItem(testKey);
            console.log('✅ Тест очистки localStorage прошел успешно');
            
            return true;
        } else {
            console.error('❌ Данные не были сохранены в localStorage');
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка при работе с localStorage:', error);
        return false;
    }
};

// Проверяем все ключи в localStorage
export const debugLocalStorage = () => {
    console.log('=== Отладка localStorage ===');
    console.log('Количество ключей:', localStorage.length);
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const value = localStorage.getItem(key);
            console.log(`Ключ: ${key}, Размер: ${value?.length || 0} символов`);
            
            // Показываем содержимое для наших ключей
            if (key.startsWith('rest-tracker')) {
                try {
                    const parsed = JSON.parse(value || '{}');
                    console.log(`Содержимое ${key}:`, parsed);
                } catch (e) {
                    console.log(`Содержимое ${key} (строка):`, value);
                }
            }
        }
    }
    console.log('=== Конец отладки ===');
};
