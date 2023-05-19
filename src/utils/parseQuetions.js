const { JSDOM } = require('jsdom');
const _ = require('lodash');


export function parseQuestions(htmlString) {
    const dom = new JSDOM(htmlString);
    const { document } = dom.window;
  
    const questionNodes = document.querySelectorAll('.que:not([class*="questionflag"]):not([aria-label*="Flagged"]):not([title*="Puneți un flag"])');
    const questions = [];
  
    questionNodes.forEach((questionNode) => {
      const question = questionNode.querySelector('.qtext').textContent.trim();
      const stateNode = questionNode.querySelector('.state');
      const noAnswerGiven = stateNode && stateNode.textContent.trim() === 'Nu a primit răspuns';
      const scoreData = questionNode.querySelector('.grade').textContent.trim();
      const [score, maxScore] = noAnswerGiven
        ? [0, parseFloat(scoreData.match(/[\d.,]+/g)[0].replace(',', '.'))]
        : scoreData.match(/[\d.,]+/g).map((x) => parseFloat(x.replace(',', '.')));

      const scoreRatio = (score || 0) / maxScore;
   
      if (questionNode.classList.contains('multichoice')) {
        const choices = Array.from(questionNode.querySelectorAll('.answer input[type="checkbox"] + .d-flex, .answer input[type="radio"] + .d-flex')).map((choiceNode) => {
          const label = choiceNode.textContent.trim();
          const isChecked = choiceNode.previousElementSibling.checked;
          return { label, isChecked };
        });
  
        questions.push({
          type: 'multichoice',
          question,
          choices,
          score: score || 0,
          scoreRatio,
          maxScore,
          noAnswerGiven
        });
      } else if (questionNode.classList.contains('match')) {
        const choices = Array.from(questionNode.querySelectorAll('.answer tr')).map((choiceNode) => {
          const label = choiceNode.querySelector('.text').textContent.trim();
          const value = choiceNode.querySelector('select option:checked').textContent.trim();
          return { label, value };
        });
  
        questions.push({
          type: 'match',
          question,
          choices,
          score: score || 0,
          scoreRatio,
          maxScore,
          noAnswerGiven
        });
      } else if (questionNode.classList.contains('text')) {
        const answerNode = questionNode.querySelector('input[type="text"]');
        const answerText = answerNode.value;
  
        questions.push({
          type: 'text',
          question,
          answer: answerText,
          score: score || 0,
          scoreRatio,
          maxScore
        });
      } else if (questionNode.classList.contains('truefalse')) {
        const answerNode = questionNode.querySelector('input[type="radio"][checked="checked"]')
        const answer = !!(parseInt(answerNode?.value));
  
        questions.push({
          type: 'truefalse',
          question,
          answer,
          score: score || 0,
          scoreRatio,
          maxScore,
          noAnswerGiven
        });
      }
    });
  
    return cleanQuestionsArray(questions);
}
function cleanQuestionsArray(questionsArray) {
  return questionsArray.map(questionObj => {
      if (typeof questionObj.question === 'string') {
          const cleanQuestion = questionObj.question.replace(/\s+/g, ' ').trim();
          return {...questionObj, question: cleanQuestion};
      }
      return questionObj;
  });
}
