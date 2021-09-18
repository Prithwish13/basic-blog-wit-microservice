import React, {useState} from "react"
import axios from "axios"
const PostCreate = () => {
    const [title, setTitle] = useState("")

    const onSubmit = async(event) => {
        event.preventDefault()
        const {data} = await axios.post("http://localhost:4000/posts",{
            title
        })
        console.log(data)
        setTitle("")
    }

    return (
        <div>
        <form onSubmit={onSubmit} >  
            <div className="form-group">
                <label>Title</label>
                <input 
                value= {title} 
                onChange={(e)=> setTitle(e.target.value)}
                className="form-control"
                />
            </div>
            <div style={{marginTop: '20px'}}>
            <button className="btn btn-primary">Submit</button>
            </div>
        </form> 
        </div>
    )
}

export default PostCreate
