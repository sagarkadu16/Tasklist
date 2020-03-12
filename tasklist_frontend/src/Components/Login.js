import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Axios from 'axios'

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:'',
            helpText:'',
            token:'',
            isLoggedIn:false
        }
    }

    handleLoginStatus = () =>{
        this.setState({
            isLoggedIn:!this.state.isLoggedIn
        })
    }

    handleChange = e =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = async e =>{
        e.preventDefault()
        let user = {
            username: this.state.username,
            password:this.state.password
        }

        await Axios.post('http://127.0.0.1:5000/auth/login',user)
        .then(res =>this.setState({
            helpText:res.data.message,
            token:res.data.token,
            isLoggedIn:res.data.status
        }))
        .then(res =>
            this.state.isLoggedIn ? localStorage.setItem('userDetail',JSON.stringify({
                'token':this.state.token,
                loggedIn:true
            })) : localStorage.setItem('userDetail',JSON.stringify({
                'token':'',
                loggedIn:false  
            }))
            )
        .catch(err => console.log(err))
    }

    render(){
        console.log(this.state.token)
        if(!this.state.isLoggedIn){
            return (
                <div className="container my-5">
                    <h2 className='text-center'>TASK LIST MANAGER</h2>
                    <form onSubmit={this.handleSubmit} className='mx-auto bg-light w-50 border shadow-sm p-5'>
                        <h5>Login:</h5>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" onChange={this.handleChange} value={this.state.username} className="form-control" id="username" aria-describedby="emailHelp" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passoword">Password</label>
                            <input type="password" onChange={this.handleChange} value={this.state.password} className="form-control" id="password" />
                        </div>
                       
                        <button type="submit" className="btn btn-primary">Log In</button>
                        {this.state.helpText && <div>{this.state.helpText}</div>}
                        <div className='mt-3'><Link to='/register'>Register</Link></div>
                    </form>
                </div>
            )
        }else{
            return <Redirect to='/dashboard' /> 
        }   
    }
}
