import type { Configuration as DevserverConfiguration } from 'webpack-dev-server';

import { BuildOption } from './types/config';

export function buildDevServer(options: BuildOption): DevserverConfiguration {
  return {
    port: options.port,
    open: true,
    historyApiFallback: true,
    hot: true,
  };
}
