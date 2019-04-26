<template>
  <div class="herder">
    <Card>
      <Layout :style="{padding: '0 24px 24px'}">
        <Breadcrumb :style="{margin: '24px 0'}">
          <BreadcrumbItem><span style="cursor:pointer" @click="$router.push({name: '销售管理'})">销售管理</span></BreadcrumbItem>
          <BreadcrumbItem>语音数据管理</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
          <div style="min-height: 200px;">
            <div class="top">
              <div class="top-left">
                <div class="top">
                  <Row>
                    <Col span="6">
                    <Date-picker :editable="false" @on-change="getStartTime" type="date" placeholder="选择日期" v-model="formValidate.beginTime" format="yyyy-MM-dd" :value.sync="formValidate.date"></Date-picker>
                    </Col>
                    <Col span="6">
                    <Date-picker :editable="false" @on-change="getEndTime" style="margin-left:10px" type="date" placeholder="选择日期" v-model="formValidate.endTime" format="yyyy-MM-dd" :value.sync="formValidate.date"></Date-picker>
                    </Col>
                    <Col span="6">
                    <Input style="margin-left:10px;" placeholder="请输入查询内容" />
                    </Col>
                    <Col span="6">
                    <Button type="primary" style="margin-left:20px" @click="seeabout">确定</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div>
              <Table border :columns="columns1" :data="tableData"></Table>
              <div class="earnings">
                <span>收入多少元</span>
                <span>总销售多少份</span>
                <span>收入多少元</span>
                <span>共XX个解说 12个解说收益</span>
              </div>
              <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                  <Page :total="total" :current="pageNumber" @on-change="changePage"></Page>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>

    </card>
  </div>
</template>
<script>
import fetch from '../../assets/tools/http'
import commonApi from '../../assets/api/common.js'
export default {
  data () {
    return {
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      value2: '',
      formValidate: {
        beginTime: '',
        endTime: ''
      },
      tableData: [

      ],
      columns1: [
        {
          title: '景区名称',
          key: 'scenicName'
        },
        {
          title: '管理景区账户',
          key: 'scenicAdminId',
        },
        {
          title: '解说员昵称',
          key: 'nickName'
        },
        {
          title: '解说员ID',
          key: 'narratorId'
        },
        {
          title: '解说数量',
          key: 'voicePrice'
        },
        {
          title: '总销量',
          key: 'sellCount'
        },
        {
          title: '销售总额',
          key: 'address'
        },
        {
          title: '提成总额',
          key: 'address'
        },
      ],
      Vehicleid: '',//解说员ID
    }
  },
  created () {
    if (this.$route.params.id != undefined) {
      this.Vehicleid = this.$route.params.id
    } else {

    }
    this.getData()
  },
  methods: {
    //改变时间
    getStartTime (startTime) {
      this.formValidate.beginTime = startTime
    },
    getEndTime () {
      this.formValidate.endTime = startTime
    },
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        beginTime: this.formValidate.beginTime,
        endTime: this.formValidate.endTime,
        userId: this.Vehicleid,
        type: '2'
      }
      this.$http.rq({
        url: commonApi.getTypeSellPage,
        data: par
      }).then(res => {
        if (res.code === 200) {

          this.tableData = res.data
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
        }

      })
    },
    // 分页
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    seeabout () {
      this.pageNumber = 1
      this.getData()
    },
  }
}
</script>
<style lang="less" scoped>
.herder {
  height: 100%;
  .earnings {
    display: flex;
    justify-content: space-around;
  }
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


