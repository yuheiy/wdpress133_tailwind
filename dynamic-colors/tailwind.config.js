const lodash = require('lodash')
const colors = require('tailwindcss/colors')
const { parseColor } = require('tailwindcss/lib/util/color')
const plugin = require('tailwindcss/plugin')

const dynamicColors = (() => {
  function generateDeclarations(settings) {
    const declarations = {}
    walk(settings, [])
    return declarations

    function walk(object, path) {
      const parsedColor = parseColor(object)
      if (parsedColor) {
        const variableName = `--dynamic-color-${path.join('-')}`
        declarations[variableName] = parsedColor.color.join(' ')
        return
      }

      for (const [key, value] of Object.entries(object)) {
        walk(value, [...path, key])
      }
    }
  }

  function generateTheme(settings) {
    const theme = {}
    walk(settings, [])
    return theme

    function walk(object, path) {
      if (typeof object === 'string') {
        const variableName = `--dynamic-color-${path.join('-')}`
        lodash.set(
          theme,
          [path[0], 'dynamic', ...path.slice(1)],
          `rgb(var(${variableName}) / <alpha-value>)`
        )
        return
      }

      for (const [key, value] of Object.entries(object)) {
        walk(value, [...path, key])
      }
    }
  }

  return plugin.withOptions(
    function (options) {
      const styles = {
        ':root': {
          ...generateDeclarations(options.light),
          '@media (prefers-color-scheme: dark)': {
            ...generateDeclarations(options.dark),
          },
        },
      }

      return function ({ addBase }) {
        addBase(styles)
      }
    },
    function (options) {
      const settings = lodash.merge(options.light, options.dark)
      return {
        theme: {
          extend: generateTheme(settings),
        },
      }
    }
  )
})()

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['*.html'],
  theme: {
    // ...
  },
  plugins: [
    dynamicColors({
      light: {
        backgroundColor: {
          DEFAULT: colors.white,
          variant: colors.slate['100'],
        },
        borderColor: {
          DEFAULT: colors.gray['200'],
        },
        textColor: {
          DEFAULT: colors.gray['800'],
          muted: colors.gray['500'],
        },
      },
      dark: {
        backgroundColor: {
          DEFAULT: colors.zinc['900'],
          variant: colors.zinc['800'],
        },
        borderColor: {
          DEFAULT: colors.zinc['700'],
        },
        textColor: {
          DEFAULT: colors.zinc['50'],
          muted: colors.zinc['400'],
        },
      },
    }),
    // ...
  ],
}
