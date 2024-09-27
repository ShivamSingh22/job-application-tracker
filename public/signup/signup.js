function handleFormSubmit(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const messageTxt = document.getElementById('msg-txt');

    const obj = {
        username: username,
        email: email,
        password: password
    };

    axios.post('http://localhost:8080/user/signup', obj)
        .then((res) => {
      
            messageTxt.innerHTML = res.data.message;
            event.target.reset();
        })
        .catch(err => {
            messageTxt.innerHTML = err.response.data.message;
          console.log(err);
        });
}
