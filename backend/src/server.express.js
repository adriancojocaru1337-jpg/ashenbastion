import { createExpressApp } from './app/expressApp.js';
const app = createExpressApp();
const port = process.env.PORT || 3001;
app.listen(port, ()=>console.log(`Express API listening on http://localhost:${port}`));
