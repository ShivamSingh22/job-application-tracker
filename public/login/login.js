function handleFormSubmit(event){
    event.preventDefault();
    
    const email = event.target.email.value;
    const password = event.target.password.value;
    const messageLabel = document.querySelector('#msg-txt');

    const obj = {
        email:email,
        password:password
    }

    axios.post('http://localhost:3000/user/login',obj)
    .then((res)=>{
        localStorage.setItem('token', res.data.token);
        window.location.href = "../expense/expense.html"
        messageLabel.innerHTML = res.data.message;
        event.target.reset();
    })
    .catch(err=>{
        messageLabel.innerHTML = err.response.data.message;
        console.log(err);
    })
}