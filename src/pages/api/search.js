import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';
import _ from 'lodash';

const handler = nextConnect()

handler.get(async (req, res) => {
    const { question } = req.query;
    const db = await getMongoDb();
    const regexQuery = { question: { $regex: question, $options: "i" } };
    const results = await db.collection('questions').find(regexQuery).toArray();
    const sortedResults = _.orderBy(results, [(item) => (item.maxScore === 0 ? 0 : item.score / item.maxScore)], ['desc']);

    res.statusCode = 200;
    res.setHeader('Content-type', 'application-json');
    res.end(JSON.stringify({results: sortedResults}, null, 2))
})

export default handler;