<template>
    <div class="text-center">                    
        <v-col cols="12">                
            <h3>{{ $t("profile.PointsAvailable") }}</h3>                                                                                    
            <h1 class="pointsText">{{points}}</h1>
            <h3>{{ $t("profile.PointsInDollars") }}</h3>                                                                                    
            <h1 class="dolarsText">${{conversion.dollars}}</h1>            
        </v-col>        
    </div>
</template>

<script>
export default {
    data(){
        return {
            points: 0,
            conversion: {},
        };
    },
    async mounted(){
        this.conversion = await this.$http.get("user/points/conversion");
        this.points = parseInt(this.conversion.points);
    }
}
</script>

<style lang="scss" scoped>
.pointsText{    
    font-size: 30px;
    color: blue;
    margin-bottom: 5%;
}
.dolarsText{
    margin-bottom: 20%;
    font-size: 30px;
    color: green;
}</style>