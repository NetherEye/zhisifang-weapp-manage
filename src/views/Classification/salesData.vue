<template>
  <div class="herder">
    <Card>
      <Layout :style="{padding: '0 24px 24px'}">
        <Breadcrumb :style="{margin: '24px 0'}">
          <BreadcrumbItem><span style="cursor:pointer" @click="$router.push({name: '销售管理'})">销售管理</span></BreadcrumbItem>
          <BreadcrumbItem>销售数据</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
          <div style="min-height: 200px;">
            <div class="top">
              <div class="top-left">
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

    </Card>
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
      formValidate: {
        beginTime: '',
        endTime: ''
      },
      tableData: [],
      columns1: [
        {
          title: '景区名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '解说数量',
          key: 'age',
          align: 'center',
        },
        {
          title: '设定售价',
          key: 'address',
          align: 'center',
        },
        {
          title: '折和',
          key: 'name',
          align: 'center',
        },
        {
          title: '实际售价',
          key: 'age',
          align: 'center',
        },
        {
          title: '销量',
          key: 'address',
          align: 'center',
        },
        {
          title: '收入',
          key: 'name',
          align: 'center',
        },
        {
          title: '该景点提成比例',
          key: 'age',
          align: 'center',
        },
        {
          title: '账号收益',
          key: 'address',
          align: 'center',
        },
      ],
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
        type: '1'
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


