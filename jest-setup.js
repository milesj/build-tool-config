import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Add RAF for React 16
global.requestAnimationFrame = function requestAnimationFrame(callback) {
  setTimeout(callback, 0);
};
