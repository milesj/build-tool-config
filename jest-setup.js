// Configure React 16 (must occur before Enzyme)
global.requestAnimationFrame = function requestAnimationFrame(callback) {
  setTimeout(callback, 0);
};

// Configure Enzyme
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });
