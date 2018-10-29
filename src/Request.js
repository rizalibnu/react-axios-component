// @flow
import * as React from "react";
import axios from "axios";
import { RequestContext } from "./RequestContext";
import type { RequestProps, RequestParams, RequestState } from "./type";

export default class Request extends React.PureComponent<RequestProps, RequestState> {
  static defaultProps = {
    headers: {},
    config: {},
    instance: null
  };

  static contextType = RequestContext;

  state = {
    response: null,
    loading: false,
    error: null
  };

  componentDidMount() {
    const { url, params, headers, config } = this.props;
    this.request({ url, params, headers, config });
  }

  request = async ({ url, params, headers, config, updateResponse }: RequestParams) => {
    const client = this.context || this.props.instance ? axios.create(this.props.instance) : null || axios;
    const { props } = this;
    this.setState({ loading: true });
    const options = Object.assign(
      {
        url: url || props.url,
        method: "get",
        headers: headers || props.headers,
        params: params || props.params
      },
      config || props.config
    );
    try {
      const response = await client.request(options);
      this.setState({
        response: updateResponse
          ? updateResponse(this.state.response, {
              requestMoreResponse: response
            })
          : response
      });
    } catch (error) {
      this.setState({ error });
    }
    this.setState({ loading: false });
  };

  requestMore = async ({ url, params, headers, config, updateResponse }: RequestParams) => {
    this.request({ url, params, headers, config, updateResponse });
  };

  render() {
    const {
      state: { response, loading, error },
      props: { children, ...props },
      request,
      requestMore
    } = this;
    if (typeof children === "function") {
      return children({
        response,
        loading,
        error,
        requestMore,
        rerequest: request,
        props
      });
    }
    return null;
  }
}
