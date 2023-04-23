import React from 'react';
import { Card, Col, Typography, Checkbox, Space, Alert } from 'antd';

const { Title } = Typography;

function lerpColor(value, color1, color2) {
  const r = color1.r + value * (color2.r - color1.r);
  const g = color1.g + value * (color2.g - color1.g);
  const b = color1.b + value * (color2.b - color1.b);

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function getContrastingTextColor(backgroundColor) {
  const [r, g, b] = backgroundColor
    .substring(4, backgroundColor.length - 1)
    .split(',')
    .map(Number);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? 'black' : 'white';
}


const QuizComponent = ({ data, firstSearchTriggered }) => {
  return (
    <div>
      {(data.length === 0 && firstSearchTriggered) && (    
      <Space direction="vertical" style={{ width: '100%', marginTop: '20px'}}>
    <Alert
      message="Fără rezultate"
      description="Niciun răspuns găsit în căutare"
      type="info"
    />
    </Space>)}
      {data.map((item, index) => {
        const scoreRatio = item.score / item.maxScore;
        const startColor = { r: 255, g: 0, b: 0 }; // red
        const endColor = { r: 0, g: 255, b: 0 }; // green
        const backgroundColor = lerpColor(scoreRatio, startColor, endColor);
        const textColor = getContrastingTextColor(backgroundColor);

        return (
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
              <span style={{backgroundColor, color: textColor}}><strong>Score:</strong> {item.score} / {item.maxScore}</span>
            </div>
          </Card>
        )
      }
      )}
    </div>
  );
};

export default QuizComponent;
