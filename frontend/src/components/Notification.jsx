const Notification = ({ message }) => {
	if (message === null) {
	  return null
	}
  
	return (
	  <div className='successMsg'>
		{message}
	  </div>
	)
  }

  export default Notification