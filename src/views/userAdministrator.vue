<template>
  <div class="herder">
    <card>
      <div class="top">
        <div class="top-left">
          <Row>
            <Col span="16">
            <DatePicker type="daterange" :clearable="false" v-model="allData.date" :editable="false" split-panels placeholder="Select date"></DatePicker>
            </Col>
            <Col span="6">
            <Button type="primary" style="margin-left:20px" @click="seeabout">确定</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" show-total :current="pageNumber" :pageSize="pageSize" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
import fetch from '../assets/tools/http'
import commonApi from '../assets/api/common.js'
export default {
  data () {
    return {
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      allData: {
        date: [this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD')]
      },
      tableData: [],
      columns1: [
        {
          title: '用户名称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '头像',
          key: 'avatarUrl',
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
                    src: params.row.avatarUrl,
                    style: 'width: 100px;height: 60px'
                  }
                })
              ]);
          }
        },
        {
          title: '用户ID',
          key: 'openId',
          align: 'center'
        },
        {
          title: '授权时间',
          key: 'createTime',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let tiem = row.createTime.slice(0, 10)
            return h(
              'div',
              {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                  }
                }
              },
              row.createTime == '' ? row.createTime : tiem
            )
          }
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h(
              'div', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                  }
                }
              },
              row.gender == '0' ? '未知' : row.gender == '1' ? '男' : '女'
            )
          }
        },
        {
          title: '地区',
          key: 'city',
          align: 'center'
        },
        {
          title: '消费金额(元)',
          key: 'consumption',
          align: 'center'
        },
        // {
        //   title: '禁用/启用',
        //   key: 'address',
        //   align: 'center',
        //   render: (h, params) => {
        //     let row = params.row
        //     return h(
        //       'Button',
        //       {
        //         props: {
        //           type: 'success',
        //           size: 'small'
        //         },
        //         on: {
        //           click: () => {
        //             this.imgSrc = row.id
        //             this.useCar_modal = true
        //           }
        //         }
        //       },
        //       '禁用'
        //     )
        //   }
        // },
        // {
        //   title: '删除',
        //   key: 'address',
        //   align: 'center',
        //   render: (h, params) => {
        //     let row = params.row
        //     return h(
        //       'Button',
        //       {
        //         props: {
        //           type: 'error',
        //           size: 'small'
        //         },
        //         on: {
        //           click: () => {
        //             this.rejuet(params)
        //           }
        //         }
        //       },
        //       '删除'
        //     )
        //   }
        // }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {

    //搜索
    seeabout () {
      this.pageNumber = 1
      this.getData()
    },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },

    //获取用户列表分页
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        startTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTim: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http
        .rq({
          url: commonApi.wxAccount,
          data: par,
        })
        .then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.tableData = res.data
            this.total = res.total
          } else {
            this.tableData = []
            this.total = 0

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
    justify-content: space-between;
    align-items: center;
    .top-left {
    }
    .top_right {
      width: 80%;
    }
  }
}
</style>
