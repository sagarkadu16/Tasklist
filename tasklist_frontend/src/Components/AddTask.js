import React, { Component } from 'react'

export default class AddTask extends Component {
    constructor(props){
        super(props)
        this.state = {
            taskdata : [],
            isAddClicked:false
        }
    }

    handleTask = e =>{
        this.setState({
            taskdata : ['firsttask','secondtask']
        })
    }


    render() {
        return (
            <div>
                {this.state.taskdata.map(item =>
                        <div>
                            <div>{item}</div>
                            <button className='mx-1 btn btn-sm btn-outline-primary'>Edit</button>
                            <button className='mx-1 btn btn-sm btn-outline-primary'>Delete</button>
                        </div>
                )}
                <label htmlFor="taskname">Add a task</label>
                <input type="text" class="form-control" id="taskname"  required/>
                <button type='submit' className='btn btn-sm btn-outline-primary mt-2 mb-1 rounded-pill' onClick={() => this.handleTask}> + Add </button><br/>
                <small className='bg-light text-danger p-2'>Please click add to add task in list</small><br/>
            </div>
        )
    }
}
