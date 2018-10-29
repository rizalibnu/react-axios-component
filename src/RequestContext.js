// @flow
import * as React from "react";
import axios from "axios";
import type { RequestProviderProps } from './type';

export const RequestContext = React.createContext(null);

export class RequestProvider extends React.Component<RequestProviderProps> {
  render() {
    return (
      <RequestContext.Provider
        value={this.props.instance ? axios.create(this.props.instance) : null}
      >
        {this.props.children}
      </RequestContext.Provider>
    );
  }
}
