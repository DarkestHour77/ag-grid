

const UpdateButton = (props) => {
    const handleUpdateData = ()=>{
        console.log('update clicked for row', props.data)
    }
    return (
        <button >Update</button>
    );
}

export default UpdateButton;