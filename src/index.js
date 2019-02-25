import logMessage from './js/logger';
import './styles/index.css';
// Log message to console
logMessage('Welcome to Expack!');

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef  
}