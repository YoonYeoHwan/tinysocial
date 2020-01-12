import React, { Component } from "react";
import PropTypes from "prop-types";
import {GoogleLogin} from "react-google-login";
import {gql} from 'apollo-boost';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom'

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      // TODO : maybe we don't need this?
      provider: '',
    };
  }

  responseGoogle = res => {
    // handle about google log-in success
    this.setState({
      id: res.profileObj.googleId,
      firstName: res.profileObj.givenName,
      lastName: res.profileObj.familyName,
      email: res.profileObj.email,
      provider: res.tokenObj.idpId
    });
  };

  responseFail = err => {
    // TODO : handle google log-in failure
    console.error(err);
  };

  render() {
    // TODO : hide this somehow
    const googleAuthAPIClientID =
      "420478568442-ltur9qc3g9uam6f166k1pgsa7f2evl5e.apps.googleusercontent.com";

    // graphql mutation statement for signup
    const SIGNUP_MUTATION = gql`
    mutation SignUp($googleId: String!, $email: String!, $firstName: String!, $lastName: String!, $profileImgUrl: String) {
      signUpWithGoogle(googleId: $googleId, email: $email, firstName: $firstName, lastName: $lastName, profileImgUrl: $profileImgUrl) {
          success
          message
          token
          user {
            lastName
            firstName
            email
          }
        } 
      }
    `;

    // receive state values for mutation use
    const {id, email, firstName, lastName} = this.state

    return (
      <div>
        {/* form, uneditable for now */}
        <ul>
          <li>Email: </li>
          <input type="text" defaultValue={this.state.email} disabled></input>
          <li>FirstName: </li>
          <input type="text" defaultValue={this.state.firstName} disabled></input>
          <li>LastName: </li>
          <input type="text" defaultValue={this.state.lastName} disabled></input>
        </ul>
        {/* register button, sends a mutation to the server */}
        <Mutation 
          mutation={SIGNUP_MUTATION} 
          variables={{
            googleId: id,
            email: email,
            firstName: firstName,
            lastName: lastName
          }}
          onCompleted={
            (data) => {
              const {success, message, token} = data.signUpWithGoogle
              if (success) {
                // TODO : make session work before redirecting

                this.props.history.push('/')
              } else {
                window.alert('Signup failed ... please contact admin')
                this.props.history.push('/signup')
              }
            }
          }
        >
          {(signupMutation) => {
            return (<button onClick={() => {
              // TODO : input validation (not for v0)
              signupMutation();
            }
            }>Register</button>)
          }}
        </Mutation>
        {/* A google log in button component */}
        <GoogleLogin
          clientId={googleAuthAPIClientID}
          buttonText="Google Log-in"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFail}
        />

      </div>
    );
  }
}

SignupForm.propTypes = {};

// wrap with withRouter to use props.history
export default withRouter(SignupForm);
