import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  border: solid 2px red;
  display: flex;
  flex-direction: column;

  > .head {
    height: 64px;
  }

  > .content {
    flex: 1;
    border: solid 2px blue;
    overflow: auto;
    position: relative;
  }
`;

export default function StoryContainer({ children }) {
  return (
    <Container>
      <div className="head">&nbsp;</div>
      <div className="content">{children}</div>
    </Container>
  );
}
