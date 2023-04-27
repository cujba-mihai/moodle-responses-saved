import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';

import iconv from 'iconv-lite';
import jschardet from 'jschardet';

function decodeText(text) {
  const detectedEncoding = jschardet.detect(text);
  if (detectedEncoding.encoding !== 'utf-8' && detectedEncoding.encoding !== 'ascii') {
    return iconv.decode(Buffer.from(text, 'binary'), detectedEncoding.encoding);
  }
  return text;
}

const diacriticsMap = {
    a: '[aăâ]',
    i: '[iîâ]',
    s: '[sș]',
    t: '[tț]',
};

const escapeRegex = (str) => {
    return str.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
};


const handler = nextConnect();


handler.post(async (req, res) => {
    const db = await getMongoDb();
    const question = 'Conform ISO, toate sistemele de management/SM utilizeaza principiul PDCA.';
    const normalizedText = question.normalize().trim();
    const words = normalizedText.split(/\s+/);

    const regexQueries = words.map((word) => {
        const escapedWord = escapeRegex(word);
        const replacedWord = escapedWord.replace(/[aist]/gi, (match) => {
            const lowerCaseMatch = match.toLowerCase();
            return diacriticsMap[lowerCaseMatch] || match;
        });
        return { question: { $regex: replacedWord, $options: 'i' } };
    });
    const query = { $and: regexQueries };
    const questions = await db.collection('questions').find(query).toArray();
  
    await Promise.all(
      questions.map(async (question) => {
        question.question = decodeText(question.question);
  
        if (question.choices) {
          question.choices.forEach((choice) => {
            if (choice.label) {
              choice.label = decodeText(choice.label);
            }
  
            if (choice.value) {
              choice.value = decodeText(choice.value);
            }
          });
        }
  
        await db.collection('questions').updateOne(
          { _id: question._id },
          { $set: { question: question.question, choices: question.choices } }
        );
      })
    );
  
    res.status(200).json({ message: `Updated ${questions.length} documents with corrected encoding` });
  });
  

export default handler;
