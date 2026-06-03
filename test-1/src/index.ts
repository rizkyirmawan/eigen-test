import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { swaggerRouter } from './api-docs/swagger';
import { bookRouter } from './api/books/bookRouter';
import { memberRouter } from './api/members/memberRouter';
import { borrowRouter } from './api/borrow/borrowRouter';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(swaggerRouter);
app.use('/books', bookRouter);
app.use('/members', memberRouter);
app.use('/borrow', borrowRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});

export default app;
