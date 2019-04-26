<template>
  <div class="herder">
    <card>
      <Tabs>
        <TabPane label="景区分类管理" icon="ios-clipboard-outline">
          <labormanagement></labormanagement>
        </TabPane>
        <TabPane label="景区标签管理" icon="ios-reverse-camera-outline">
          <management></management>
        </TabPane>

      </Tabs>

    </card>
  </div>
</template>
<script>
import labormanagement from '../Classification/labormanagement.vue'
import management from '../Classification/management.vue'
export default {
  components: {
    labormanagement,
    management,
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
// .herder {
//   height: 100%;
//   .top {
//     // height: 60px;
//     display: flex;
//     align-items: center;
//   }
//   .bottom {
//     display: flex;
//     justify-content: space-around;
//   }
// }
</style>

