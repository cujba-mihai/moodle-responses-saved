import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';
import _ from 'lodash';

const handler = nextConnect()

const regex = /[aist]/gi;
const diacriticsMap = {
    a: '[aăâ]',
    i: '[iîâ]',
    s: '[sș]',
    t: '[tț]',
};

const escapeRegex = (str) => {
    return str.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
};

function removeDiacritics(text) {
  const romanianDiacritics = /ă|â|î|ș|ț|Ă|Â|Î|Ș|Ț/g;
  return text.replace(romanianDiacritics, '');
}


handler.get(async (req, res) => {
    const { question, offset, limit } = req.query;
    const normalizedText = removeDiacritics(question.normalize().trim());
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

    const db = await getMongoDb();
    const regexQuery = query;
    const totalResults = await db.collection('questions').countDocuments(regexQuery);
    const results = await db.collection('questions')
        .find(query)
        .sort({ scoreRatio: -1 }) // Sort in descending order by scoreRatio
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .toArray();


    res.statusCode = 200;
    res.setHeader('Content-type', 'application-json');
    res.end(JSON.stringify({ results, totalResults }, null, 2))
})

export default handler;