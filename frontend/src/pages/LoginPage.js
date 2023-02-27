import React, { Component } from 'react';
import Input from '../components/Input';

class LoginPage extends Component {

    state = {
        username:null,
        password:null
    }
    onChange = event => {

        const { name , value} = event.target;
        this.setState({
            [name]: value
        })
    }




    render() {
        return (
            <div>               
                <div className = "container">
                   <form>
                    <h1 className="text-center">Login </h1>
                    <Input label = "Username"  name = "username" onChange = {this.onChange}></Input>
                    <Input label = "Passoword" name = "password" onChange = {this.onChange}></Input>
                        <div className="text-center">
                            <button className="btn btn-primary"> Login </button>
                        </div>
                   </form>
                </div>
            </div>
        );
    }
}

export default LoginPage;