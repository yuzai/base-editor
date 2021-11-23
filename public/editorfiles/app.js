import React, { useState } from 'react';
import { add } from './cc';

console.log(add(1, 2));

const App = () => {
    const [count, setCount] = useState(0);

    return (
        <div>{count}</div>
    )
};

export default App;