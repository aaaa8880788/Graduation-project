<template>
    <div class="login">
      <div class="login_wrap">
        <!-- 左侧部分 -->
        <div class="login_wrap_left">
          <video class="left_video" src="@/assets/vedio/vedio.mp4" autoplay loop muted></video>
        </div>
        <!-- 右侧登录信息部分 -->
        <div class="login_wrap_right">
          <div class="form">
            <div class="title">党建后台管理系统</div>
            <div class="content">
              <div class="username">用户名</div>
              <input class="text" type="text" v-model="formData.name" autofocus />
              <div class="password">密码</div>
              <input class="text" type="password" v-model="formData.password" />
            </div>
            <div class="footer">
              <button class="btn" @click="resetBtnClick">重置</button>
              <button class="btn" @click="loginBtnClick">登录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from 'store/login';
import { ElMessage } from "element-plus";
import { accountLoginRequest } from "@/network/login";
// 定义属性
const formData = ref({
  name: "admin",
  password: "admin",
});
const loginStore = useLoginStore();
const router = useRouter();

// 定义方法

// 重置按钮点击触发
const resetBtnClick = () => {
  formData.value.name = ''
  formData.value.password = ''
};
// 登录按钮点击触发
const loginBtnClick = async () => {
  const result = await accountLoginRequest("/login", formData.value);
  if (result.code === 200) {
    // 保存token
    const token = result.token
    loginStore.setToken({
      token
    });
    // 弹窗提示
    ElMessage({
      message: "登录成功",
      type: "success",
    });
    router.replace("/home");
  } else {
    // 弹窗提示
    ElMessage({
      message: result.message,
      type: "error",
    });
  }
};
</script>

<style scoped lang="less">
.login {
  width: 100vw;
  min-width: 1000px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to left top,
      #d16ba5,
      #c777b9,
      #ba83ca,
      #aa8fd8,
      #9a9ae1,
      #8aa7ec,
      #79b3f4,
      #69bff8,
      #52cffe,
      #41dfff,
      #46eefa,
      #5ffbf1);
}

.login_wrap {
  width: 900px;
  height: 560px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 45px 1px rgba(0, 0, 0, 0.1);
  display: flex;

  .login_wrap_left {
    width: 60%;

    .left_video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .login_wrap_right {
    width: 40%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;

    .form {
      height: 70%;
      width: 75%;

      .title {
        height: 15%;
        text-align: center;
        font-size: 26px;
        color: #70b4e3;
        font-weight: 400;
      }

      .content {
        height: 55%;
        text-align: center;

        .username,
        .password {
          font-size: 18px;
          font-weight: 400;
          color: #70b4e3;
          padding: 20px 0;
        }

        .text {
          width: 100%;
          outline: none;
          border: none;
          border-bottom: 1px solid #70b4e3;
          color: #7bb1f3;
          background-color: rgba(0, 0, 0, 0);
          text-align: center;
        }
      }

      .footer {
        height: 30%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .btn {
          width: 100%;
          height: 40px;
          border-radius: 20px;
          border: none;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          background-image: linear-gradient(120deg, #76daec 0%, #c5a8de 100%);
        }

        .btn:hover {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

</style>
