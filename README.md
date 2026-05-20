# SaitBank — демо банковский сайт

Демо-приложение онлайн-банка на React + TypeScript + Vite + Tailwind CSS.
Все данные хранятся локально в браузере (`localStorage`), бэкенд не требуется.

## Возможности

- Вход и регистрация пользователя (3 готовых демо-аккаунта)
- Дашборд с общим балансом и карточками счетов
- Переводы между клиентами по номеру счёта или email
- Пополнение и снятие средств со счетов
- Обмен валют между своими счетами (демо-курсы)
- История операций с фильтрами и поиском
- Профиль пользователя и сброс демо-данных

## Демо-аккаунты

| Имя | Email | Пароль |
|---|---|---|
| Иван Петров | `demo@saitbank.ru` | `demo1234` |
| Анна Соколова | `anna@saitbank.ru` | `anna1234` |
| Марк Иванов | `mark@saitbank.ru` | `mark1234` |

## Запуск

```bash
npm install
npm run dev      # запуск dev-сервера на http://localhost:5173
npm run build    # сборка production
npm run preview  # предпросмотр production-сборки
npm run lint     # проверка ESLint
```

## Стек

- React 19, TypeScript 6, Vite 8
- React Router v6
- Tailwind CSS 3
- ESLint + typescript-eslint

## Структура

```
src/
├── components/      # переиспользуемые UI-компоненты
├── context/         # BankProvider, useBank hook
├── lib/             # бизнес-логика (банковские операции, localStorage, seed)
├── pages/           # страницы (Login, Dashboard, Transfer, ...)
├── utils/           # форматирование сумм и дат
└── types.ts         # доменные типы
```
