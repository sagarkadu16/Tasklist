import React, { Component } from 'react'
import GenerateList from './GenerateList'
import Axios from 'axios'

export default class Dashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            isGenerate : false,
            listdata:[],
            taskdata:[],
            specifiedList:[],
            taskname:'',
            taskedit:'',
            isTaskEditClicked:false,
            editingTaskId:0,
            deleteListId: 0
        }
    }

    //re-rendering when new list generated
    listcreated = updated_tasklist =>{
        this.setState({
            listdata:updated_tasklist
        })
    }

    handleChange = e =>{
        this.setState({
            [e.target.id] : [e.target.value]
        })
    }

    handleLogout = () =>{
        localStorage.setItem('userDetail',JSON.stringify({
            "token":"",
            "loggedIn":false
        }))
        console.log(this.props)
        this.props.history.push('/')
    }


    FetchTaskData = listid =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            console.log(token)
            //create list with title and category
            Axios.get(`http://127.0.0.1:5000/task/${listid}`,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                taskdata:res.data.task,
                specifiedList:res.data.list
            }))
            .catch(err => console.log(err))
    }

    handleAddTask = () =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        let listid = this.state.specifiedList.id
        console.log('listid',listid)
            let task = {
                taskname : this.state.taskname
            }
            //create list with title and category
            Axios.post(`http://127.0.0.1:5000/task/${listid}`,task,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                taskdata:res.data.tasks,
                taskname:''
            }))
            .catch(err => console.log(err))
    }
    

    handleTaskEdit = id =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        let listid = this.state.specifiedList.id
        console.log('listid',listid)
            let task = {
                taskname : this.state.taskedit
            }
            //create list with title and category
            Axios.put(`http://127.0.0.1:5000/task/${listid}/${id}`,task,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                taskdata:res.data.tasks,
                taskname:'',
                isTaskEditClicked:false
            }))
            .catch(err => console.log(err))
    }

    handleTaskDelete = id =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        let listid = this.state.specifiedList.id
            
            //create list with title and category
            Axios.delete(`http://127.0.0.1:5000/task/${listid}/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                taskdata:res.data.tasks
            }))
            .catch(err => console.log(err))
    }


    handleDeleteList = () =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        let listid = this.state.deleteListId
            console.log(listid)
            //create list with title and category
            Axios.delete(`http://127.0.0.1:5000/task/${listid}`,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                listdata:res.data.tasklists
            }))
            .catch(err => console.log(err))
    }
    
    

    componentDidMount = () =>{
        this.x = setTimeout(() =>{
            this.getToken()
        },10)
    }

    getToken = () =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            console.log(token) 
            //create list with title and category
            Axios.get('http://127.0.0.1:5000/task/',{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                listdata:res.data.tasklists
            }))
            .catch(err => console.log(err))
    }


    render(){
        return (
            <div>
                <div className='p-2 container bg-light text-right'>
                    <button className='btn btn-primary rounded-pill' onClick={() => this.handleLogout()}>Logout</button>
                </div>
                <div className='container border mt-5 bg-light'>
                <h1 className='text-center mt-5 mb-3'>Task Manager</h1>
                <div className='d-flex justify-content-around'>
                <button className={`btn rounded-pill ${this.state.isGenerate ? 'btn-primary': 'btn-danger'}`} 
                    onClick={() => 
                        this.setState({
                            isGenerate:!this.state.isGenerate,
                        })}
                    >{this.state.isGenerate ? 'See TaskList': 'Generate List'}</button>
                </div>
                {this.state.isGenerate ? <GenerateList listcreated={this.listcreated} />
                :
                    <div className='row mt-5 justify-content-around'>
                        {this.state.listdata.map(list =>
                                <div key={list.id} className="card shadow-sm p-3 col-lg-3 col-12 my-2 mx-2 col-sm-5" style={{width : '18rem'}}>
                                    <div className="card-header" style={{background:'#c9f9ff'}}>
                                        {list.listname}
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Category: {list.category}</li>
                                        <li className="list-group-item">Total task count - {list.taskcount}</li>
                                        <li className="list-group-item text-center">
                                            <button className='btn btn-sm btn-danger rounded-pill px-4' data-toggle="modal" data-target='#deleteWarning' onClick={() => this.setState({deleteListId:list.id})}>Delete</button>
                                        </li>
                                        <li className="list-group-item text-center">
                                            <button className='btn btn-sm btn-info rounded-pill px-4' data-toggle="modal" onClick={() => this.FetchTaskData(list.id)} data-target="#viewlist">View</button>
                                        </li>
                                        {/* //==================Delete List Modal ========================== */}
                                        <div className="modal fade" id="deleteWarning" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalCenterTitle">Delete List</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    Are You Sure, You Want To Delete List?
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => this.handleDeleteList()}>Delete</button>
                                                </div>
                                                </div>
                                            </div>
                                            </div>

                                        {/* //=======================Task - List=========================================== */}
                                        <div className="modal fade" id="viewlist" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">{this.state.specifiedList.listname}</h5> <br/>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.forceUpdate()}>
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                {this.state.taskdata.map(task =>
                                                        <div key={task.id} className="modal-body d-flex justify-content-between">
                                                            <div>
                                                                {this.state.isTaskEditClicked && task.id === this.state.editingTaskId ? 
                                                                    <input type='text' value={this.state.taskedit} onChange={this.handleChange} id='taskedit' />
                                                                    : task.taskname
                                                                }
                                                            </div>
                                                            <div>
                                                                {this.state.isTaskEditClicked && task.id === this.state.editingTaskId ? 
                                                                    <button className='btn mx-1 btn-sm btn-outline-primary' onClick={() => this.handleTaskEdit(task.id)}>Update</button>
                                                                    :<button className='btn mx-1 btn-sm btn-outline-primary' onClick={() => this.setState({isTaskEditClicked : true, editingTaskId:task.id, taskedit:task.taskname})}>Edit</button>
                                                                }
                                                                <button className='btn mx-1 btn-sm btn-outline-primary' onClick={() => this.handleTaskDelete(task.id)}>Delete</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                <div className="modal-footer d-flex">
                                                        <input type='text' className="form-control" value={this.state.taskname} onChange={this.handleChange} id="taskname" placeholder='Stick task in list' />
                                                            {this.state.helpText && <div>{this.state.helpText}</div>}
                                                        <button type="button" className="btn btn-sm btn-primary" onClick={() => this.handleAddTask()}>Add Task</button>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    
                                    </ul>
                                </div>
                            )}
                    </div>
                
                }
                </div>
            </div>
        )
    }
}
