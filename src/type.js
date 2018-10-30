//@flow
import * as React from "react";

export type RequestState = {
  response: ?Object,
  loading: boolean,
  error: ?Object,
};

export type RequestProps = {
  url: string,
  headers?: ?Object,
  config?: ?Object,
  params?: ?Object,
  instance?: ?Object,
  children?: ?Function,
};

export type RequestParams = {
  url: string,
  headers?: ?Object,
  config?: ?Object,
  params?: ?Object,
  updateResponse?: ?Function,
};

export type MutationProps = {
  url: string,
  data?: ?Object,
  headers?: ?Object,
  config?: ?Object,
  params?: ?Object,
  method: Object,
  instance?: ?Object,
  children: Function,
};

export type RequestProviderProps = {
  instance?: ?Object,
  children: React.Node,
};