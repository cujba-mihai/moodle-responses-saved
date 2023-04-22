// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import { parseQuestions } from '../../utils/parseQuetions';
import { getMongoDb } from '../../utils/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handler = nextConnect();

handler
  .use(upload.single('file'))
  .post(async (req, res) => {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const fileContent = file.buffer.toString('utf-8');
      const questions = parseQuestions(fileContent);
      const db = await getMongoDb();

      if (!db) {
        return res.status(500).json({ message: 'Could not connect to database.'})
      }

      await db.collection('questions').insertMany(questions);

      res
        .status(200)
        .json({ message: 'File uploaded and parsed successfully.' });
    } catch (error) {
      console.error('Error:', error);
      res
        .status(500)
        .json({ error: `Error parsing file: ${error.message}` });
    }
  });

export default handler;
