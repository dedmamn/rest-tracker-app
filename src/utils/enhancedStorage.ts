// Расширенное хранилище для PWA приложения
export interface StorageData {
  [key: string]: any;
}

export class EnhancedStorage {
  private prefix: string;

  constructor(prefix: string = 'rest-tracker') {
    this.prefix = prefix;
  }

  // Сохранение данных
  save(key: string, data: any): boolean {
    try {
      const fullKey = `${this.prefix}-${key}`;
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0.0'
      });
      localStorage.setItem(fullKey, serializedData);
      return true;
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
      return false;
    }
  }

  // Загрузка данных
  load<T>(key: string, defaultValue?: T): T | null {
    try {
      const fullKey = `${this.prefix}-${key}`;
      const serializedData = localStorage.getItem(fullKey);
      
      if (!serializedData) {
        return defaultValue || null;
      }

      const parsedData = JSON.parse(serializedData);
      return parsedData.data as T;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      return defaultValue || null;
    }
  }

  // Удаление данных
  remove(key: string): boolean {
    try {
      const fullKey = `${this.prefix}-${key}`;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('Ошибка удаления данных:', error);
      return false;
    }
  }

  // Очистка всех данных приложения
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Ошибка очистки данных:', error);
      return false;
    }
  }

  // Получение всех ключей
  getKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(`${this.prefix}-`, ''));
    } catch (error) {
      console.error('Ошибка получения ключей:', error);
      return [];
    }
  }

  // Экспорт данных
  export(): StorageData {
    const exportData: StorageData = {};
    const keys = this.getKeys();
    
    keys.forEach(key => {
      const data = this.load(key);
      if (data !== null) {
        exportData[key] = data;
      }
    });

    return exportData;
  }

  // Импорт данных
  import(data: StorageData): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.save(key, value);
      });
      return true;
    } catch (error) {
      console.error('Ошибка импорта данных:', error);
      return false;
    }
  }
}

// Создание экземпляра по умолчанию
export const enhancedStorage = new EnhancedStorage();

// Экспорт для обратной совместимости
export default enhancedStorage;
