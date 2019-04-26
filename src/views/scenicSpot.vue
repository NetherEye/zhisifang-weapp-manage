<template>
  <div class="herder">
    <card>
      <div class="top">
        <div class="top-left">
          <Button type="primary" @click="newly('add')">新增景点</Button>
        </div>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" :current="pageNumber" show-total :pageSize="pageSize" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
      <Modal v-model="Scenicspot" :title="Attractions" width="1200" style="position: relative;" footer-hide @on-cancel="cancelone">
        <div class="staging_tables">
          <card :padding="0">
            <div id="container" style="width:100%;height:500px;"></div>
          </card>
        </div>
        <card style="margin-top: 2px;">
          <Form ref="formValidate" inline :model="formValidate" :label-width="100">
            <FormItem label="景区名称">
              <Select v-model="formValidate.scenicId" @on-change="handleChangeSc" style="width: 200px;" clearable>
                <Option v-for="item in Scenic" :value="item.id" :key="item.id">{{ item.scenicName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="景点名称">
              <Input v-model="formValidate.spotName" :maxlength="30" placeholder="景点名称" style="width: 200px" />
            </FormItem>

            <FormItem label="上传景点图片">
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

            <FormItem label="景点经度">
              <Input v-model="formValidate.lon" :maxlength="30" placeholder="景点经度" style="width: 200px" />
            </FormItem>

            <FormItem label="景点纬度">
              <Input v-model="formValidate.lat" :maxlength="30" placeholder="景点纬度" style="width: 200px" />
            </FormItem>

            <FormItem v-if="Attractions=='新增景点'">
              <Button type="primary" @click="Submin('1')">保存</Button>
            </FormItem>

            <FormItem v-if="Attractions=='修改景点'">
              <Button type="primary" @click="Submin('2')">修改</Button>
            </FormItem>

          </Form>
        </card>

      </Modal>
    </card>
  </div>
</template>
<script>

import fetch from '../assets/tools/http'
import commonApi from '../assets/api/common.js'
export default {
  data () {
    return {
      Map: null, // map实例
      mksArray: [], // 标记数组实例 
      Attractions: '',
      signData: {}, // 上传签名
      listID: '', //列表id
      pding: [],
      Scenic: [], //景区列表
      Scenicspot: false,
      visible: false,
      imgName: '',
      formItem: {
        coverUrl: ''
      },
      formValidate: {
        scenicId: '',
        spotName: '',
        lat: '',
        lon: '',
      },
      fileUrl: '',
      //日期格式
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      tableData: [],
      columns1: [{
        title: '景区名称',
        key: 'scenicName',
        align: 'center'
      },
      {
        title: '景点名称',
        key: 'spotName',
        align: 'center'
      },
      {
        title: '景点图片',
        key: 'photo',
        align: 'center',
        render: (h, params) => {
          return h('div', {
            attrs: {

            },
          }, [
              h('img', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                attrs: {
                  src: params.row.photo,
                  style: 'width: 100px;height: 60px'
                }
              })
            ]);
        }
      },
      {
        title: '经度',
        key: 'lon',
        align: 'center'
      },
      {
        title: '纬度',
        key: 'lat',
        align: 'center'
      },
      {
        title: '编辑操作',
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
                  this.Modifythe(params)
                }
              }
            },
            '编辑'
          )
        }
      },
      {
        title: '是否显示',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'default',
                size: 'small'
              },
              style: {
                marginRight: '10px',
                display: (params.row.isHide == true) ? "none" : "inline-block",
              },
              on: {
                click: () => {
                  this.showModal(params)
                }
              }
            }, '否'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '10px',
                display: (params.row.isHide == false) ? "none" : "inline-block",
              },
              on: {
                click: () => {
                  this.hideModal(params)
                }
              }
            }, '是'),

          ])
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
                  this.remove(params)
                }
              }
            },
            '删除'
          )
        }
      }
      ]
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.init()
  },
  methods: {
    // 切换景区时地图定位到该点
    handleChangeSc (v) {
      if (v === '') {
        return
      }
      for (let i = 0, len = this.Scenic.length; i < len; i++) {
        if (this.Scenic[i].id == v) { // 等于则触发定位
          if (this.Scenic[i].lat && this.Scenic[i].lon) {
            this.Map.panTo(new qq.maps.LatLng(this.Scenic[i].lat, this.Scenic[i].lon));
            this.Map.zoomTo(15);
          }

        }
      }
    },
    //不显示
    hideModal (row) {
      this.listID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>不显示?</p>',
        onOk: () => {
          let par = {
            id: this.listID,
            isHide: 'false'
          }
          this.$http.rq({
            url: commonApi.scenicSpotisHide,
            method: 'put',
            data: par
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getData()
            } else {
              this.$Message.error(res.message);
            }

          })
        },
        onCancel: () => { }
      });
    },
    //显示
    showModal (row) {
      this.listID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>显示?</p>',
        onOk: () => {
          let par = {
            id: this.listID,
            isHide: 'true'
          }
          this.$http.rq({
            url: commonApi.scenicSpotisHide,
            method: 'put',
            data: par
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getData()
            } else {
              this.$Message.error(res.message);
            }

          })
        },
        onCancel: () => { }
      });
    },
    //清空表单
    cancelone () {
      this.$tools.reset(this.formValidate)
      if (this.mksArray.length != 0) {
        this.mksArray[0].setMap(null)
        this.mksArray.length = 0
      }
      this.formItem = {
        coverUrl: ''
      }
    },
    //修改景点
    Modifythe (row) {
      this.listID = row.row.id
      this.Attractions = '修改景点'
      this.getFileSign();
      this.getScenic();
      this.$http.rq({
        url: commonApi.scenicSpot + '/' + this.listID,
      }).then(res => {
        if (res.code === 200) {
          this.formValidate.lat = res.data.lat
          this.formValidate.lon = res.data.lon

          this.Map.panTo(new qq.maps.LatLng(res.data.lat, res.data.lon));
          this.Map.zoomTo(15);

          var lngOrlat = new qq.maps.LatLng(res.data.lat, res.data.lon);
          let mks = new qq.maps.Marker({
            position: lngOrlat,
            map: this.Map
          });
          this.mksArray.push(mks)

          this.formValidate.scenicId = res.data.scenicId
          this.formValidate.spotName = res.data.spotName
          this.formItem.coverUrl = res.data.photo
        } else {

        }
      })
      this.Scenicspot = true
    },
    //获取签名
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
      this.signData['key'] = this.signData['key'] + '/' + this.$tools.getGUID() + '.' + file.name.substring(file.name.lastIndexOf(
        '.') + 1, file.name.length);
      return true
    },
    //获取景区列表分页
    getScenic () {
      this.$http.rq({
        url: commonApi.scenicNopage,
      }).then(res => {
        if (res.code === 200) {
          this.Scenic = res.data

        } else { }
      })
    },
    //新增景点
    newly (value) {
      this.Attractions = '新增景点'
      this.getFileSign();
      this.getScenic();
      this.Scenicspot = true
    },
    Submin (val) {
      if (val === '1') {
        if (this.$tools.check(this.formValidate)) {
          if (this.formItem['coverUrl'] == '') {
            this.$Message.error('图片不能为空！');
            return
          }
          let par = {
            scenicId: this.formValidate.scenicId,
            spotName: this.formValidate.spotName,
            lat: this.formValidate.lat,
            lon: this.formValidate.lon,
            photo: this.formItem['coverUrl']
          }
          this.$http.rq({
            url: commonApi.scenicSpot,
            method: 'post',
            data: par
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.Scenicspot = false
              this.cancelone()
              this.getData();
            } else {
              this.$Message.error(res.message);
            }
          })
        } else {
          this.$Message.error('请填写完整！');
        }
      } else {
        if (this.$tools.check(this.formValidate)) {
          if (this.formItem['coverUrl'] == '') {
            this.$Message.error('图片不能为空！');
            return
          }
          let par = {
            id: this.listID,
            scenicId: this.formValidate.scenicId,
            spotName: this.formValidate.spotName,
            lat: this.formValidate.lat,
            lon: this.formValidate.lon,
            photo: this.formItem['coverUrl']
          }

          this.$http.rq({
            url: commonApi.scenicSpot,
            method: 'put',
            data: par
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.Scenicspot = false
              this.cancelone()
              this.getData();
            } else {
              this.$Message.error(res.message);
            }
          })
        } else {
          this.$Message.error('请填写完整！');
        }
      }



    },
    //获取景区列表分页
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      this.$http
        .rq({
          url: commonApi.scenicSpot,
          data: par
        })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0
            this.$Message.error(res.message)
          }
        })
    },
    //删除
    remove (row) {
      this.listID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>删除?</p>',
        onOk: () => {
          let par = {
            id: this.listID
          }
          this.$http.rq({
            url: commonApi.scenicSpot,
            data: par,
            method: 'delete',
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.getData()
            } else {
              this.$Message.error(res.message)
            }
          })
        },
        onCancel: () => { }
      })
    },
    // 确认
    ok () { },
    //日期变化
    getStartTime () { },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    init () {
      //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      //设置地图中心点
      var myLatlng = new qq.maps.LatLng(26.65, 106.63)
      //定义工厂模式函数
      var myOptions = {
        zoom: 8, //设置地图缩放级别
        center: myLatlng, //设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
      }

      //获取dom元素添加地图信息
      var th = this
      var map = new qq.maps.Map(document.getElementById('container'), myOptions);

      qq.maps.event.addListener(map, 'click', function (event) {
        th.formValidate.lat = event.latLng.getLat()
        th.formValidate.lon = event.latLng.getLng()

        if (th.mksArray.length != 0) {
          th.mksArray[0].setMap(null)
          th.mksArray.length = 0
        }

        let mks = new qq.maps.Marker({
          position: event.latLng,
          map: map
        });
        th.mksArray.push(mks)
      })

      this.Map = map
    },
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove () {
      this.formItem = {
        coverUrl: ''
      }
    },
    handleSuccess (res) {
      this.formItem.coverUrl = this.fileUrl + '/' + this.signData.key
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleSubmit () {
      if (tools.check(this.formValidate)) {
        let par = {
          ...this.formValidate
        }
        par['content'] = JSON.stringify(par['content'])
        this.$http.rq({
          url: articleApi.news,
          method: 'post',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.formValidate = {
              scenicName: '',
              lat: '',
              lon: '',
              coverUrl: '',
            };
          } else {
            this.$Message.error(res.message)
          }
        })

      } else {
        this.$Message.warning('请填写完整！')
      }

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
                percent: percent.val,
              }
            })
          }
        });


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
                  percent: percent.val,
                }
              })
            }
          });

        }

      }
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
    justify-content: space-between;
    align-items: center;

    .top-left {
      // width: 20%;
      // display: flex;
      // justify-content: space-between;
    }

    .top_right {
      width: 80%;
    }
  }
}

.search {
  position: absolute;
  left: 25px;
  top: 540px;
}

.bottom {
  display: flex;
  justify-content: space-around;

  .scenic {
    display: flex;
    flex-direction: column;
  }
}
</style>
