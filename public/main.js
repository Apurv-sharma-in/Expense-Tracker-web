const form = document.querySelector('.singup form');
const submtBtn = document.getElementById('submit');

const message = document.createElement('p');
message.style.fontSize = '14px';
message.style.textAlign = 'center';
message.style.marginBottom = '10px';
form.insertBefore(message, submtBtn);



form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3000/user/signup',{
            name :name,
            email:email,
            password:password
        });
          message.textContent = response.data.message || 'User added successfully!';
        message.style.color = '#16a34a';
        form.reset();
    } catch (error) {
            console.error(error);
            
     if (error.response && error.response.data && error.response.data.message) {
            message.textContent = error.response.data.message;
        } else {
            message.textContent = 'Something went wrong. Please try again.';
        }
        message.style.color = '#dc2626';
}

})