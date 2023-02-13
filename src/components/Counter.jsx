import { useState } from 'preact/hooks';

export default function() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div>Count: { count }</div>
      <button type="button" onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}