<template>
  <div class="herder">
    <card>
      <div style="min-height: 200px; ">
        <Form ref="formValidate" :model="formValidate" style="margin-top:20px;" :label-width="100">
          <FormItem label="解说员" prop="city">
            <Row>
              <Col span="12">
              <Select v-model="formItem.coverUrl" style="width:100%">
                <Option v-for="item in Scenicspot" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="选择解说景区" prop="city">
            <Row>
              <Col span="12">
              <Input v-model="formValidate.scenic_name" :maxlength="30" placeholder="景区名字"></Input>
              </Col>
              <Col span="12">
              <Button type="primary" style="margin-left:10px;">确定</Button></Col>
            </Row>
          </FormItem>
          <FormItem label="解说售价" prop="city">
            <Row>
              <Col span="12">
              <Input v-model="formValidate.scenic_name" :maxlength="30" placeholder="景区名字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="解说提成" prop="city">
            <Row>
              <Col span="12">
              <Input v-model="formValidate.scenic_name" :maxlength="30" placeholder="景区名字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="解说语音" prop="city">
            <div class="card">
              <div class="left">
                <div class="card-left">
                  <div class="center" v-for="(item, index) in usrCar" :key="index">
                    <div class="left-lfet">
                      <p class="voice">语音</p>
                      <FormItem>
                        <div class="demo-upload-list" v-if="formItem.coverUrl">
                          <template>
                            <img :src="formItem.coverUrl">
                            <div class="demo-upload-list-cover">
                              <Icon type="ios-eye-outline" @click.native="handleView(formItem.coverUrl)"></Icon>
                              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                          </template>
                        </div>
                        <Upload ref="upload" :on-progress="uploadPro" :show-upload-list="false" :on-success="handleSuccess" :format="['mp3','mp4']" :on-format-error="handleFormatError" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
                          <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="ios-camera" size="20"></Icon>
                          </div>
                        </Upload>
                        <Modal title="View Image" v-model="visible">
                          <img :src="imgName" v-if="visible" style="width: 100%">
                        </Modal>
                      </FormItem>
                      <!-- <Input v-model="formValidate.scenic_name" :maxlength="30" placeholder="景区名字"></Input> -->
                    </div>
                    <div class="left-lfet">
                      <p class="voice">对应景点</p>
                      <Select v-model="formItem.coverUrl" style="width:200px">
                        <Option v-for="item in Scenicspot" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="left card_right">
                <Button type="primary" @click="addScar">新增一行</Button>
              </div>
            </div>
          </FormItem>
          <div class="bottom">
            <Button style="bottom-box" type="primary">提交</Button>
          </div>
        </Form>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileUrl: '',
      pding: [],
      formItem: [],
      Scenicspot: '', //景点
      usrCar: [
        {
          carType: '语音',
          carNumber: '对应景点',
          value1: '',
          value2: ''
        }
      ],
      visible: false,
      formValidate: {}
    }
  },

  methods: {
    //新增一行
    addScar() {
      this.usrCar.push({
        carType: '语音',
        carNumber: '对应景点'
      })
      if (this.usrCar.length >= 2) {
        this.show = true
      } else {
        this.show = false
      }
    },

    handleFormatError(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleSuccess(res, file) {
      this.formItem.coverUrl = res.data.url
    },
    uploadPro(e, file) {
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
.herder {
  height: 100%;
  .card {
    display: flex;
    justify-content: space-around;
    .left {
      width: 50%;
      position: relative;
      .bottom {
        position: fixed;
        top: 0;
      }
      // min-height: 400px;
      .card-left {
        overflow: auto;
        height: 300px;
        border: 1px solid #eee;
        .center {
          width: 100%;
          height: 80px;
          display: flex;
          justify-content: space-around;
          .left-lfet {
            padding: 10px;
            display: flex;
            justify-content: space-around;
            .voice {
              width: 80px;
              // height: 30px;
            }
          }
        }
      }
    }
    .card_right {
      padding: 10px;
    }
  }
}
</style>


