#ModiCore Bot


## Quick start
1. Copy `.env.example` -> `.env` and fill values.
2. `npm install`
3. `npm run deploy` — registers global slash commands (may take up to 1 hour to appear globally).
4. `npm start` or `npm run dev`


## Notes
- Slash commands are registered globally (change in `deploy-commands.js` if you prefer guild-scoped).
- Groq usage: be mindful of quota and cost; scanning many messages costs tokens.
- Punishment levels: configured in `utils/modLogger.js` (warn thresholds).