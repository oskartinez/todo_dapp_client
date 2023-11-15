import {List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Task.css';

const Task = ({taskText, onClick})=>{
    return (
        <List className='todo_list'>
            <ListItem>
                <ListItemText primary={taskText} />
            </ListItem>
            <ListItem>
                <DeleteIcon fontSize='large' style={{opacity:0.7}} onClick={onClick}></DeleteIcon>
            </ListItem>
        </List>
    );

}

export default Task;