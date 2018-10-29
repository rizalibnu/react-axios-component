// @flow
import * as React from "react";
import axios from "axios";
import { RequestContext } from "./RequestContext";
import type { MutationProps, RequestState } from "./type";

export default class Mutation extends React.Component<MutationProps, RequestState> {
  static defaultProps = {
    data: {},
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

  mutate = async ({ url, method, data, params, headers, config }: MutationProps) => {
    const client = this.context || this.props.instance ? axios.create(this.props.instance) : null || axios;
    const { props } = this;
    this.setState({ loading: true });
    const options = Object.assign(
      {
        url: url || props.url,
        method: method || props.method,
        data: data || props.data,
        params: params || props.params,
        headers: headers || props.headers
      },
      config || props.config
    );
    try {
      const response = await client.request(options);
      this.setState({
        response
      });
    } catch (error) {
      this.setState({ error });
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      state: { response, loading, error },
      props: { children },
      mutate
    } = this;
    if (typeof children === "function") {
      return children(mutate, {
        response,
        loading,
        error
      });
    }
    return null;
  }
}
