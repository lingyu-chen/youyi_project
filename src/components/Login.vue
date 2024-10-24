<template>
  <div class="login-container">
    <div class="login-left">
      <!-- <img src="../assets/login1.png" alt="" />
      <img src="../assets/login2.png" alt="" />
      <img src="../assets/login3.png" alt="" />
      <img src="../assets/login4.png" alt="" /> -->
      <el-carousel trigger="click" arrow="never" height="1032px">
        <el-carousel-item v-for="item in carouselImages" :key="item">
          <div>
            <img :src="item" alt="" />
            <div class="mask-layer">
              <div class="carousel-text">
                <div class="text-title">面向办公座椅的AIGID方案生成</div>
                <div class="text-describe">
                  该工具专注于办公座椅的造型设计，基于AIGID（人工智能生成的工业设计）技术，通过输入基本的设计需求，如风格、代表性造型和，自动生成多样化的造型方案。设计师可以通过工具快速探索不同的椅子造型选项，借助其智能生成能力，快速迭代和优化设计。该工具旨在提高设计效率，帮助设计师在造型创意阶段减少重复工作，并提供丰富的设计灵感来源。
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
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
              @keyup.enter.native="submitForm('ruleForm')"
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
import carouselimage1 from "../assets/carouselimage.png";
import carouselimage2 from "../assets/carouselimage.png";
import carouselimage3 from "../assets/carouselimage.png";
import carouselimage4 from "../assets/carouselimage.png";

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
      carouselImages: [
        carouselimage1,
        carouselimage2,
        carouselimage3,
        carouselimage4,
      ],
    };
  },
  methods: {
    submitForm(formName) {
      console.log("进行回车提交");
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
    .mask-layer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 74%),
        rgba(21, 21, 23, 0) 46%,
        rgba(255, 255, 255, 0)
      );
      .carousel-text {
        position: absolute;
        left: 24px;
        right: 24px;
        bottom: 78px;
        color: #fff;
        .text-title {
          font-family: AliMedium;
          font-size: 40px;
        }
        .text-describe {
          margin-top: 24px;
          font-family: AliRegular;
          font-size: 12px;
        }
      }
    }
    ::v-deep .el-carousel__indicators--horizontal {
      transform: translateX(0);
      left: 20px;
      bottom: 18px;
      .el-carousel__button {
        width: 43px;
        height: 4px;
        border-radius: 2px;
        background-color: #9e9e9e;
      }
    }
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
        ::v-deep.el-form-item__label {
          padding: 0;
          line-height: 22px;
          margin-bottom: 8px;
          font-family: AliBold;
          font-size: 16px;
        }
        ::v-deep.el-input__inner {
          width: 480px !important;
          height: 48px !important;
          border: 1px solid #5c5c5c;
          border-radius: 8px !important;
        }
        ::v-deep.el-input__inner::placeholder {
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