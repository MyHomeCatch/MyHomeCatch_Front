<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  errorMessage.value = '';
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });
  if (success) {
    console.log('로그인 성공 token: ', authStore.token);
  }
  if (!success) errorMessage.value = '로그인 실패';
};
</script>

<template>
  <!-- <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" required />
      <input
        type="password"
        v-model="password"
        placeholder="비밀번호"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div> -->
  <div class="login-page" ng-app="">
    <div class="login-content login-content-signin" ng-hide="showSignIn">
      <div>
        <h2>Log in</h2>
        <form class="wrapper-box" role="form" ng-submit="login()">
          <input
            type="email"
            ng-model="email"
            class="form-control form-control-email"
            placeholder="Email address"
            required
          />
          <input
            type="password"
            ng-model="password"
            class="form-control form-control-password"
            placeholder="Password"
            required
          />
          <!-- <div class="checkbox pull-left">
          <label>
            <input type="checkbox"> Remember me.
          </label>
        </div> -->
          <a class="outer-link pull-left" href="#/forgot">Forgot Password</a>
          <button type="submit" class="btn btn-submit btn-default pull-right">
            Log in
          </button>
        </form>
      </div>
    </div>

    <div
      class="login-content login-content-signup ng-hide"
      ng-show="showSignIn"
    >
      <div>
        <h2>Sign Up</h2>
        <form class="wrapper-box" role="form" ng-submit="register()">
          <input
            type="text"
            ng-model="username"
            class="form-control form-control-username"
            placeholder="Username"
            required
          />
          <input
            type="email"
            ng-model="email"
            class="form-control form-control-email"
            placeholder="Email address"
            required
          />
          <input
            type="password"
            ng-model="password"
            class="form-control form-control-password"
            placeholder="Password"
            required
          />
          <!-- <div class="checkbox pull-left">
          <label>
            <input type="checkbox"> Remember me.
          </label>
        </div> -->
          <button type="submit" class="btn btn-submit btn-default pull-right">
            Sign up
          </button>
        </form>
      </div>
    </div>

    <div class="login-switcher">
      <div class="login-switcher-signin" ng-show="showSignIn">
        <h3>Have an account?</h3>
        <button ng-click="showSignIn=false">Login</button>
      </div>
      <div class="login-switcher-signup" ng-hide="showSignIn">
        <h3>Don't have an account?</h3>
        <button ng-click="showSignIn=true">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@red: #ef6161;
@green: #7ac142;

.login-page {
  position: absolute;
  width: 100%;
  height: 80%;
  left: 0;
  background: #fff;

  .login-content {
    width: 420px;
    padding: 40px;
    height: 500px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 1;
    position: absolute;
    background: #fff;
    box-shadow: 0 0px 70px rgba(0, 0, 0, 0.1);
    border-top: 5px solid @green;
    float: left;
    -webkit-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
    transition-delay: 0.2s;

    &.login-content-signin.ng-hide:not(.ng-hide-animate) {
      transition-delay: 0s;
      display: block !important;
      opacity: 0;
      z-index: -1;
      -webkit-transform: translate(-45%, -50%);
      transform: translate(-45%, -50%);
    }
    &.login-content-signup.ng-hide:not(.ng-hide-animate) {
      transition-delay: 0s;
      display: block !important;
      opacity: 0;
      z-index: -1;
      -webkit-transform: translate(-55%, -50%);
      transform: translate(-55%, -50%);
    }

    h2 {
      text-align: left;
      color: @green;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }

    form.wrapper-box {
      margin-top: 40px;
      input {
        margin-top: 20px;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 0;
        padding-left: 0;
        box-shadow: none;
        -webkit-transition: all 0.1s ease-out;
        transition: all 0.1s ease-out;
        &:valid {
          border-bottom: 1px solid @green;
        }
        &:focus:invalid {
          border-bottom: 1px solid @red;
        }
      }

      ::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
      :-moz-placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
      ::-moz-placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
      :-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.5);
      }

      button {
        display: inline-block;
        margin-top: 50px;
        border: 2px solid @green;
        background: @green;
        border-radius: 25px;
        padding: 3px 12px 5px 12px;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0px;
        -webkit-transition: all 0.1s ease-out;
        transition: all 0.1s ease-out;
        &:hover {
          color: @green;
          background: #fff;
          border: 2px solid @green;
        }
        &:active {
          box-shadow: none;
        }
      }
    }

    .outer-link {
      display: inline-block;
      margin-top: 50px;
      padding: 5px 0;
      display: block;
      color: rgba(0, 0, 0, 0.4);
      -webkit-transition: all 0.1s ease-out;
      transition: all 0.1s ease-out;
      &:hover {
        -webkit-transition: all 0s ease-out;
        transition: all 0s ease-out;
        color: rgba(0, 0, 0, 0.8);
        text-decoration: none;
      }
    }

    &.login-content-signin > div,
    &.login-content-signup > div {
      overflow: hidden;
      top: 50%;
      position: relative;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    &.login-content-signin {
      margin-left: -130px;
    }
    &.login-content-signup {
      margin-left: 130px;
    }
  }

  .login-switcher {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 660px;
    height: 400px;
    box-shadow: 0 0px 20px rgba(0, 0, 0, 0.03);

    & > div {
      width: 40%;
      margin-top: 125px;

      &.login-switcher-signin {
        float: left;
      }
      &.login-switcher-signup {
        float: right;
      }

      h3 {
        color: rgba(0, 0, 0, 0.4);
        text-align: center;
        font-size: 14px;
      }
      button {
        display: block;
        margin: 20px auto 0 auto;
        outline: 0;
        background: none;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        color: rgba(0, 0, 0, 0.3);
        font-weight: bold;
        font-size: 14px;
        padding: 4px 12px 5px 12px;
        -webkit-transition: all 0.1s ease-out;
        transition: all 0.1s ease-out;

        &:hover {
          border: 2px solid @green !important;
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }

    .login-switcher-signin,
    .login-switcher-signup {
      -webkit-transition: all 0.1s ease-out;
      transition: all 0.1s ease-out;
    }
    .login-switcher-signin.ng-hide:not(.ng-hide-animate),
    .login-switcher-signup.ng-hide:not(.ng-hide-animate) {
      display: block !important;
      opacity: 0;
      -webkit-transform: translateY(10px);
      transform: translateY(10px);
    }
  }
}
</style>
