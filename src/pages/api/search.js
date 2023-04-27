import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';
import _ from 'lodash';

const handler = nextConnect()

function removeDiacritics(text) {
  const romanianDiacritics = /ă|â|î|ș|ț|a|i|s|t|\W/gi;
  return text.replace(romanianDiacritics, '.');
}


handler.get(async (req, res) => {
    const { question, offset, limit } = req.query;
    const normalizedText = removeDiacritics(question.normalize().trim());

    const db = await getMongoDb();
    const totalResults = await db.collection('questions').countDocuments({ question: { $regex: normalizedText, $options: 'i' }});
    const results = await db.collection('questions')
        .find({ question: { $regex: normalizedText, $options: 'i' }})
        .sort({ scoreRatio: -1 }) // Sort in descending order by scoreRatio
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .toArray();


    res.statusCode = 200;
    res.setHeader('Content-type', 'application-json');
    res.end(JSON.stringify({ results, totalResults }, null, 2))
})

export default handler;