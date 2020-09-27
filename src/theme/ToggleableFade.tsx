import React from 'react';

interface ToggleableFadeProps {
  children: React.ReactNode;
  show: boolean;
  duration?: number;
}

const ToggleableFade = (props: ToggleableFadeProps): JSX.Element => {
  // set 100ms as default animation time
  const t = props.duration || 200;
  return (
    <div
      style={{
        visibility: props.show ? 'visible' : 'hidden',
        opacity: props.show ? 1 : 0,
        transition: `opacity ${t}ms, visibility ${t}ms`,
      }}
    >
      {props.children}
    </div>
  );
};

export default ToggleableFade;
