import React from "react";
import styled from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { device } from "../../responsive";

const speed = 5000;

const Container = styled.div`
  transform: translate(-100%, -50%);
  display: inline-block;
  text-align: right;
  position: absolute;
  top: 300px;
  left: 50%;
  z-index: 1;

  @media ${device.max.mobileL} {
    top: 20vh;
  }

  h2 {
    font-family: 'Oswald', sans-serif;
  }
`

const Quote = styled.span`
  position: absolute;
  white-space: nowrap;

  &.enter {
    opacity: 0;
    transform: translate(0, 100%);
  }
  &.enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: transform ${speed}ms linear, opacity ${speed}ms ease-in;
  }

  &.exit {
    opacity: 1;
    transform: translate(0, 0);
  }
  &.exit-active {
    opacity: 0;
    transform: translate(0, -100%);
    transition: transform ${speed}ms linear, opacity ${speed}ms ease-out;
  }
`;

export const DontJust = () => {
  const quoteSuffixes = [
    "",
    "learn, experience.",
    "read, absorb.",
    "change, transform.",
    "relate, advocate.",
    "promise, prove.",
    "criticize, encourage.",
    "think, ponder.",
    "take, give.",
    "see, feel.",
    "dream, do.",
    "hear, listen.",
    "talk, act.",
    "tell, show.",
    "exist, live."
  ];

  const [suffixIndex, setSuffixIndex] = React.useState(0);
  const [items, setItems] = React.useState([quoteSuffixes[0]]);

  React.useEffect(() => {
    const next = suffixIndex >= quoteSuffixes.length - 1 ? 1 : suffixIndex+1;
    setItems([quoteSuffixes[next]]);

    setTimeout(() => {
      setSuffixIndex(next);
    }, speed)

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [suffixIndex])

  return (
    <Container>
      <link rel="stylesheet" href="https://use.typekit.net/bez2nnv.css"></link>
      <h2>
        Don't just
        <TransitionGroup component="span">
          {items.map(text => (
            <CSSTransition key={text} timeout={speed}>
              <Quote>&nbsp;{text}</Quote>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </h2>
    </Container>
  );
}
