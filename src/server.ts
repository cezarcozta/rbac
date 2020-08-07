import 'reflect-metadata';
import 'dotenv/config';

import express from 'express'
import cors from 'cors';

import './database';

import uploadConfig from './config/upload';

import router from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(router);

app.listen(3333, () => {
  console.log('Server started on 3333');
});