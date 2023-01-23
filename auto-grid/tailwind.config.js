const plugin = require('tailwindcss/plugin')

const autoGrid = plugin(
  function ({ matchComponents, addComponents, theme }) {
    const values = theme('autoGrid')

    matchComponents(
      {
        'auto-grid': (value) => ({
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
        }),
      },
      { values }
    )

    addComponents({
      '.auto-grid-none': {
        display: 'revert',
        gridTemplateColumns: 'revert',
      },
    })
  },
  {
    theme: {
      autoGrid: ({ theme }) => ({
        ...theme('spacing'),
      }),
    },
  }
)

module.exports = {
  content: ['*.html'],
  theme: {
    // ...
  },
  plugins: [
    autoGrid,
    // ...
  ],
}
