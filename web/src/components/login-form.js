import {clientId} from './utils.js';
import {gql} from 'apollo-boost';
import {GoogleLogin} from 'react-google-login';
import {Mutation} from 'react-apollo';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

/* Query sending user Information to server */
const SIGNIN_QUERY = gql`
        mutation ($googleId: String!){
          signInWithGoogle(googleId: $googleId){
            success
            message
            token
            user{
              firstName
              lastName
            }
          }
        }`;

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMember: false,
      googleId: ''
    };
  }

  // Google login fail callback function
  responseFail = (err) => {
    // TODO(Hyejin): Make alert function
  };

  /**
   * After check member from server, setState and Reaction
   * @param {boolean} isSuccess
   * @param {string} token
   */
  changeIsMember(isSuccess, token) {
    if (isSuccess) {
      this.setState({isMember: true});
      // Store user token to Cookie 'token'.
      document.cookie = 'token=' + token;
    }
    else{
      // TODO(Hyejin): Implement processing signin failure
    }
  }

  // After authenticated from server, redirect even if success or not.
  redirect = () => {
    if(this.state.isMember)
      return this.props.history.push('/eventlist');
    else
      return this.props.history.push('/');
  };

  /**
   * Social login button and
   * Send googleId received from google to server using mutation component
   */
  render() {
    return (
      <div>
        <Mutation mutation={SIGNIN_QUERY}
                  variables={{googleId: this.state.googleId}}
                  onCompleted={
                    (data)=>{
                      this.changeIsMember(
                          /* isSucess= */ data.signInWithGoogle.success,
                          /* token= */ data.signInWithGoogle.token);
                      this.redirect()
                    }}
                  onError={
                    (error)=>{
                      // TODO(Hyejin): Implement query error processing
                    }
                  }>
          {(execute_mutation) => {
            {/* Google Login Button */}
              return(
                <GoogleLogin
                    onSuccess={(res) => {
                      this.setState({
                        googleId : res.profileObj.googleId
                      }, execute_mutation)
                    }}
                    onFailure={this.responseFail}
                    clientId={clientId} // Our client ID
                />
              )
          }
          }
        </Mutation>
      </div>);
  }
}

LoginForm.propTypes = {};

export default withRouter(LoginForm);
