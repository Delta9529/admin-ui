'use strict'

const mainEL = document.querySelector(".main");
let data = [];

//API Call
const addUsers = async () => {
    try {
        const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
        data = await response.json();
        console.log(data)
        if (data.length == 0) {
            mainEL.innerHTML = "";
            const errorHead = document.createElement("div");
            errorHead.className = "errorHead";
            errorHead.innerHTML = `
            <h2>Oh no!! No users found</h2>`

            mainEL.appendChild(errorHead);
        } else {
            showUsers(data, userRows, rows, currentPage);
        }
    } catch (e) {
        alert(e)
    }


}



addUsers();




//show users rows
const userRows = document.createElement("div");
userRows.className = "userRows";
mainEL.appendChild(userRows)
let currentPage = 1;
let rows = 10;


const showUsers = (users, wrapper, rows_per_page, page) => {
    wrapper.innerHTML = "";
    page--

    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = users.slice(start, end);
    // console.log(paginatedItems)


    paginatedItems.forEach((user) => {
        const userBox = document.createElement("div");
        userBox.className = "userDetails";
        userBox.innerHTML = `
        <input type="checkbox" id="selectOne" name="selectOne">
        <h4>${user.name}</h4>
        <h4>${user.email}</h4>
        <h4>${user.role}</h4>
        <i class="fa-solid fa-pen-to-square"></i>
        <i class="fa-solid fa-trash deleteIcon" style="color: #e74813; onclick="deleteOne(this)"></i>`

        userRows.appendChild(userBox);


        const deleteIcon = userBox.querySelector(".deleteIcon");
        deleteIcon.addEventListener('click', () => {
            deleteOne(deleteIcon);
        });


    });

    paginationButtons(data);

}


//Creating pagination buttons
const containerElem = document.querySelector(".container")
const buttonElem = document.createElement("div");
buttonElem.classList = "buttons";
containerElem.appendChild(buttonElem);
function paginatedButtons(page) {
    let button = document.createElement("button");
    button.className = "paginationButton"
    button.innerText = page;
    if (currentPage === page) {
        button.classList.add("active");
    }
    return button;
}

function paginationButtons(data) {
    let pageCount = Math.ceil(data.length / rows);
    buttonElem.innerHTML = `<button class ="deleteAll" onclick="deleteAll()">Delete</button>`;

    const deleteAllElem = document.querySelector(".deleteAll");
    deleteAllElem.addEventListener('click', () => {
        deleteAll();
    })
    for (let i = 1; i <= pageCount; i++) {
        let bttn = paginatedButtons(i);
        bttn.addEventListener('click', () => {
            currentPage = i;
            showUsers(data, userRows, rows, currentPage);
            paginationButtons(data);
        });
        buttonElem.appendChild(bttn);
    }

}


//delete entries fron data array in frontend for Delete button


function deleteOne(deleteIconElem) {
    const row = deleteIconElem.parentNode;
    const userName = row.querySelector("h4").textContent;

    data = data.filter(user => user.name !== userName);
    row.remove();
    showUsers(data, userRows, rows, currentPage);
    paginationButtons()
}


function deleteAll() {
    const selectedUsers = document.getElementsByName("selectOne");

    selectedUsers.forEach(checkbox => {
        if (checkbox.checked) {
            const row = checkbox.closest('.userDetails');
            const userName = row.querySelector("h4").textContent;
            
            data = data.filter(user => user.name !== userName);
            row.remove();
        }
    });
    
    paginationButtons(data);
}

//SelctAll button

function selectAllLogic() {
    const selectAllElem = document.querySelector(".selectAll");
    const checkboxes = document.getElementsByName("selectOne");
    selectAllElem.addEventListener("click",() => {
        for(let i=0;i<checkboxes.length;i++){
            checkboxes[i].checked = selectAllElem.checked;
         }})
        }

selectAllLogic();





