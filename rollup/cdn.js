import node from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';

export default {
	input:'./index.js',
	output:{
		file:'./dist/smart-table-filter.js',
		format:'iife',
		name:'smartTableFilter',
		sourcemap:true
	},
	plugins:[node(),cjs()]
}