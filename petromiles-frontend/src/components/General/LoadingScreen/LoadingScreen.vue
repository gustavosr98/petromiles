<template>
    <v-row>
      <v-col>
        <v-overlay :value="visible">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-col>
    </v-row> 
</template>

<script>
export default {
    name: "loading-screen",
    props: {
        visible: { default: false },
    },
    data(){
        return{

        }
    },    
    watch: {
        visible: function(newValue) {            
            this.visible = newValue;
        }
    }
}
</script>