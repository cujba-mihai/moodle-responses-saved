import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';
import _ from 'lodash';

const handler = nextConnect()
const regex = /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/gi;

handler.get(async (req, res) => {
    const { question } = req.query;

    const replacedText = question.replace(regex, function(match) {
    switch(match.toLowerCase()) {
        case 'a':
        return '[aăâ]';
        case 'i':
        return '[iîâ]';
        case 's':
        return '[sș]';
        case 't':
        return '[tț]';
        default:
        return match;
    }
    });

    const db = await getMongoDb();
    const regexQuery = { question: { $regex: replacedText, $options: "i" } };
    const results = await db.collection('questions').find(regexQuery).toArray();
    const sortedResults = _.orderBy(results, [(item) => (item.maxScore === 0 ? 0 : item.score / item.maxScore)], ['desc']);

    res.statusCode = 200;
    res.setHeader('Content-type', 'application-json');
    res.end(JSON.stringify({results: sortedResults}, null, 2))
})

export default handler;