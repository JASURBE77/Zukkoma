module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
        },
        'preset-typescript': {},
      },
    ],
  ],

  plugins: [
    // Qisqa import yo'llari: '@/components/...' yoki '@store/...'
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@store': './src/store',
          '@lib': './src/lib',
          '@utils': './src/utils',
          '@guard': './src/guard',
        },
      },
    ],

    // async/await va boshqa zamonaviy JS ni optimallashtirib, bundle hajmini kamaytiradi
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],

  env: {
    // Faqat development uchun
    development: {
      plugins: [],
    },

    // Faqat production uchun
    production: {
      plugins: [
        // console.log, console.warn, console.error larni o'chiradi
        ['transform-remove-console', { exclude: ['error'] }],
      ],
    },

    // Jest test uchun
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    },
  },
};
