# FragPunk Hub

Русскоязычный информационный портал по FragPunk.

Сайт работает на Cloudflare Workers, использует D1 для материалов и защищённую страницу `/admin` для редактирования.

## Развёртывание

```bash
npm ci
npm run deploy
```

Перед первым входом в админку добавьте секреты `ADMIN_PASSWORD` и `ADMIN_SESSION_SECRET` в настройках Cloudflare Worker.
