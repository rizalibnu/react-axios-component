// @flow
import * as React from 'react';

export type RequestState = {
  response: ?Object,
  loading: boolean,
  error: ?Object,
  propsString?: ?string,
};

export type RequestProps = {
  url: string,
  headers?: ?Object,
  config?: ?Object,
  params?: ?Object,
  instance?: ?Object,
  children?: ?Function,
  onCompleted?: ?Function,
  onLoading?: ?Function,
  onError?: ?Function,
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
  onCompleted?: ?Function,
  onLoading?: ?Function,
  onError?: ?Function,
};

export type MutationParams = {
  url: string,
  data?: ?Object,
  headers?: ?Object,
  config?: ?Object,
  params?: ?Object,
  method: Object,
};

export type RequestProviderProps = {
  instance?: ?Object,
  children: React.Node,
};
