<template>
  <div class="herder">
    <card>
      <Tabs>
        <TabPane label="用户搜索词" icon="ios-clipboard-outline">
          <searchterms></searchterms>
        </TabPane>
        <TabPane label="热门搜说词" icon="ios-reverse-camera-outline">
          <Hotword></Hotword>
        </TabPane>

      </Tabs>
    </card>

  </div>
</template>
<script>
import searchterms from '../components/searchterms.vue'
import Hotword from '../components/Hotword.vue'
export default {
  data () {
    return {

    }
  },
  components: {
    searchterms,
    Hotword,
  },
  methods: {
    changePage () {

    }
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;
  .herder-top {
    height: 60px;
    display: flex;
    justify-content: space-around;
  }
  .top {
    height: 50px;
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
</style>
