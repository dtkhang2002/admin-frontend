<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '../stores/userStore';
import { UserCreate } from '../interfaces/user';
import {router} from '../routers';
import { useToast } from "primevue/usetoast";
import wave from "../assets/wave.png";
import bg from "../assets/bg.svg";
import avatar from "../assets/avatar.svg";

const toast = useToast();
const userStore = useUser();
const email = ref("");
const fullName = ref("");
const password = ref("");
const confirmPassword = ref("")
const roleId = ref("2");
const submitted = ref(false);

const register = async() => {
	submitted.value = true;
	let userRegisterDetails : UserCreate = {
		full_name: fullName.value,
		email: email.value,
		password: password.value,
		confirm_password: confirmPassword.value,
		role_id: Number(roleId.value)
	}
	console.log(userRegisterDetails);
	try {
		console.log("Start check password");
		if (password.value !== confirmPassword.value) {
			toast.add({ severity: 'error', summary: 'Đăng ký', detail: 'Đăng ký người dùng mới thất bại, mật khẩu xác nhận không khớp', life: 3000 });
			return; 
		}
		console.log("Finish check password");
		await userStore.apiRegisterUser(userRegisterDetails);
		toast.add({ severity: 'success', summary: 'Đăng ký', detail: 'Đăng ký người dùng mới thành công', life: 3000 });
		router.push("/login");
	} catch (e) {
		toast.add({ severity: 'error', summary: 'Đăng ký', detail: 'Đăng ký người dùng mới thất bại, email đã tồn tại', life: 3000 });
	}
}
</script>

<template>
    <img class="wave" :src="wave">
	<div class="container">
		<div class="img">
			<img :src="bg">
		</div>
		<div class="login-content">
			<form @submit.prevent="register">
				<img :src="avatar">
				<h2 class="title">Welcome</h2>
           		<div class="input-div one">
           		   <div class="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div class="div">
						<InputText type="text" class="input" placeholder="Email" v-model="email" required="true" autofocus :class="{'p-invalid': submitted && !email}"/>
						<small class="p-error" v-if="submitted && !email">Email bắt buộc.</small>
           		   </div>
           		</div>
				   <div class="input-div one">
           		   <div class="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div class="div">
           		   		<InputText type="text" class="input" placeholder="Tên" v-model="fullName" required="true" autofocus :class="{'p-invalid': submitted && !fullName}"/>
						<small class="p-error" v-if="submitted && !fullName">Tên bắt buộc.</small>
           		   </div>
           		</div>
           		<div class="input-div pass">
           		   <div class="i"> 
           		    	<i class="fas fa-lock"></i>
           		   </div>
           		   <div class="div">
						<InputText type="password" class="input" placeholder="Mật khẩu" v-model="password" required="true" autofocus :class="{'p-invalid': submitted && !password}"/>
						<small class="p-error" v-if="submitted && !password">Mật khẩu bắt buộc.</small>
            	   </div>
            	</div>
				<div class="input-div pass">
           		   <div class="i"> 
           		    	<i class="fas fa-lock"></i>
           		   </div>
           		   <div class="div">
           		    	<InputText type="password" class="input" placeholder="Xác nhận mật khẩu" v-model="confirmPassword" required="true" autofocus :class="{'p-invalid': submitted && !confirmPassword}"/>
						<small class="p-error" v-if="submitted && !confirmPassword">Xác nhận mật khẩu bắt buộc.</small>
            	   </div>
            	</div>
				
				<div class="div">
    				<InputText type="hidden" class="input" placeholder="RoleId" v-model="roleId" :readonly="true"/>
				</div>
				<Toast/>
				<Button severity="success" class="btn" icon="pi pi-sign-in" label="Đăng ký" type="submit"></Button>
				<router-link to="/login">Đã có tài khoản, đăng nhập tại đây</router-link>
            </form>
        </div>
    </div>
</template>
<style scoped>
*{
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

body{
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
}

.wave{
	position: fixed;
	bottom: 0;
	left: 0;
	height: 100%;
	z-index: -1;
}

.container{
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap :7rem;
    padding: 0 2rem;
}

.img{
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.login-content{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	text-align: center;
}

.img img{
	width: 500px;
}

form{
	width: 360px;
}

.login-content img{
    height: 100px;
}

.login-content h2{
	margin: 15px 0;
	color: #333;
	text-transform: uppercase;
	font-size: 2.9rem;
}

.login-content .input-div{
	position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25px 0;
    padding: 5px 0;
    border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one{
	margin-top: 0;
}

.i{
	color: #d9d9d9;
	display: flex;
	justify-content: center;
	align-items: center;
}

.i i{
	transition: .3s;
}

.input-div > div{
    position: relative;
	height: 45px;
}

.input-div > div > h5{
	position: absolute;
	left: 10px;
	top: 50%;
	transform: translateY(-50%);
	color: #999;
	font-size: 18px;
	transition: .3s;
}

.input-div:before, .input-div:after{
	content: '';
	position: absolute;
	bottom: -2px;
	width: 0%;
	height: 2px;
	background-color: #38d39f;
	transition: .4s;
}

.input-div:before{
	right: 50%;
}

.input-div:after{
	left: 50%;
}

.input-div.focus:before, .input-div.focus:after{
	width: 50%;
}

.input-div.focus > div > h5{
	top: -5px;
	font-size: 15px;
}

.input-div.focus > .i > i{
	color: #38d39f;
}

.input-div > div > input{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border: none;
	outline: none;
	background: none;
	padding: 0.5rem 0.7rem;
	font-size: 1.2rem;
	color: #555;
	font-family: 'poppins', sans-serif;
}

.input-div.pass{
	margin-bottom: 4px;
}

a{
	display: block;
	text-align: right;
	text-decoration: none;
	color: #999;
	font-size: 0.9rem;
	transition: .3s;
}

a:hover{
	color: #38d39f;
}

.btn{
	display: block;
	width: 100%;
	height: 50px;
	border-radius: 25px;
	outline: none;
	border: none;
	background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
	background-size: 200%;
	font-size: 1.2rem;
	color: #fff;
	font-family: 'Poppins', sans-serif;
	text-transform: uppercase;
	margin: 1rem 0;
	cursor: pointer;
	transition: .5s;
}
.btn:hover{
	background-position: right;
}


@media screen and (max-width: 1050px){
	.container{
		grid-gap: 5rem;
	}
}

@media screen and (max-width: 1000px){
	form{
		width: 290px;
	}

	.login-content h2{
        font-size: 2.4rem;
        margin: 8px 0;
	}

	.img img{
		width: 400px;
	}
}

@media screen and (max-width: 900px){
	.container{
		grid-template-columns: 1fr;
	}

	.img{
		display: none;
	}

	.wave{
		display: none;
	}

	.login-content{
		justify-content: center;
	}
}
</style>