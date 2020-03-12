import React, { Component } from 'react'
import Axios from 'axios'

export default class GenerateList extends Component {
    constructor(props){
        super(props)
        this.state = {
            title : '',
            category : '',
            helpText:'',
            tasklist:[]
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleCreateList = () =>{
        let newList = {
            listname:this.state.title,
            category:this.state.category
        }
        
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            //create list with title and category
            Axios.post('http://127.0.0.1:5000/task/',newList,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
            .then(res => this.setState({
                helpText:res.data.message,
                tasklist:res.data.tasklist
            }))
            .then(res => this.props.listcreated(this.state.tasklist))
            .catch(err => console.log(err))
    }



    render(){
        return (
            <div className='mt-3'>
                <h1 className='mx-auto mt-2'>Generate List</h1>
                <div className='m-3'>
                    <div className='form-row'>
                        <div className="form-group col-md-6">
                            <label htmlFor="title">List-Title</label>
                            <input type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange} aria-describedby="emailHelp" required/>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="category">Category</label>  
                            <input type="text" className="form-control" value={this.state.category} onChange={this.handleChange} id="category" />
                        </div>
                        <div className="form-group col-md-12">
                            <button type="submit" className="btn btn-outline-danger my-2" onClick={() => this.handleCreateList()}>Stick Your List</button>
                            {this.state.helpText && <div>{this.state.helpText}</div>}
                        </div>
                    </div>  
                </div>  
            </div>
        )
    }
}
















// {this.state.isTitleClicked ? 
//     //edit title component
//     <div>
//             {this.state.isTitleEditCalled ?
//                 <div className='form-row'>
//                     <div className="form-group col-md-6">
//                         <label htmlFor="title">List-Title</label>
//                         <input type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange} aria-describedby="emailHelp" required/>
//                     </div>
//                     <div className="form-group col-md-6">
//                         <label htmlFor="category">Category</label>  
//                         <input type="text" className="form-control" value={this.state.category} onChange={this.handleChange} id="category" />
//                     </div>
//                     <div className="form-group col-md-12">
//                         <button type="submit" className="btn btn-outline-danger my-2" onClick={() => this.setState({isTitleEditCalled : false})}>Update</button>
//                     </div>
//                 </div>
//                 :
//                 <div className='d-flex'>
//                     <h5 className='mx-2'>Title: {this.state.title}</h5>
//                     <h5 className='mx-2'>Category: {this.state.category}</h5>
//                     <button type='submit' className='mx-2 btn btn-sm btn-outline-primary' onClick={() => this.setState({isTitleEditCalled : true})}>Edit</button>
//                 </div>
//             }
        
//         <div className='form-row'>
//             <div className="form-group col-md-6">
//                 <AddTask />
//             </div>
//         </div>
//     </div>
//     :
//     //Initialise List 
//     <div className='form-row'>
//         <div className="form-group col-md-6">
//             <label htmlFor="title">List-Title</label>
//             <input type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange} aria-describedby="emailHelp" required/>
//         </div>
//         <div className="form-group col-md-6">
//             <label htmlFor="category">Category</label>
//             <input type="text" className="form-control" value={this.state.category} onChange={this.handleChange} id="category" />
//         </div>
//         <div className="form-group col-md-12">
//             <button type="submit" className="btn btn-outline-danger my-2" onClick={() => this.handleStickTitle()}>Stick Title</button>
//         </div>
//     </div>
// }