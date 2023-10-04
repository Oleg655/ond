import webpack from 'webpack';
import { BuildOption } from './types/config';

export function buildResolver(options: BuildOption): webpack.ResolveOptions {
  return {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [options.paths.src, 'node_modules'],
  };
}
