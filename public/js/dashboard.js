const addBtn = document.getElementById('addExpense');
const token = localStorage.getItem('token');
if(!token){
    window.location.href ='index.html'
}
const config = {
    headers: { Authorization: token }
};

addBtn.addEventListener('click',async (e)=>{
    e.preventDefault();
    
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const form = document.querySelector('form');
    
    try {
        await axios.post("http://localhost:3000/user/",{
            amount,
            description,
            category
        },config);
        form.reset();
        display();
        
    } catch (error) {
        console.error("Error Submitting data",error);
        alert('Faild to Add');
    }   
});

async function display() {
    try {
        const ul = document.getElementById('list');
        ul.innerHTML="";
        const response= await axios.get("http://localhost:3000/user/",config);

        response.data.forEach((user) => {
            const li = document.createElement("li");
            li.textContent = user.amount+" "+user.description+" "+user.category 
        
         const addDeleteButton = document.createElement("button");
      addDeleteButton.type = "button";
      addDeleteButton.textContent = " Delete ";

      addDeleteButton.addEventListener("click", async () => {
        try {
          await axios.delete(`http://localhost:3000/user/${user.id}`,config);
          display();
        } catch (error) {
          console.error("Delete Error", error);
        }
      });

        
        
      li.appendChild(addDeleteButton);
      ul.appendChild(li);
        });
    } catch (error) {
        console.error("Form is not working")
    }
}
window.addEventListener("DOMContentLoaded", display);