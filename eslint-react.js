module.exports = {
  extends: require('./eslint'),
  rules: {
    // Want to support, but disabled in Airbnb
    'react/forbid-foreign-prop-types': 'error',
    'react/jsx-handler-names': ['error', {
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
    }],
    'react/jsx-key': 'error',
    'react/jsx-no-literals': 'error',
    'react/jsx-max-props-per-line': ['error', {
      maximum: 1,
      when: 'multiline',
    }],
    'react/no-direct-mutation-state': 'error',
    'react/sort-prop-types': ['error', {
      ignoreCase: true,
      callbacksLast: true,
    }],
    'react/void-dom-elements-no-children': 'error',
  },
});
