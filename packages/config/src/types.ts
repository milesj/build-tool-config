import Beemo, { DriverContext } from '@beemo/core';

export interface BeemoProcess<T = DriverContext> {
  context: T;
  tool: Beemo;
}

export interface Settings {
  node?: boolean;
  react?: boolean;
}
