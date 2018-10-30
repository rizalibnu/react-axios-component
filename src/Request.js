// @flow
import * as React from 'react';
import axios from 'axios';
import { RequestContext } from './RequestContext';
import type { RequestProps, RequestParams, RequestState } from './type';

export default class Request extends React.Component<RequestProps, RequestState> {
  static defaultProps = {
    headers: {},
    config: {},
    instance: null,
  };

  static contextType = RequestContext;

  state = {
    response: null,
    loading: false,
    error: null,
    propsString: null,
  };

  static getDerivedStateFromProps(props: RequestProps, state: RequestState) {
    const propsString = JSON.stringify(props);
    if (propsString !== state.propsString) {
      return {
        propsString,
      };
    }
    return null;
  }

  componentDidMount() {
    const { url, params, headers, config } = this.props;
    this.request({ url, params, headers, config });
  }

  componentDidUpdate(prevProps: RequestProps) {
    const { url, params, headers, config } = this.props;
    const propsString = JSON.stringify(prevProps);
    if (propsString !== this.state.propsString) {
      this.request({ url, params, headers, config });
    }
  }

  componentWillUnmount() {
    if (this.source && typeof this.source.cancel === 'function') {
      this.source.cancel('Request canceled by the user.');
    }
  }

  request = async ({ url, params, headers, config, updateResponse }: RequestParams) => {
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
        method: 'get',
        headers: headers || props.headers,
        params: params || props.params,
      },
      config || props.config,
      { cancelToken: this.source.token },
    );
    try {
      const response = await client.request(options);
      this.setState(state => ({
        response: updateResponse
          ? updateResponse(state.response, {
            requestMoreResponse: response,
          })
          : response,
        loading: false,
      }), () => {
        if (typeof this.props.onCompleted === 'function') {
          this.props.onCompleted(updateResponse
            ? updateResponse(this.state.response, {
              requestMoreResponse: response,
            })
            : response);
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

  requestMore = ({ url, params, headers, config, updateResponse }: RequestParams) => {
    this.request({ url, params, headers, config, updateResponse });
  };

  reRequest = () => {
    const { url } = this.props;
    this.request({ url });
  }

  source: Function

  render() {
    const {
      state: { response, loading, error },
      props: { children, ...props },
      requestMore,
      reRequest,
    } = this;
    if (typeof children === 'function') {
      return children({
        response,
        loading,
        error,
        requestMore,
        reRequest,
        props,
      });
    }
    return null;
  }
}
