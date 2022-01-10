import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

(async () => {
  const {Button} = await import('./Button.jsx');
  const root = document.getElementById('root');
  ReactDOM.render((
    <div>
      <Button>Direct</Button>
    </div>
  ), root);
})();