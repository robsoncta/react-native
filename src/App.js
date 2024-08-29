import React from "react";
import { Root } from "native-base";
import { isSignedIn } from "./service/auth";
import { SignedOutRoutes, SignedInRoutes } from './routes';

export default class App extends React.Component {
  state = {
    signed: false,
    signLoaded: false,
  };

  componentWillMount = async  () => {
    isSignedIn()
      .then(res => this.setState({ signed: res, signLoaded: true }))
      .catch(err => alert("Ops ... tente navamente!"));
  }

  
  render() {
    const { signLoaded, signed } = this.state;

    if (!signLoaded) {
      return null;
    }

    return(
        <Root>
          {signed?(<SignedInRoutes />):(<SignedOutRoutes />)}
        </Root>
      )
  
  }
}