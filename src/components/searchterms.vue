<template>
  <div class="herder">
    <card>
      <div class="top">
        <DatePicker type="daterange" :clearable="false" v-model="allData.date" :editable="false" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
        <Button type="primary" style="margin-left:10px" @click="search">搜索</Button>
      </div>
      <div>
        <Table :columns="columns11" :data="tableData" border></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" :current="pageNumber" show-total :pageSize="pageSize" @on-change="changePage"></Page>
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
      formValidate: {
        endTime: '',
        beginTime: ''
      },
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      tableData: [],
      allData: {
        date: [this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD')]

      },
      columns11: [
        {
          title: '关键词',
          key: 'keyWords',
          align: 'center'
        },
        {
          title: '搜索次数',
          key: 'searchCount',
          align: 'center'
        },
        {
          title: '占比指数',
          key: 'percentage',
          align: 'center'
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    search () {
      this.getData()
    },
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: commonApi.userSearchListpage,
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

    // 分页以及查询
    changePage (val) {
      this.pageNumber = val
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;
  .top {
    height: 60px;
    display: flex;
    align-items: center;
  }
}
</style>

