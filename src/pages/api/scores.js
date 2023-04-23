import nextConnect from 'next-connect';
import { getMongoDb } from '../../utils/db';

const handler = nextConnect();

handler.post(async (req, res) => {
    const db = await getMongoDb();
    const questions = await db.collection('questions').find({}).toArray();

    await Promise.all(
        questions.map(async (question) => {
            const { score, maxScore } = question;
            const scoreRatio = (score || 0) / maxScore;
            await db.collection('questions').updateOne(
                { _id: question._id },
                { $set: { scoreRatio: scoreRatio } }
            );
        })
    );

    res.status(200).json({ message: `Updated ${questions.length} documents with score ratio` });
});

export default handler;
