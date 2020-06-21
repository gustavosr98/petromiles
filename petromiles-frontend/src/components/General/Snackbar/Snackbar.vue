<template>
    <v-snackbar
      v-model="visible"
      :timeout="timeout"
    >
      {{ text }}
      <v-btn
          color="warning"
          text              
          @click="visible = false"
        >
          {{ $t("common.Close") }}
        </v-btn>              
    </v-snackbar>
</template>

<script>

export default {
    name: "snackbar",
    props: {
        show: { type: Boolean, required: true },
        text: { type: String, required: true },
    },
    data(){
        return {
            timeout: 20000,
            visible: false,
        }
    },
    watch: {
        show: function(){
            this.visible = this.show;
        },
        visible: function() {
            if(this.visible === false){
                this.informParent();
            }
        }
    },
    methods: {        
        informParent(){
            this.$emit("close");
        }
    }
   
}
</script>

<style>
</style>
