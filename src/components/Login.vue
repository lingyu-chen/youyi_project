<template>
    <div class="container">
      <div class="container-login">
        <div class="login-text">
          <!-- <div>
            <el-avatar> user </el-avatar>
          </div> -->
          用户登录
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!-- <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item> -->
  
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" class="submit-btn">提交</el-button>
            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
        <!-- <router-link class="forget-password">忘记密码？</router-link> -->
      </div>
    </div>
</template>
  <script>
  import {userLogin} from '../api/index'
  import { Session } from '@/utils/storage';

  export default {
    name: 'Login',
    data() {
      var checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        ruleForm: {
          name: '',
          pass: '',
          // checkPass: '',
        },
        rules: {
          name: [
            { validator: checkName, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
                username:this.ruleForm.name,
                password:this.ruleForm.pass,
            }
            Session.clear();//清楚浏览器全部缓存
            userLogin(data).then(
                response => {
                console.log('请求成功了!',response.data.token);
                Session.set('token',response.data.token);
                this.$router.push({ path: '/home' });
                //console.log('请求成功了this.projectList!',this.projectList);
            },
                error => {
                console.log('请求失败了!',error);
                }
      )
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  /* .container {
    position: relative;
     top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 800px; 
  } */
  
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 450px;
    background: linear-gradient(to bottom, #d2eaf4, #efe3e3, #a3bac2, #80a9ad);
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    .container-login {
      width: 100%;
      .login-text {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 30px;
        font-size: 20px;
      }
      .demo-ruleForm {
        width: 80%;
        .submit-btn {
          width: 100%;
          border-radius: 25px;
          background-color: #6a9493;
        }
      }
    }
  }
  </style>