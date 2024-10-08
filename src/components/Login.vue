<template>
  <div class="login-container">
    <div class="login-left">
      <img src="../assets/login1.png" alt="" />
      <img src="../assets/login2.png" alt="" />
      <img src="../assets/login3.png" alt="" />
      <img src="../assets/login4.png" alt="" />
    </div>
    <div class="login-right">
      <div class="login-card">
        <div class="welcome-text">
          <div class="welcome-one">欢迎使用 Youyi_AI !</div>
          <div class="welcome-two">
            Youyi_AI 是面向工业设计的生成式人工智能平台（AIGID）。
          </div>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-position="top"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名:" prop="name">
            <el-input
              v-model="ruleForm.name"
              :validate-event="false"
              placeholder="请输入您的用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              :validate-event="false"
              placeholder="请输入您的密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item> -->

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              class="submit-btn"
              >提&nbsp;&nbsp;&nbsp;交</el-button
            >
            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
        <div class="login-logo">
          <img src="../assets/loginlogo.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin } from "../api/index";
import { Session } from "@/utils/storage";

export default {
  name: "Login",
  data() {
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        pass: "",
        // checkPass: '',
      },
      rules: {
        name: [{ validator: checkName, trigger: "change" }],
        pass: [{ validator: validatePass, trigger: "change" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            username: this.ruleForm.name,
            password: this.ruleForm.pass,
          };
          Session.clear(); //清楚浏览器全部缓存
          userLogin(data).then(
            (response) => {
              console.log("请求成功了!", response.data.token);
              Session.set("token", response.data.token);
              this.$router.push({ path: "/home" });
              //console.log('请求成功了this.projectList!',this.projectList);
            },
            (error) => {
              console.log("请求失败了!", error);
            }
          );
          // alert('submit!');
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  // position: absolute;
  // left: 0;
  // top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  // height: 100vh;
  height: 100%;
  padding: 24px 0 24px 24px;
  box-sizing: border-box;
  background: #efefef;
  .login-left {
    // float: left;
    width: 924px;
    margin-right: 12px;
  }
  .login-right {
    // float: right;
    width: calc(100% - 936px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-card {
      width: 640px;
      height: 652px;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 88px 80px 40px;
      box-shadow: 0 0 5px 0 #e1e1e1;
      .welcome-text {
        .welcome-one {
          font-family: AliBold;
          font-size: 40px;
          line-height: 56px;
        }
        .welcome-two {
          font-family: AliMedium;
          font-size: 16px;
          line-height: 22px;
        }
      }
      .demo-ruleForm {
        margin-top: 32px;
        /deep/.el-form-item__label {
          padding: 0;
          line-height: 22px;
          margin-bottom: 8px;
          font-family: AliBold;
          font-size: 16px;
        }
        /deep/.el-input__inner {
          width: 480px !important;
          height: 48px !important;
          border: 1px solid #5c5c5c;
          border-radius: 8px !important;
        }
        /deep/.el-input__inner::placeholder {
          color: #535353;
          font-family: AliMedium !important;
          font-size: 16px !important;
        }
        .submit-btn {
          width: 480px;
          height: 48px;
          border-radius: 8px;
          margin-top: 38px;
          background: #000;
        }
      }
      .login-logo {
        margin-top: 41px;
        display: flex;
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>