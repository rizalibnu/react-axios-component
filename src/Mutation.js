// @flow
import * as React from 'react';
import axios from 'axios';
import { RequestContext } from './RequestContext';
import type { MutationProps, RequestState, MutationParams } from './type';

export default class Mutation extends React.Component<MutationProps, RequestState> {
  static defaultProps = {
    data: {},
    headers: {},
    config: {},
    instance: null,
  };

  static contextType = RequestContext;

  state = {
    response: null,
    loading: false,
    error: null,
  };

  componentWillUnmount() {
    if (this.source && typeof this.source.cancel === 'function') {
      this.source.cancel('Request canceled by the user.');
    }
  }

  mutate = async ({ url, method, data, params, headers, config }: MutationParams) => {
    let client;
    if (this.props.instance) {
      client = axios.create(this.props.instance);
    } else {
      client = this.context || axios;
    }
    if (this.source) {
      this.source.cancel('Request canceled by the user.');
    }
    this.source = axios.CancelToken.source();
    const { props } = this;
    this.setState({ loading: true }, () => {
      if (typeof this.props.onLoading === 'function') {
        this.props.onLoading(true);
      }
    });
    const options = Object.assign(
      {
        url: url || props.url,
        method: method || props.method,
        data: data || props.data,
        params: params || props.params,
        headers: headers || props.headers,
      },
      config || props.config,
      { cancelToken: this.source.token },
    );
    try {
      const response = await client.request(options);
      this.setState({
        response,
        loading: false,
      }, () => {
        if (typeof this.props.onCompleted === 'function') {
          this.props.onCompleted(response);
        }
        if (typeof this.props.onLoading === 'function') {
          this.props.onLoading(false);
        }
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        this.setState({ error, loading: false }, () => {
          if (typeof this.props.onError === 'function') {
            this.props.onError(error);
          }
          if (typeof this.props.onLoading === 'function') {
            this.props.onLoading(false);
          }
        });
      }
    }
  };

  source: Function

  render() {
    const {
      state: { response, loading, error },
      props: { children },
      mutate,
    } = this;
    if (typeof children === 'function') {
      return children(mutate, {
        response,
        loading,
        error,
      });
    }
    return null;
  }
}
