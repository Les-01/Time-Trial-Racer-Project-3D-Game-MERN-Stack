module.exports = {
  // Add overrides for specific files
  overrides: [
    {
      // Add an override for three.min.js
      files: ['./frontend/src/libraries/three.min.js'], 
      rules: {
        'no-undef': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      // Add an override for cannon.min.js
      files: ['./frontend/src/libraries/cannon.min.js'],
      rules: {
        'no-undef': 'off',
        'no-unused-expressions': 'off',
      },
    },
  ],
};