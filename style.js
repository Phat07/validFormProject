// rule validate ( những yêu cầu để được công nhận)
//  Email: isRequired, isEmail
// Name: isRequired, isName(có thể là tiếng việt, tiếng anh, max50)
// Gioi tính(Gender):isRequired
// country: isRequired
// password: isRequired, min 8, max20
// confirmPassword: isRequired, min8 , max20, isSame(password)
// agree: isRequired

// mình phải viết regex cho email và cho name
const REG_EMAIL= /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME=/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;

// viết những hàm nhận vào value và kiểm tra theo 1 tiêu chí gì đó
// nếu value đó hợp lệ thì return "" / nếu value đó ko hợp lệ thì return ha chữi
const isRequired=(value) => (value!==""? "":"That field is required");// nhập chuỗi rỗng thì chửi toán tử 3 ngôi
const isEmail=(value)=>REG_EMAIL.test(value)?"":"Email is not validate";
const isName=(value)=>REG_NAME.test(value)?"":"Name is not validate";

// curring
const min= (num) => (value) =>value.length >=num ?"" : `Min is ${num}`;
const max= (num) => (value) =>value.length <=num ?"" : `Max is ${num}`;
const isSame=(paramValue,fieldName1,fieldName2)=> value =>
    paramValue==value ? "":`${fieldName1} Không Khớp ${fieldName2}`;
//value : giá trị của controlNode
//Funcs: mảng các hàm mà value cần check
//     vd:  value: email.value
//          funcs: [isRequired, isEmail]
//     vd:  value: name.value
//          funcs: [isRequired, isEmail, max(50)]
//ParentNode: là element cha của controlNode => để chèn câu chữi
//ControlNodes : các element dạng input

//hàm tạo thông báo chữi
const createMsg=(parentNode, controlNodes,msg)=>{
    const invalidDiv=document.createElement("div");
    invalidDiv.className="invalid-feedback"
    invalidDiv.textContent=msg
    parentNode.appendChild(invalidDiv);
    controlNodes.forEach(inputItem => {
        inputItem.classList.add("is-invalid");
    });
};

// viết 1 hàm nhận vào value nhận vào funcs, parentNode, ControlNodes
// nó sẽ gọi lần lượt các hàm trong funcs ra để kiểm tra value
//  nếu như quá trình kiểm tra trả ra chuỗi "chữi" thì ta
// sẽ sử dụng createMsg (parentNode, ControlNodes , "chữi" : msg)

const isValid=(paramObject)=>{
    const{value, funcs,parentNode,controlNodes}=paramObject;
    for (const funcCheck of funcs) {
        let msg=funcCheck(value)
        if (msg) {
            createMsg(parentNode,controlNodes,msg)
            return msg;
        }
    }
    return "";
};
const clearMsg=()=>{
    document.querySelectorAll(".is-invalid").forEach(inputNode => {
        inputNode.classList.remove("is-invalid");
    });
    document.querySelectorAll(".invalid-feedback").forEach(divMsg => {
        divMsg.remove();
    });
};
// sự kiện diễn ra khi form bị submit
document.querySelector("form").addEventListener("submit",event=>{
    event.preventDefault();
    // xóa thông báo lỗi
    clearMsg();
    // dom tới các controlsNode
    const emailNode = document.querySelector("#email")
    const namelNode = document.querySelector("#name")
    const genderlNode = document.querySelector("#gender")
    const countryNode=document.querySelector("input[name='country']:checked")
    const passwordNode=document.querySelector("#password")
    const confirmPasswordNode=document.querySelector("#confirmpassword")
    const agreeNode=document.querySelector("input#agree:checked")

    const errorMsg=[
    isValid({value:emailNode.value,funcs:[isRequired,isEmail],
        parentNode:emailNode.parentElement,controlNodes:[emailNode]}),
        // name
    isValid({value:namelNode.value,funcs:[isRequired,isName,max(50)],
            parentNode:namelNode.parentElement,controlNodes:[namelNode]}),
        // gender
    isValid({value:genderlNode.value,funcs:[isRequired],
            parentNode:genderlNode.parentElement,controlNodes:[genderlNode]}),
        // country
    isValid({value:countryNode? countryNode.value:"",
            funcs:[isRequired],
            parentNode:document.querySelector(".form-check-country").parentElement,
            controlNodes:document.querySelectorAll("input[name='country']")}),
        // password
    isValid({value:passwordNode.value,
            funcs:[isRequired,min(8),max(20)],
            parentNode:passwordNode.parentElement,
            controlNodes:[passwordNode]}),
        // confirmpassword
    isValid({value:confirmPasswordNode.value,
            funcs:[isRequired,min(8),max(20),isSame(passwordNode.value,"ConfirmedPassword","Password")],
            parentNode:confirmPasswordNode.parentElement,
            controlNodes:[confirmPasswordNode]}),
        // agree
    isValid({value:agreeNode? agreeNode.value:"",
        funcs:[isRequired],
        parentNode:document.querySelector("#agree").parentElement,
        controlNodes: [document.querySelector("#agree")]}),

    ];
    
    let isValidForm=errorMsg.every(item => !item)
    if(isValidForm){
        alert("Form is valid");
        clearMsg();
    }
});

// destructuring