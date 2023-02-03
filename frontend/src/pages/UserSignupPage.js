import React from 'react';
import { signup } from '../api/apiCalls';

class UserSignupPage extends React.Component {
  state = {
    username: null,
    displayName: null,
    password: null,
    passwordRepeat: null,
    pendingApiCall:false,
    errors: {   }
  };

  onChange = event => {
    const { name, value } = event.target;
    const errors = {...this.state.errors};
    errors[name] = undefined 
    this.setState({
      [name]: value,
      errors
    });
  };

  onClickSignup = async event => {
    event.preventDefault();

    const { username, displayName, password } = this.state;

    const body = {
      username,
      displayName,
      password
    };
    this.setState({pendingApiCall:true})
    
   try {
    const response = await signup(body);
   }  catch(error){
    if(error.response.data.validationErrors){
      this.setState({errors:error.response.data.validationErrors});
    }   
  }
     this.setState({pendingApiCall:false})
  };

  render() {
    const { pendingApiCall , errors } = this.state;
    const { username,displayName} = errors ;
    return (
      <div className="container">
        <form>
          <h1 className="text-center">Sign Up</h1>
          <div className="form-group">
            <label>Username</label>
            <input className={username ?  "form-control is-invalid" : "form-control"} name="username" onChange={this.onChange} />
            <div className="invalid-feedback">    {username} </div>
          </div>
          <div className="form-group">
            <label>Display Name</label>
            <input className={displayName ?  "form-control is-invalid" : "form-control"} name="displayName" onChange={this.onChange} />
            <div className="invalid-feedback">    {displayName} </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" name="password" type="password" onChange={this.onChange} />
          </div>
          <div className="form-group">
            <label>Password Repeat</label>
            <input className="form-control" name="passwordRepeat" type="password" onChange={this.onChange} />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={this.onClickSignup} disabled={pendingApiCall}>
            {pendingApiCall && <span className="spinner-border spinner-border-sm"></span>  } Sign Up
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default UserSignupPage;
