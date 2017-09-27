const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

// Configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Add RAF for React 16
global.requestAnimationFrame = function requestAnimationFrame(callback) {
  setTimeout(callback, 0);
};
