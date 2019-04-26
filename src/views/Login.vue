<template>

  <div class="login">
    <card class="card">
      <p slot="title">Login</p>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password" @keyup.enter.native="handleSubmit('formInline')">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="handleSubmit('formInline')">登入</Button>
        </FormItem>
      </Form>
    </card>
  </div>
  </div>
</template>
<script>
import fetch from '../assets/tools/http'
import allApi from '../assets/api/user'
export default {
  data () {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [{
          required: true,
          message: 'Please fill in the user name',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please fill in the password.',
          trigger: 'blur'
        },
        {
          type: 'string',
          min: 5,
          message: 'The password length cannot be less than 6 bits',
          trigger: 'blur'
        }
        ]
      },
      loading: false
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.rq({
            url: '/proxy/login',
            method: 'post',
            data: {
              username: this.formInline.user,
              password: this.formInline.password
            }
          }).then(res => {
            if (res.code === 200) {
              this.$router.replace({
                name: res.data.defaultMenu
              })
            } else {
              this.$Message.info(res.message);
            }
          })
        } else {
          this.$Message.error('Fail!');
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.login {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .card {
    width: 500px;
  }
}
</style>
