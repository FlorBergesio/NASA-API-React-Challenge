import './index.css';

const Button = ( { type, handleClick, text } ) => (
  <button
    type={ type ? type : "button" }
    className="button"
    onClick={ handleClick }
  >
    { text }
  </button>
);

export default Button;