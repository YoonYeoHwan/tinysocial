import {clientId} from './utils.js';
import {gql} from 'apollo-boost';
import {GoogleLogin} from "react-google-login";
import {Mutation} from 'react-apollo';  
import PropTypes from "prop-types";
import React, { Component } from "react";
import {withRouter} from 'react-router-dom';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      // TODO(Myoung-heeSeo) : this will be used when facebook login is added.
      provider: '',
    };
  }

  responseGoogle = res => {
    // Handle google log-in success.
    this.setState({
      id: res.profileObj.googleId,
      firstName: res.profileObj.givenName,
      lastName: res.profileObj.familyName,
      email: res.profileObj.email,
      provider: res.tokenObj.idpId
    });
  };

  responseFail = err => {
    // TODO(Myoung-heeSeo) : handle google log-in failure.
  };

  render() {
    // Graphql mutation statement for signup.
    const SIGNUP_MUTATION = gql`
    mutation SignUp($googleId: String!, 
                    $email: String!, 
                    $firstName: String!, 
                    $lastName: String!, 
                    $profileImgUrl: String) {
      signUpWithGoogle(googleId: $googleId, 
                        email: $email, 
                        firstName: $firstName, 
                        lastName: $lastName, 
                        profileImgUrl: $profileImgUrl) {
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

    // Receive state values for mutation use.
    const {id, email, firstName, lastName} = this.state

    return (
      <div>
        {/* Form, uneditable for now. */}
        <ul>
          <li>Email: </li>
          <input type="text" defaultValue={this.state.email} disabled></input>
          <li>FirstName: </li>
          <input type="text" defaultValue={this.state.firstName} disabled></input>
          <li>LastName: </li>
          <input type="text" defaultValue={this.state.lastName} disabled></input>
        </ul>
        {/* Register button, sends a mutation to the server. */}
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
                document.cookie = 'token=' + token;
                this.props.history.push('/eventlist');
              } else {
                window.alert('Signup failed ... please contact admin');
                this.props.history.push('/');
              }
            }
          }
        >
          {(signupMutation) => {
            return (<button onClick={() => {
              // TODO(Myeong-heeSeo) : input validation. (not for v0)
              signupMutation();
            }
            }>Register</button>)
          }}
        </Mutation>
        {/* A google log in button component. */}
        <GoogleLogin
          clientId={clientId}
          buttonText="Google Log-in"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFail}
        />

      </div>
    );
  }
}

SignupForm.propTypes = {};

// Wrap with withRouter to use props.history.
export default withRouter(SignupForm);
