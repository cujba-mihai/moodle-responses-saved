import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';
import _ from 'lodash';

const handler = nextConnect()

handler.delete(async (req, res) => {
    const db = await getMongoDb();
    const collection = db.collection('questions');

    const results = await collection.deleteMany({ maxScore: null });


    res.statusCode = 200;
    res.setHeader('Content-type', 'application-json');
    res.end(JSON.stringify({results}, null, 2))
})

export default handler;