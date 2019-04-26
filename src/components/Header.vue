<template>
  <div class="header">
    <div data-v-fae5bece="" class="ivu-layout-header" style="background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 3px 2px;">
      <div data-v-fae5bece="" style="text-align: right; margin-right: 20px;">
        <Dropdown name="pre" @on-click='changepassword'>
          <a href="javascript:void(0)">
            <Avatar :src="$store.state.userInfo['avatarUrl'] || ''" icon="ios-person" size="large" style="margin-right: 4px;" />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="pre">修改头像</DropdownItem>
            <DropdownItem divided name="dd">修改密码</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span>{{$store.state.userInfo['nickName']}}</span>
        <span data-v-fae5bece="" style="margin-right: 30px;">
        </span>
        <i data-v-fae5bece="" class="ivu-icon ivu-icon-ios-log-out" @click="logout" style="font-size: 36px; cursor: pointer;">
        </i>
      </div>
    </div>
    <!-- 修改密码 -->
    <Modal v-model="useCar_modal" title="修改密码" footer-hide width="500" @on-cancel="cancelone" center>
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <Row>
          <FormItem label="输入旧密码" prop="city">
            <Input v-model.trim="formCustom.oldPwd" type="password" :maxlength="30" placeholder="输入旧密码"></Input>
          </FormItem>
          <FormItem label="输入新密码" prop="city">
            <Input v-model.trim="formCustom.newPwd" type="password" :maxlength="30" placeholder="输入新密码"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="city">
            <Input v-model.trim="formCustom.againPwd" type="password" :maxlength="30" placeholder="确认密码"></Input>
          </FormItem>
          <div class="Button_base">
            <Button type="primary" @click="Submit(1)">提交</Button>
          </div>
        </Row>
      </Form>
    </Modal>
    <!-- 修改头像 -->
    <Modal v-model="photo_modal" title="头像" @on-cancel="cancelFile" footer-hide width="500" center>
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <FormItem label="上传头像">
          <div class="demo-upload-list" v-if="formItem.coverUrl">
            <template>
              <img :src="formItem.coverUrl" style="width: 100px;height: 100px;">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(formItem.coverUrl)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
              </div>
            </template>
          </div>
          <Upload ref="upload" :before-upload="beforeUpload" :on-progress="uploadPro" :data="signData" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" :action="fileUrl" type="drag" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="View Image" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
          </Modal>
        </FormItem>
        <div class="Button_base">
          <Button type="primary" @click="Submit(2)">提交</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>
<script>
import fetch from '../assets/tools/http'
import commonApi from '../assets/api/common.js'
export default {
  data () {
    return {
      userInfo: '',
      pding: [],
      formItem: {
        coverUrl: ''
      },
      imgName: '',
      visible: false,
      fileUrl: '',
      photo_modal: false,
      useCar_modal: false, // 修改密码tan'kuan
      formCustom: {
        oldPwd: '',
        newPwd: '',
        againPwd: '',
      },
      signData: {} // 上传签名
    }
  },
  created () {

  },
  methods: {
    //退出
    logout () {
      this.$http.rq({
        url: '/proxy/logout'
      }).then(res => {
        this.$router.replace({
          name: '登录'
        })
      })

    },
    getFileSign () {
      this.$http.rq({
        url: commonApi.getFileSign
      }).then(res => {
        if (res.code === 200) {
          this.signData = {
            key: res.data.dir,
            policy: res.data.policy,
            OSSAccessKeyId: res.data.accessId,
            'success_action_status': '200',
            signature: res.data.signature
          }
          this.fileUrl = res.data.host
          this.photo_modal = true
        } else {
          this.$Message.error('获取上传签名失败')
        }
      })
    },
    beforeUpload (file) {
      this.signData['key'] = this.signData['key'] + '/' + this.$tools.getGUID() + '.' + file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
      return true
    },
    // 清空弹框
    cancelone () {
      this.$tools.reset(this.formCustom)
    },
    cancelFile () {
      this.formItem = {
        coverUrl: ''
      }
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    changepassword (name) {
      if (name == 'pre') {
        this.getFileSign()
      } else {
        this.useCar_modal = true
      }
    },
    // 清空上传的头像
    handleRemove () {
      this.formItem = {
        coverUrl: ''
      }
    },
    //修改密码
    Submit (value) {
      if (value === 1) {
        let par = {
          oldPwd: this.formCustom.oldPwd,
          newPwd: this.formCustom.newPwd,
          againPwd: this.formCustom.againPwd,
        }
        this.$http.rq({
          url: commonApi.accountpwd,
          method: 'put',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message);
            this.formCustom = {
              oldPwd: '',
              newPwd: '',
              againPwd: '',
            }
            this.useCar_modal = false
          } else {
            this.$Message.error(res.message);
          }

        })
      } else {
        if (this.formItem['coverUrl'] !== '') {
          this.$http.rq({
            url: commonApi.account,
            method: 'put',
            data: {
              avatarUrl: this.formItem['coverUrl']
            }
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message + '：刷新页面即可切换新的头像');
              this.photo_modal = false
            } else {
              this.$Message.error(res.message);
            }

          })
        } else {
          this.$Message.warning('头像不能为空')
        }
      }
    },
    handleSuccess (res) {
      this.formItem.coverUrl = this.fileUrl + '/' + this.signData.key
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    uploadPro (e, file) {
      if (this.pding.length === 0) {
        var percent = {
          val: e.percent,
          not: file.uid
        }
        if (e.percent >= 100) {
          return
        }
        this.pding.push(percent)
        this.$Notice.info({
          title: '上传进度（' + file.name + '）',
          duration: 0,
          name: percent.not,
          top: 100,
          render: h => {
            return h('Progress', {
              props: {
                percent: percent.val
              }
            })
          }
        })
      } else {
        let f = false
        for (let i = 0, len = this.pding.length; i < len; i++) {
          if (this.pding[i].not == file.uid) {
            if (e.percent >= 100) {
              this.$Notice.close(this.pding[i].not)
              this.pding.splice(i, 1)
            } else {
              this.pding[i].val = e.percent
            }
            f = true
            break
          }
        }
        if (!f) {
          var percent = {
            val: e.percent,
            not: file.uid
          }
          if (e.percent >= 100) {
            return
          }
          this.pding.push(percent)
          this.$Notice.info({
            title: '上传进度',
            duration: 0,
            name: percent.not,
            top: 100,
            render: h => {
              return h('Progress', {
                props: {
                  percent: percent.val
                }
              })
            }
          })
        }
      }
    }
  }
}

</script>

<style lang="less" scoped>
.header {
  height: 64px;
  position: relative;
  z-index: 999;
  // background-color:
}
</style>

<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
