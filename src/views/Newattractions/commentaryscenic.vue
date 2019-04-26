<template>
  <div class="herder">
    <card>

      <div style="display: flex;margin-bottom: 20px;justify-content: space-between;">
        <div>
          <Button type="primary" @click="Newly">新增解说内容</Button>
        </div>
        <div>
          <Input style="width: 200px;" @on-search="search" search enter-button="搜索" v-model="filter.scenicName" placeholder="搜索景区" />
        </div>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" show-total :current="pageNumber" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </card>
    <Modal v-model="modal1" title="新增解说内容" width='800' @on-cancel="cancel" footer-hide>
      <Form ref="formValidate" :model="formValidate" :label-width="100" key="form1">
        <FormItem label="解说员">
          <Row>
            <Col span="">
            <Select v-model="formValidate.narratorId" filterable>
              <Option v-for="item in jieShuoList" :value="item.id" :key="item.id">{{ item.nickName }}</Option>
            </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="解说景区">
          <Row>
            <Col span="">
            <Select v-model="formValidate.scenicId" @on-change="handleScList" filterable>
              <Option v-for="item in scList" :value="item.id" :key="item.id">{{ item.scenicName }}</Option>
            </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="解说售价">
          <Row>
            <Col span="">
            <InputNumber :min="0" :max="9999" :formatter="value => `${value}${value === '' ? '' : '元'}`" :active-change="false" v-model="formValidate.narratorPrice"></InputNumber>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="解说提成">
          <Row>
            <Col span="">
            <InputNumber :min="0" :max="100" :formatter="value => `${value}${value === '' ? '' : '%'}`" :active-change="false" v-model="formValidate.narratorPercentage"></InputNumber>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="解说语音">
          <card>
            <Row>
              <Col span="">
              <Button @click="addRow">新增一行</Button>
              </Col>
            </Row>
            <div style="margin-top: 10px;">
              <card style="">
                <row>
                  <Col span="16">
                  <span>语音</span>
                  </Col>
                  <Col span="6">
                  <span>景点</span>
                  </Col>
                  <Col span="2">
                  <span>操作</span>
                  </Col>
                </row>

              </card>

            </div>
            <Row v-for="(item, index) in formValidate.narratorVoiceStr" :key="index" style="margin-top: 10px;">
              <card>
                <row>
                  <Col span="16">
                  <Button style="position: relative;">
                    <input style="opacity: 0;width: 100%;height: 100%;position: absolute;top: 0;left: 0;" :ref="'file' + index" type="file" name="" id="" value="" @change="upload(item, $event)" />
                    点击上传
                  </Button>
                  {{item.voiceName}}
                  </Col>
                  <Col span="6">
                  <Select v-model="item.spotId" placeholder="先选景区.." filterable style="width: 120px;">
                    <Option v-for="item in scInList" :value="item.id" :key="item.id">{{ item.spotName }}</Option>
                  </Select>
                  </Col>
                  <Col span="2">
                  <Button @click="formValidate.narratorVoiceStr.splice(index, 1)">删除</Button>
                  </Col>
                </row>
              </card>
            </Row>
          </card>
        </FormItem>
        <div class="Button_base">
          <Button style="bottom-box" type="primary" @click="sub">提交</Button>
        </div>
      </Form>
    </Modal>
    <Modal v-model="modal2" title="编辑解说内容" width='800' @on-cancel="cancel2" footer-hide>
      <Form ref="formValidate2" :model="formValidate2" :label-width="100" key="form2">
        <FormItem label="解说景区">
          <Row>
            <Col span="">
            <Select v-model="formValidate2.scenicId" placeholder="查询中..." filterable disabled>
              <Option v-for="item in scList" :value="item.id" :key="item.id">{{ item.scenicName }}</Option>
            </Select>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="解说语音">
          <card>
            <Row>
              <Col span="">
              <Button @click="addRow2">新增一行</Button>
              </Col>
            </Row>
            <div style="margin-top: 10px;">
              <card style="">
                <row>
                  <Col span="16">
                  <span>语音</span>
                  </Col>
                  <Col span="6">
                  <span>景点</span>
                  </Col>
                  <Col span="2">
                  <span>操作</span>
                  </Col>
                </row>

              </card>

            </div>
            <Row v-for="(item, index) in formValidate2.narratorVoiceStr" :key="index" style="margin-top: 10px;">
              <card>
                <row>
                  <Col span="16">
                  <Button style="position: relative;">
                    <input style="opacity: 0;width: 100%;height: 100%;position: absolute;" :ref="'file' + index" type="file" name="" id="" value="" @change="upload(item, $event)" />
                    点击上传
                  </Button>
                  {{item.voiceName}}
                  </Col>
                  <Col span="6">
                  <Select v-model="item.spotId" placeholder="" filterable style="width: 120px;">
                    <Option v-for="item in scInList" :value="item.id" :key="item.id">{{ item.spotName }}</Option>
                  </Select>
                  </Col>
                  <Col span="2">
                  <Button @click="handleEditorDel(item, index)">del</Button>
                  </Col>
                </row>
              </card>
            </Row>
          </card>
        </FormItem>
        <div class="Button_base">
          <Button style="bottom-box" type="primary" @click="subEdit">修改</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal1: false,
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      scInList: [],
      tableData: [],
      filter: {
        scenicName: ''
      },
      // 提成
      Amortization: [],

      tableData: [],
      scList: [],
      columns1: [{
        title: '解说员昵称',
        align: 'center',
        key: 'nickName'
      },
      {
        title: '解说员ID',
        align: 'center',
        key: 'narratorId'
      },
      {
        title: '解说景区',
        align: 'center',
        key: 'scenicName'
      },
      {
        title: '解说数量',
        align: 'center',
        key: 'voiceCount'
      },
      {
        title: '解说售价',
        align: 'center',
        key: 'narratorPrice'
      },
      {
        title: '解说折扣',
        key: 'narratorDiscount',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          let _this = this
          return h('div', [
            h(
              'InputNumber', {
                props: {
                  max: 10,
                  min: 1,
                  value: row.narratorDiscount,
                  step: 0.01,
                  formatter: value => `${value}折`,
                  'active-change': false
                },
                on: {
                  'on-change' (v) {
                    row['endNarratorPrice'] = _this.$tools.mul(_this.$tools.mul(v, 0.1), row.narratorPrice)
                    params.row.narratorDiscount = v;
                  }
                }
              }
            )
          ])
        }
      },
      {
        title: '解说实际价格',
        key: 'endNarratorPrice',
        align: 'center'
      },
      {
        title: '解说提成',
        key: 'narratorPercentage',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          let _this = this
          return h('div', [
            h(
              'InputNumber', {
                props: {
                  max: 100,
                  min: 1,
                  value: row.narratorPercentage,
                  step: 1,
                  formatter: value => `${value}%`,
                  'active-change': false
                },
                on: {
                  'on-change' (v) {
                    params.row.narratorPercentage = v;
                  }
                }
              }
            )
          ])
        }
      },
      {
        title: '编辑操作',
        key: 'address',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              on: {
                click: () => {
                  this.edit(row)

                }
              }
            },
            '编辑景点解说'
          )
        }
      },
      {
        title: '显示/隐藏',
        key: 'isHide',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: row.isHide ? 'default' : 'warning',
                size: 'small'
              },
              on: {
                click: () => {
                  this.$Modal.confirm({
                    title: '操作提示',
                    content: row.isHide ? '在解说页面上显示这条解说内容？' : '在解说页面上隐藏这条解说内容？',
                    onOk: () => {
                      this.$http.rq({
                        url: this.$commonApi.narratorScenicHide,
                        method: 'put',
                        data: {
                          isHide: !row.isHide,
                          id: row.id
                        }
                      }).then(res => {
                        if (res.code === 200) {
                          // this.$Message.success(res.message)
                          this.getData()
                        } else {
                          this.$Message.error(res.messsage)
                        }
                      })
                    },
                    onCancel: () => {

                    }
                  });
                }
              }
            },
            row.isHide ? '隐藏' : '显示'
          )
        }
      },
      {
        title: '删除',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.rejuet(row)
                }
              }
            },
            '删除'
          )
        }
      },
      {
        title: '保存折扣or提成',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {

                  this.saveZcOrTc(row)
                }
              }
            },
            '保存'
          )
        }
      }
      ],
      fileUrl: '',
      pding: [],
      formItem: [],
      Scenicspot: '', //景点
      usrCar: [{
        carType: '语音',
        carNumber: '对应景点',
        value1: '',
        value2: ''
      }],
      visible: false,
      formValidate: {
        scenicId: '',
        narratorId: '',
        narratorPrice: 0,
        narratorPercentage: 0,
        narratorVoiceStr: []
      },
      jieShuoList: [],
      signData: {},
      allScArray: [], // 筛选框所有景区列表
      formValidate2: {
        id: '',
        scenicId: '',
        delIds: [],
        narratorVoiceStr: []
      },
      modal2: false, // 修改
    }
  },
  created () {
    this.getData()
    // this.getAllScList()
  },
  methods: {
    // 			getAllScList(){
    // 				this.$http.rq({
    // 					url: this.$commonApi.getAllScList
    // 				}).then(res => {
    // 					if (res.code === 200) {
    // 						this.allScArray = res.data
    // 					} else {
    // 					}
    // 				})
    // 			},
    // 删除时替后台搞数据。！
    handleEditorDel (row, index) {
      if (row.id) {
        this.formValidate2.delIds.push(row.id)
      } else {

      }
      this.formValidate2.narratorVoiceStr.splice(index, 1)

    },
    search () {
      this.pageNumber = 1;
      this.getData()
    },
    subEdit () {
      if (this.$tools.check(this.formValidate2, ['scenicId', 'delIds'])) {

        let par = {
          ...this.formValidate2
        }
        par['narratorVoiceStr'] = JSON.stringify(par['narratorVoiceStr'])
        par.delIds = par.delIds.join(',');
        this.$http.rq({
          url: this.$commonApi.updateScAudio,
          method: 'put',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.modal2 = false
            this.getData()
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.error('请填写完整！')
      }
    },
    sub () {
      if (this.$tools.check(this.formValidate, ['narratorPrice', 'narratorPercentage'])) {

        let par = {
          ...this.formValidate
        }
        par['narratorVoiceStr'] = JSON.stringify(par['narratorVoiceStr'])
        this.$http.rq({
          url: this.$commonApi.addAudio,
          method: 'post',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.modal1 = false
            this.getData()
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.error('请填写完整！')
      }
    },
    // 切换增加解说 里的 景区列表
    handleScList (v) {
      this.scInList = []
      this.formValidate.narratorVoiceStr = []
      if (v === '') {
        return
      } else {
        this.$http.rq({
          url: this.$commonApi.getScBySclist,
          data: {
            scenicId: v
          }
        }).then(res => {
          if (res.code === 200) {
            this.scInList = res.data
          } else {
            this.scInList = []
            this.$Message.error('根据景区获取景点失败')
          }
        })
      }
    },
    addRow () {
      this.formValidate.narratorVoiceStr.push({
        voiceUrl: '',
        voiceName: '',
        spotId: ''
      })
    },
    addRow2 () {
      this.formValidate2.narratorVoiceStr.push({
        voiceUrl: '',
        voiceName: '',
        spotId: ''
      })
    },
    upload (item, e) {
      var file = e.target.files[0];
      let fileName = file.name.slice(0, file.name.lastIndexOf('.'));

      let fileType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);

      // 类型判断
      if (['mp3', 'MP3'].indexOf(fileType) == -1) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + fileName + ' is incorrect, please select mp3.'
        })
        return
      }

      if (file == undefined) {
        return
      }

      if (file.name.lastIndexOf('.') == -1) { //如果不存在"."  
        this.$message({
          type: 'error',
          message: '文件路径不正确！'
        })
        return
      }

      let param = new FormData(); //创建form对象
      let uid = this.$tools.getGUID()
      let key = this.signData.dir + '/' + uid + '.' + fileType;
      param.append('key', key); //添加form表单中其他数据
      param.append('policy', this.signData.policy); //添加form表单中其他数据
      param.append('OSSAccessKeyId', this.signData.OSSAccessKeyId); //添加form表单中其他数据
      param.append('success_action_status', '200'); //添加form表单中其他数据
      param.append('signature', this.signData.signature); //添加form表单中其他数据
      param.append('file', file); //通过append向form对象添加数据
      let _this = this;

      this.$http.rq({
        url: this.fileUrl,
        method: 'post',
        data: param,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        notQs: true,
        timeout: 150000000,
        onUploadProgress (e) {
          let loaded = e.loaded,
            total = e.total;
          _this.$nextTick(() => {
            let percent = Math.ceil((loaded / total) * 100);
            if (_this.pding.length === 0) {
              var percents = {
                val: percent,
                not: uid
              }

              if (percent >= 100) {
                return
              }

              _this.pding.push(percents)
              _this.$Notice.info({
                title: '上传进度（' + fileName + '）',
                duration: 0,
                name: uid,
                top: 100,
                render: h => {
                  return h('Progress', {
                    props: {
                      percent: percents.val
                    }
                  })
                }
              })
            } else {
              let f = false
              for (let i = 0, len = _this.pding.length; i < len; i++) {
                if (_this.pding[i].not == uid) {
                  if (percent >= 100) {
                    _this.$Notice.close(_this.pding[i].not)
                    _this.pding.splice(i, 1)
                  } else {
                    _this.pding[i].val = percent
                  }
                  f = true
                  break
                }
              }
              if (!f) {
                var percents = {
                  val: percent,
                  not: uid
                }
                if (percent >= 100) {
                  return
                }
                _this.pding.push(percents)
                _this.$Notice.info({
                  title: '上传进度',
                  duration: 0,
                  name: uid,
                  top: 100,
                  render: h => {
                    return h('Progress', {
                      props: {
                        percent: percents.val
                      }
                    })
                  }
                })
              }
            }

          })



        }
      }).then(res => {
        item.voiceUrl = this.fileUrl + '/' + key
        item.voiceName = fileName
        e.target.value = ''
      })

    },

    getFileSign () {
      this.$http.rq({
        url: this.$commonApi.getFileSign
      }).then(res => {
        if (res.code === 200) {
          this.signData = {
            dir: res.data.dir,
            policy: res.data.policy,
            OSSAccessKeyId: res.data.accessId,
            'success_action_status': '200',
            signature: res.data.signature
          }
          this.fileUrl = res.data.host
        } else {
          this.$Message.error('获取上传签名失败')
        }
      })
    },
    saveZcOrTc (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否保存？</p>',
        onOk: () => {
          this.$nextTick(() => {
            this.$http.rq({
              url: this.$commonApi.updateNarratorScenic,
              method: 'put',
              data: {
                id: row.id,
                narratorDiscount: row.narratorDiscount,
                narratorPercentage: row.narratorPercentage
              }
            }).then(res => {
              if (res.code === 200) {
                this.getData()
                this.$Message.success(res.message)
              } else {
                this.$Message.error(res.message)
              }
            })
          })

        },
        onCancel: () => {

        }
      })
    },
    //删除操作
    rejuet (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否删除</p>',
        onOk: () => {

          this.$http.rq({
            url: this.$commonApi.delNarratorScenic,
            method: 'Delete',
            data: {
              id: row.id
            }
          }).then(res => {
            if (res.code === 200) {
              this.getData()
              this.$Message.success(res.message)
            } else {
              this.$Message.error(res.message)
            }
          })
        },
        onCancel: () => {

        }
      })
    },

    //编辑景点
    edit (row) {
      this.getScList()
      this.getFileSign()
      this.$http.rq({
        url: this.$commonApi.detailNarratorScenic + '/' + row.id
      }).then(res => {
        if (res.code === 200) {
          this.formValidate2['id'] = row.id
          this.formValidate2['scenicId'] = row.scenicId
          this.formValidate2['narratorVoiceStr'] = res.data
        } else {
          this.$Message.error(res.message)
        }
      })

      this.$http.rq({
        url: this.$commonApi.getScBySclist,
        data: {
          scenicId: row.scenicId
        }
      }).then(res => {
        if (res.code === 200) {
          this.scInList = res.data
        } else {
          this.scInList = []
          this.$Message.error('根据景区获取景点失败')
        }
      })

      this.modal2 = true
    },
    //清空弹框
    cancel () {
      this.scInList = []
      this.scList = []
      this.formValidate = {
        scenicId: '',
        narratorId: '',
        narratorPrice: 0,
        narratorPercentage: 0,
        narratorVoiceStr: []
      }
    },
    cancel2 () {
      this.scList = []
      this.scInList = []
      this.formValidate2 = {
        id: '',
        scenicId: '',
        delIds: [],
        narratorVoiceStr: []
      }
    },
    //删除解说语音
    deleteRow (index, usrCar) {
      if (index === 0) {
        return
      } else {
        usrCar.splice(index, 1)
      }
    },
    // 获取所有景区
    getScList () {
      this.$http.rq({
        url: this.$commonApi.allScList
      }).then(res => {
        if (res.code === 200) {
          this.scList = res.data
        } else {
          this.$Message.error('获取所有景区失败')
        }
      })
    },
    getAllJieShuo () {
      this.$http.rq({
        url: this.$commonApi.getPeople,
        data: {
          roleId: 3
        }
      }).then(res => {
        if (res.code === 200) {
          this.jieShuoList = res.data
        } else {
          this.$Message.error('获取所有解说员失败')
        }
      })
    },
    //新增解说
    Newly () {
      this.getScList()
      this.getAllJieShuo()
      this.getFileSign()
      this.modal1 = true
    },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        scenicName: this.filter.scenicName
      }

      this.$http.rq({
        url: this.$commonApi.narratorScenic,
        data: par
      }).then(res => {
        if (res.code === 200) {
          res.data.forEach(a => {
            a['endNarratorPrice'] = this.$tools.mul(this.$tools.mul(a.narratorDiscount, 0.1), a.narratorPrice)
          })
          this.tableData = res.data
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
          this.$Message.error(res.message)
        }

      })
    },

  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;

  .top {
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .top-left {
      width: 10%;
    }

    .top_right {
      width: 90%;
    }
  }
}

.card {
  display: flex;
  justify-content: space-around;

  .left {
    height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    .bottom {
      position: fixed;
      top: 0;
    }

    .card-left {
      width: 600px;
      overflow-y: auto;

      border: 1px solid #eee;

      .center {
        width: 100%;
        display: flex;
        justify-content: space-around;

        .left-lfet {
          padding: 10px;
          display: flex;
          justify-content: space-around;

          .voice {
            width: 50px;
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
</style>
