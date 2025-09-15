# Настройка VK ID

Система авторизации обновлена с устаревшей VK OAuth API на современную **VK ID** с поддержкой PKCE.

## Что изменилось

### ✅ Обновления:
- **VK OAuth** → **VK ID** (современный API)
- Добавлена поддержка **PKCE** для безопасности
- Обмен кода происходит на бэкенде (рекомендуемый подход)
- Обновлены endpoints на `id.vk.com`
- Поддержка токенов обновления (refresh tokens)

### 🔧 Технические улучшения:
- Более безопасная авторизация с PKCE
- Поддержка `phone` и `email` scopes
- Автоматическая генерация `device_id`
- Улучшенная обработка ошибок

## Настройка приложения VK ID

### 1. Создание приложения
1. Перейдите на [id.vk.com](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/start-integration)
2. Создайте новое приложение VK ID
3. Укажите redirect URI: `http://localhost:3000/api/auth/callback/vkid`

### 2. Получение учетных данных
После создания приложения получите:
- **Client ID** (публичный идентификатор)
- **Client Secret** (опциональный, для серверных приложений)

### 3. Обновление переменных окружения
```bash
# .env
AUTH_VKID_CLIENT_ID="ваш-client-id"
AUTH_VKID_CLIENT_SECRET="ваш-client-secret"  # опционально
```

### 4. Настройка редиректов
В панели VK ID добавьте redirect URI:
- **Для разработки**: `http://localhost:3000/api/auth/callback/vkid`  
- **Для продакшена**: `https://yourdomain.com/api/auth/callback/vkid`

## Технические детали

### Используемый метод авторизации:
**"Без SDK с обменом кода на бэкенде"** - самый безопасный подход согласно документации VK ID.

### Endpoints:
- **Authorization**: `https://id.vk.com/authorize`
- **Token Exchange**: `https://id.vk.com/oauth2/auth`  
- **User Info**: `https://id.vk.com/oauth2/user_info`

### Безопасность:
- ✅ PKCE (Proof Key for Code Exchange)
- ✅ State parameter для защиты от CSRF
- ✅ Secure token exchange на бэкенде
- ✅ Короткое время жизни access tokens (1 час)

### Scopes:
- `phone` - доступ к номеру телефона
- `email` - доступ к email адресу

## Миграция с старого VK OAuth

Если у вас была настроена старая VK OAuth авторизация:

1. **Создайте новое VK ID приложение** (старые VK приложения не поддерживают VK ID)
2. **Обновите переменные окружения** (см. выше)
3. **Код уже обновлен** - изменения применены автоматически

## Тестирование

1. Запустите приложение: `npm run dev`
2. Перейдите на страницу входа: http://localhost:3000/auth/signin
3. Нажмите кнопку "Войти через VK"
4. Должен открыться интерфейс VK ID для авторизации

## Устранение проблем

### Ошибка "invalid_client"
- Проверьте правильность `AUTH_VKID_CLIENT_ID`
- Убедитесь, что приложение создано в VK ID (не в VK Apps)

### Ошибка "invalid_redirect_uri"  
- Добавьте точный redirect URI в настройки VK ID приложения
- Проверьте протокол (http/https) и порт

### Ошибка "invalid_scope"
- VK ID поддерживает ограниченный набор scopes
- Используйте только `phone` и/или `email`

## Дополнительная информация

- [Документация VK ID](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/start-integration)
- [Настройка приложения VK ID](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/start-integration/app-setup)