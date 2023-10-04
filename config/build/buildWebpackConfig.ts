import webpack from 'webpack';

import { buildDevServer } from './buildDevServer';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolver } from './buildResolvers';
import { BuildOption } from './types/config';

export function buildWebpackConfig(options: BuildOption): webpack.Configuration {
  const { paths, mode, isDev } = options;
  return {
    mode,
    entry: paths.entry,
    output: {
      filename: '[name].[contenthash].js',
      path: paths.build,
      clean: true,
    },
    devtool: isDev ? 'inline-source-map' : undefined,
    module: {
      rules: buildLoaders(isDev),
    },
    resolve: buildResolver(options),
    plugins: buildPlugins(options),
    devServer: isDev ? buildDevServer(options) : undefined,
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
}
