import node from 'rollup-plugin-node-resolve';

export default {
  input: './dist/src/index.js',
  output: [{
    file: './dist/bundle/smart-table-filter.js',
    format: 'iife',
    name: 'smartTableSort',
    sourcemap: true
  }, {
    file: './dist/bundle/smart-table-filter.es.js',
    format: 'es',
    sourcemap: true
  }],
  plugins: [node()]
}