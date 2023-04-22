import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';

const handler = nextConnect()

handler.get(async (req, res) => {
    const { question } = req.query;
    const db = await getMongoDb();
    const regexQuery = { question: { $regex: question, $options: "i" } };
    const sortQuery = { score: -1 }; // sort by score in descending order
    const results = await db.collection('questions').find(regexQuery).sort(sortQuery).toArray();
    
    res.statusCode = 200;
    res.setHeader('Content-type', 'application-json');
    res.end(JSON.stringify({results}, null, 2))
})

export default handler;