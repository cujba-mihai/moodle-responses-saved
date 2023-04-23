import React from 'react';
import { Card, Col, Typography, Checkbox } from 'antd';

const { Title } = Typography;

const QuizComponent = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <Card key={index} style={{ marginBottom: 20 }}>
          <Title level={4}>{item.question}</Title>
          {item.type === 'multichoice' && (
            <Col>
              {item.choices.map((choice, i) => (
                <Checkbox
                  key={i}
                  value={choice.label}
                  checked={choice.isChecked}
                  disabled
                  style={
                    {
                    color: 'black',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent:'left',
                    padding: '5px',
                    marginLeft: '-5px',
                    marginBottom: '5px',
                  }}
                >
                  <span style={{color: 'black'}}>{choice.label}</span>
                </Checkbox>
              ))}
            </Col>
          )}
          {item.type === 'match' && (
            <div>
              {item.choices.map((choice, i) => (
                <div
                  key={i}
                  style={{
                    color: 'black',
                    backgroundColor:
                      choice.isChecked ? '#d9f7be' : 'transparent',
                    padding: '5px',
                    marginBottom: '5px',
                  }}
                >
                  <strong>{choice.label}: </strong>
                  <span>{choice.value}</span>
                </div>
              ))}
            </div>
          )}
          {item.type === 'text' && (
            <div
              style={{
                color: 'black',
                backgroundColor: item.isChecked ? '#d9f7be' : 'transparent',
                padding: '5px',
              }}
            >
              <strong>Answer: </strong>
              <span>{item.answer}</span>
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <strong>Score:</strong> {item.score} / {item.maxScore}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuizComponent;
